const settings = require('./settings');
const getlang = (langCode) => langCode || settings.DEF_LANG;

const fs = require('fs');
const path = require('path');

const createPath = (fileDir) => path.resolve(__dirname, `${fileDir}`);
const checkLength = (n, min, max) => n >= min && n <= max;

const drugNames = fs.readFileSync(createPath('./assets/drugs_names.txt'), 'utf-8')
                    .replace(/\r/g, '')
                    .split('\n');

const decodeReqToken = (req) => {
    if (!req.headers.authorization) return null;
    const token = req.headers.authorization.split(' ')[1];
    const decodedData = jwt.verify(token, process.env.SECRET);
    return decodedData;
}
                    

module.exports = {
    getlang, drugNames, checkLength
}