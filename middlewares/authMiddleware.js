const jwt = require('jsonwebtoken');
const msg = require('../messages');
const {getlang} = require('../util');

module.exports = function(req, res, next) {
    if (req.method == 'OPTION') next();
    
    const msgLang = msg[getlang(req.body.lang)];

    try {
        let token;
        try {
            token = req.headers.authorization?.split(' ')[1];
        } catch (e2) {
            return res.status(403).send({ error: msgLang.auth_required });
        }

        if (!token)
            return res.status(403).send({ error: msgLang.auth_required });

        const decodedData = jwt.verify(token, process.env.SECRET);
        req.user = decodedData;
        
        next();
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            // Invalid token format or signature
            return res.status(403).json({ error: msgLang.auth_required });
        } else if (e instanceof jwt.TokenExpiredError) {
            // Token has expired
            return res.status(401).json({ error: 'Token expired' });
        }
        console.log(e);
        res.status(500).send({error: 'Server Error'});
    }
}