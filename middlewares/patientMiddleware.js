const Project = require('../models/project');
const mongoose = require('mongoose');
const msg = require('../messages');
const {getlang} = require('../util');

module.exports = function(req, res, next) {
    if (req.method == 'OPTIONS') next();

    const msgLang = msg[getlang(req.params.lang)];
    try {
        const projectId = new mongoose.Types.ObjectId(req.params.projectId);
        const patientId = new mongoose.Types.ObjectId(req.params.patientId);

        Project.findById(projectId).then((project) => {
            const patientIndex = project.patients.findIndex(patient => patient._id.equals(patientId));

            if (patientIndex == -1)
                return res.status(404).send({ error: msgLang.patient_not_found })
            
            next();
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({error: msgLang.server_error});
    }
}