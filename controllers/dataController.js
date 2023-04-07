const fs = require('fs');
const path = require('path');
const { getlang } = require('../util');
const { drugNames } = require('../util');
const msg = require('../messages');
const User = require('../models/user');

class DataController {
    async drugnames(req, res) {
        res.status(200).send(drugNames);
    }

    async myInfo(req, res) {
        const msgLang = msg[getlang(req.params.lang)];

        try {
            User.findById(req.user.id).then((user) => {
                res.status(200).send({
                    _id: user._id,
                    username: user.username,
                    name: user.name,
                    email: user.email
                })
            });
        } catch (e) {
            console.log(e);
            res.status(500).send({error: msgLang.server_error});
        }
    }
}

module.exports = new DataController();