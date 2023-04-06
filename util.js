const settings = require('./settings');
const getlang = (langCode) => langCode || settings.DEF_LANG;

const fs = require('fs');
const path = require('path');

const createPath = (fileDir) => path.resolve(__dirname, `${fileDir}`);

const drugNames = fs.readFileSync(createPath('./assets/drugs_names.txt'), 'utf-8')
                    .replace(/\r/g, '')
                    .split('\n');

module.exports = {
    getlang, drugNames
}