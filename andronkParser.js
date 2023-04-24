const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const Project = require('./models/project');

const parse = (data) => {
    const projJson = JSON.parse(data);
    const ObjectId = mongoose.Types.ObjectId;
    const project = new Project();
    project.drugs = projJson.drugs;
    project.createdAt = new Date(projJson.created);
    project.editedAt = new Date(projJson.edited);
    project.creator = null;

    for (const id in projJson.patients) {
        if (Object.hasOwnProperty.call(projJson.patients, id)) {
            const patient = projJson.patients[id];
            
            const drugs = [];

            for (let i = 0; i < patient.drugs.length; i++) {
                const drugObj = patient.drugs[i];
                drugs.push({ id: drugObj.id, amount: drugObj.amount });
            }
            const creatorId = new mongoose.Types.ObjectId('643242df9bc66ff25a2e927e');
            project.patients.push({
                _id: new mongoose.Types.ObjectId(),
                name: patient.name,
                birthday: patient.birthday,
                card: patient.card,
                scheme: patient.scheme,
                diagnosis: patient.diagnosis,
                drugs: drugs,
                settings: {
                    shared_to: []
                },
                creator: creatorId
            })
        }
    }
    return project;
};

const parseAndronk = (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) return reject(err);
        const project = parse(data);
        project.name = path.parse(filePath).name;
        resolve(project);
      });
    });
};  

module.exports = parseAndronk;
