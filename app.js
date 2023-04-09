const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const andronkParser = require('./andronkParser');
const app = express();
const bcrypt = require('bcryptjs');
const msg = require('./messages');
const authController = require('./controllers/authController');
// const loginMiddleware = require('./middlewares/authMiddleware');
const authRouter = require('./routers/authRouter');
const dataRouter = require('./routers/dataRouter');
const projectRouter = require('./routers/projectRouter');

const Project = require('./models/project');
const User = require('./models/user');

// app.set('view engine', 'ejs');
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

const parseAndronksss = () => {

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
};

const start = async () => {
    try {
        mongoose
        .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((res) => {
            console.log('Connected to DB!');
            // -----------parseAndronksss();
        })
        .catch((err) => console.log(err));
        
        app.listen(process.env.PORT, 'localhost', (error) => error ? console.log(error) : console.log(`listening port ${process.env.PORT}`));
        app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));


    }catch (e) {
        console.log(e);
    }
}

start();