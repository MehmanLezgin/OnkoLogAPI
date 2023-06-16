const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const msg = require('../messages/messages');
const settings = require('../settings');
const {getlang, checkLength, isValidEmail, isValidName, isValidUsername} = require('../util');
// import { lang } from './util';
// const lang = (req) => req.query.lang || settings.DEF_LANG;

const validResult = (body, lang) => {
    const { username, name, email, password } = body;
  
    const errors = [];
    const msgLang = msg[getlang(lang)];

    if (!username) {
        errors.push({ field: 'username', message: msgLang.username_err });
    } else if (!checkLength(username.length, settings.USERNAME_MIN_LEN, settings.USERNAME_MAX_LEN)) {
        errors.push({ field: 'username', message: msgLang.username_len_err });
    } else if (!isValidUsername(username)) {
        errors.push({ field: 'username', message: msgLang.username_format_err });
    }

    if (!name) {
        errors.push({ field: 'name', message: msgLang.name_err });
    } else if (!checkLength(name.length, settings.NAME_MIN_LEN, settings.NAME_MAX_LEN)) {
        errors.push({ field: 'name', message: msgLang.name_len_err });
    } else if (!isValidName(name)) {
        errors.push({ field: 'name', message: msgLang.name_format_err });
    }

    if (!email) {
        errors.push({ field: 'email', message: msgLang.email_err });
    } else if (!isValidEmail(email)) {
        errors.push({ field: 'email', message: msgLang.email_format_err });
    }

    if (!password) {
        errors.push({ field: 'password', message: msgLang.password_err });
    } else if (!checkLength(password.length, settings.PASSWORD_MIN_LEN, settings.PASSWORD_MAX_LEN)) {
        errors.push({ field: 'password', message: msgLang.password_len_err });
    }

    return errors;
};

const generateAccessToken = (id, username) => {
    const payload = { id, username };
    return jwt.sign(payload, process.env.SECRET, { expiresIn: settings.PASSWORD_EXPIRES_IN });
};

class AuthController {
    async signin(req, res) {
        try {
            let { username, password } = req.body;
            username = username?.trim();
            password = password?.trim();

            const msgLang = msg[getlang(req.params.lang)];

            if (!username?.length || !password?.length)
                return res.status(400).send({ error: msgLang.sign_in_empty_err })

            let user;

            // search by username
            user = await User.findOne({ username });
            if (!user) {
                // search by email
                user = await User.findOne({ email: username });
    
                if (!user) {
                    return res.status(400).send({ error: msgLang.user_not_found });
                }
            }
            
            const isPasswordValid = bcrypt.compareSync(password, user.password);

            if (!isPasswordValid)
                return res.status(400).send({ error: msgLang.wrong_password });

            const token = generateAccessToken(user._id, user.username);
            return res.status(200).send({token});
            
        } catch (e) {
            console.log(e);
            res.status(300).end();
        }
    }

    async signup(req, res) {
        try {
            const { username, name, email, password } = req.body;

            req.body.username = username?.trim().toLowerCase();
            req.body.name = name?.trim();
            req.body.email = email?.trim();
            req.body.password = password?.trim();

            const errors = validResult(req.body, req.params.lang);

            if (errors.length) {
                return res.status(400).send({ errors })
            }
            
            const msgLang = msg[getlang(req.params.lang)];

            let user = null;

            // is username used
            user = await User.findOne({ username })
            if (user)
                return res.status(400).send({ message: msgLang.username_taken});
                

            // is email used
            user = await User.findOne({ email })
            if (user)
                return res.status(400).send({ message: msgLang.email_taken});
            

            const hashPassword = bcrypt.hashSync(password, 7);
            user = new User({
                username, name, email, password: hashPassword
            });
            user.save().then((data) => {
                res.status(200).send({ message: msgLang.signup_success });
            }).catch((e) => {
                res.status(400).send({error: msgLang.signup_err})
                console.log(e);
            })
        } catch (e) {
            console.log(e);
            res.status(300).end();
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).send(users);
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    }
    
    async getUsernameById(req, res) {
        try {
            console.log(req.query);
            User.findById(req.query.id).then((user) => {
                console.log(user);
                if (!user) return res.status(404).send({error: getlang(req.params.lang).user_not_found});
                res.status(200).send(user.username);
            });
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    }

    async logout(req, res) {
        req.setHeader('Authorization', 'Basic');
        res.status(200).end();
    }
}

module.exports = new AuthController();