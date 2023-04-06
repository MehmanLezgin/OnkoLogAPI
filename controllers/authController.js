const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const msg = require('../messages');
const settings = require('../settings');
const {getlang} = require('../util');
// import { lang } from './util';
// const lang = (req) => req.query.lang || settings.DEF_LANG;

const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

const isValidName = (name) => {
    const nameRegex = /^[\p{L}\s'-]+$/u;
    return nameRegex.test(name);
}

function isValidUsername(username) {
    const regex = /^[A-Za-z0-9_]+$/;
    return regex.test(username);
}  

const checkLength = (n, min, max) => n >= min && n <= max;

const validResult = (body) => {
    const { username, name, email, password, lang } = body;
  
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
            let { username, password, lang } = req.body;
            username = username?.trim();
            password = password?.trim();

            const msgLang = msg[getlang(lang)];

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
            const { username, name, email, password, lang } = req.body;

            req.body.username = username?.trim();
            req.body.name = name?.trim();
            req.body.email = email?.trim();
            req.body.password = password?.trim();
            req.body.lang = lang?.trim();

            const errors = validResult(req.body);

            if (errors.length) {
                return res.status(400).send({ errors })
            }
            
            
            const msgLang = msg[getlang(lang)];

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
                res.status(200).end();
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
            res.status(300).end();
        }
    }

    async logout(req, res) {
        req.setHeader('Authorization', 'Basic');
        res.status(200).end();
    }
}

module.exports = new AuthController();