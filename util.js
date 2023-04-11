const settings = require('./settings');
const getlang = (langCode) => langCode || settings.DEF_LANG;

const fs = require('fs');
const path = require('path');

const createPath = (fileDir) => path.resolve(__dirname, `${fileDir}`);
const checkLength = (n, min, max) => n >= min && n <= max;

const drugNames = fs.readFileSync(createPath('../assets/drugs_names.txt'), 'utf-8')
                    .replace(/\r/g, '')
                    .split('\n');

const decodeReqToken = (req) => {
    if (!req.headers.authorization) return null;
    const token = req.headers.authorization.split(' ')[1];
    const decodedData = jwt.verify(token, process.env.SECRET);
    return decodedData;
}

const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

const isValidName = (name) => {
    const nameRegex = /^[\p{L}\s'-]+$/u;
    return nameRegex.test(name);
}

const isValidUsername = (username) => {
    const regex = /^[A-Za-z0-9_]+$/;
    return regex.test(username);
}
                    

module.exports = {
    getlang, drugNames, checkLength, decodeReqToken, isValidEmail, isValidName, isValidUsername
}