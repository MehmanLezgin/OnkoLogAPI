// aaa
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const andronkParser = require('./andronkParser');
const app = express();

const Project = require('./models/project');

app.set('view engine', 'ejs');

mongoose
    .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => {
        console.log('Connected to DB!');
        
    }).catch((err) => {
        console.log(err);
    });

const createPath = (fileDir) => path.resolve(__dirname, `${fileDir}`);
const createPathView = (page) => path.resolve(__dirname, 'views', `${page}.ejs`);


const drugNames = fs.readFileSync(createPath('assets/drugs_names.txt'), 'utf-8')
                    .replace(/\r/g, '')
                    .split('\n');

app.listen(process.env.PORT, 'localhost', (error) => {
    error ? console.log(error) : console.log(`listening port ${process.env.PORT}`);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.static('styles'));

app.get('/', (req, res) => {
    // res.render(createPath('index'));
    
    andronkParser('C:/android/AndrOnk/Projects/2022/Avqust2022.andronk')
    .then((data) => res.send(data));
    
    /*andronkParser('C:/android/AndrOnk/Projects/2022/Avqust2022.andronk')
            .then((data) => {
                data
                    .save()
                    .then((res) => {
                        res.send(data)
                    })
                    .catch((err) => console.log(err));
            });*/
});

app.get('/home', (req, res) => {
    res.redirect('/');
});

app.get('/posts/:id', (req, res) => {
    const post = {
        id: 1,
        title: 'My post',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        date: '04.04.2023'
    }
    res.render(createPathView('post'), { post });
});

app.get('/project', async (req, res) => {
    projName = req.query.name;
    creator = req.query.creator;
    
    Project.findOne({ name: { $regex: new RegExp(`^${projName}$`, 'i') } })
        .then((project) => {
            res.status(project == null ? 404 : 200).render(createPathView('project'), { project, drugNames});
        }).catch((err) => {
            console.log(err);
            res.end();
        })
});

app.get('/add-project', async (req, res) => {
    // fileName = req.query.file_name;
    // if (fileName == undefined) return res.end();
    return;
    const fileDir = `C:/android/AndrOnk/Projects/2022/`;
    fs.readdir(fileDir, (err, files) => {
        files.forEach(file => {
            if (path.extname(file) != '.andronk') return;
            // console.log(file);
            
            andronkParser(`C:/android/AndrOnk/Projects/2022/${file}`)
                .then((project) => {
                    console.log(project);
                    project.save()
                    .catch((err) => {
                        console.log(err); 
                    });
                });

        });
        res.end();
    });
});

app.get('/contacts', (req, res) => {
    const contacts = [
        { name: 'YouTube', link:'https://youtube.com' },
        { name: 'Google', link:'https://google.com' },
        { name: 'Facebook', link:'https://facebook.com' }
    ]
    res.render(createPathView('contacts'), { contacts });
});

app.use((req, res) => {
    res
        .status(404)
        .render(createPathView('error'));
});