const fs = require('fs');
const path = require('path');
const { getlang } = require('../util');
const { drugNames, diagnosis, therapySchemes, drugNamesExtended } = require('../util');
const msg = require('../messages/messages');
const User = require('../models/user');

const profileImgDir = "./user_data/profile/";
const defaultProfileImgDir = "./assets/default_profile.jpg";

class DataController {
    async getDrugnames(req, res) {
        res.status(200).send(drugNames);
    }
    
    async getDiagnosis(req, res) {
        res.status(200).send(diagnosis);
    }
    
    async getTherapySchemes(req, res) {
        res.status(200).send(therapySchemes);
    }

    async drugnamesExtended(req, res) {
        res.status(200).send(drugNamesExtended);
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

    async myProfileImg(req, res) {
        const msgLang = msg[getlang(req.params.lang)];

        try {
            const user = await User.findById(req.user.id);
            const imagePath = `${profileImgDir}${user._id}.jpg`;
            fs.readFile(imagePath, (err, img) => {
                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                if (err) {
                    console.log(err);
                    return fs.readFile(defaultProfileImgDir, (err, defaultImg) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).end();
                        }
                        res.status(200).end(defaultImg);
                    });
            }
            return res.end(img);
            });
        } catch (e) {
            console.log(e);
            res.status(500).send({error: msgLang.server_error});
        }
    }
}

module.exports = new DataController();