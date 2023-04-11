const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log('Server Request');
    // console.log('TEST TEST TEST');
    console.log(req.url);
    res.setHeader('Content-Type', 'text/html');

    let filePath = './views/error.html';

    switch (req.url) {
        case '/index.html':
        case '/index':
        case '/home':
        case '/':
            filePath = './views/index.html';
            break;
            
        case '/contacts':
            filePath = './views/contacts.html';
            break;
    }

    fs.readFile(filePath, (err, data) => {
        if (err)
            console.log(err);
        else
            res.write(data);
        res.end();
    });
});

server.listen(PORT, 'localhost', (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
});