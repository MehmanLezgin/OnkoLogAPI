const jwt = require('jsonwebtoken');
const msg = require('../messages');
const {getlang} = require('../util');

module.exports = function(req, res, next) {
    if (req.method == 'OPTION') next();

    try {

        const msgLang = msg[getlang(req.body.lang)];

        const token = req.headers.authorization?.split(' ')[1];

        if (!token)
            return res.status(403).send({ error: msgLang.auth_required });

        const decodedData = jwt.verify(token, process.env.SECRET);
        req.user = decodedData;
        
        next();
    } catch (e) {
        console.log(e);
        
        res.status(300).end();
    }
}