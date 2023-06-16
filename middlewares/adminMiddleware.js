const User = require('../models/user');
const jwt = require('jsonwebtoken');
const msg = require('../messages/messages');
const {getlang} = require('../util');

module.exports = function(req, res, next) {
    if (req.method == 'OPTION') next();

    try {
        // const token = req.headers.authorization.split(' ')[1];
        // const decodedData = jwt.verify(token, process.env.SECRET);
        // const { id } = decodedData;
        const id = req.user.id;

        User.findById(id).then((user) => {
            if (!user.isAdmin) return res.status(200).end();
            next();
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({error: 'Server Error'});
    }
}