const fs = require('fs');
const path = require('path');

const { drugNames } = require('../util');

// const createPath = (fileDir) => path.resolve(__dirname, `${fileDir}`);

// const drugNames = fs.readFileSync(createPath('../assets/drugs_names.txt'), 'utf-8')
//                     .replace(/\r/g, '')
//                     .split('\n');

class DataController {
    async drugnames(req, res) {
        res.status(200).send(drugNames);
    }
}

module.exports = new DataController();