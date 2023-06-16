const settings = require('../settings');
const messages_en = require('./messages_en');
const messages_lez = require('./messages_lez');
const messages_ru = require('./messages_ru');
const messages_az = require('./messages_az');

const messages = {
    'en': messages_en,
    'lez': messages_lez,
    'ru': messages_ru,
    'az': messages_az
}
module.exports = messages;