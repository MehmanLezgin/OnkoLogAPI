const EventEmitter = require('events');
const util = require('util');
const emitter = new EventEmitter();


class Logger {
    log = (msg) => {
        console.log(msg);
        this.emit('blabla', {id:228, text: 'haha classic'});
    }
}
util.inherits(Logger, EventEmitter);
module.exports = Logger;