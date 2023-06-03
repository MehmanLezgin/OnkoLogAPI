const express = require('express');
const rateLimit = require('express-rate-limit');

const mongoose = require('mongoose');
const functions = require('firebase-functions');
require('dotenv').config();
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const andronkParser = require('./andronkParser');
const app = express();
const util = require('./util');
// const loginMiddleware = require('./middlewares/authMiddleware');
const authRouter = require('./routers/authRouter');
const dataRouter = require('./routers/dataRouter');
const projectRouter = require('./routers/projectRouter');

const PORT = process.env.PORT;
// const Project = require('./models/project');
// const User = require('./models/user');
const limiter = rateLimit({
    windowMs: 10 * 1000, 
    max: 30, // limit each IP to 100 requests per windowMs
    message: {error: 'Please try again later'},
});
  
app.use(limiter);   // apply the rate limiter to all requests
app.use(express.json());
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      res.status(400).json({ error: 'Invalid JSON payload' });
    } else {
        next();
    }
});  

app.use('/:lang/api/auth', authRouter);
app.use('/:lang/api/project', projectRouter);
app.use('/:lang/api/data', dataRouter);
app.use((req, res) => res.status(404).send({ error: '404 Not found' }) );

/*const parseAndronksss = () => {

    const fileDir = `C:/android/AndrOnk/Projects/Full/`;
    fs.readdir(fileDir, (err, files) => {
            files.forEach(file => {
                if (path.extname(file) != '.andronk') return;
    
                andronkParser(`${fileDir}${file}`).then((project) => {
                    console.log(project.name+' : DONE');
                    project.save()
                .catch((err) => {
                    console.log(err); 
                });
            });
        });
    });
};*/

const start = async () => {
    try {
        mongoose
        .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((res) => {
            console.log('Connected to DB!');
            // -----------parseAndronksss();
            // fixProjectDates();
        })
        .catch((err) => console.log(err));
        
        app.listen(PORT, (error) => error ? console.log(error) : console.log(`listening port ${PORT}`));
        app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));


    }catch (e) {
        console.log(e);
    }
}

start();

exports.app = functions.https.onRequest(app);

/*fs.readFile('C:/android/AndrOnk/Projects/Full/Aprel2023.andronk', (err, data) => {
    if (err) return console.log(err);
    
    const today = new Date();
    const monthIdx = today.getMonth();
    const year = today.getFullYear();
    util.exportPatientsXLSXAsync(JSON.parse(data.toString()).patients, true, true, monthIdx, year)
        .then(wb =>
            wb.write('aaa.xlsx')
        )
});*/