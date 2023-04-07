const Project = require('../models/project');
const Patient = require('../models/patient');
const User = require('../models/user');
const msg = require('../messages')
const { getlang, checkLength, isValidName } = require('../util');
const settings = require('../settings');
const mongoose = require('mongoose');
const { hash } = require('bcryptjs');


class ProjectController {
    async myProjectsInfo(req, res) {
        try {
            const projects = await Project.find({ creator: req.user.id });

            const projectNames = projects.map(project => ({
                name: project.name,
                _id: project._id,
                patientsAmount: project.patients.length,
                shared_to: project.settings.shared_to,
                createdAt: project.createdAt,
                editedAt: project.editedAt
            }));
            res.status(200).send(projectNames);
        } catch (err) {
            console.error(err.message);
            res.status(500).send({error: msgLang.server_error});
        }
    }

    async sharedProjectsInfo(req, res) {
        const msgLang = msg[getlang(req.params.lang)];
        try {
            const userId = new mongoose.Types.ObjectId(req.user.id)
            const projects = await Project.find({ 'settings.shared_to': { $elemMatch: { $eq: userId } } });
            
            const projectNames = projects.map(project => ({
                _id: project._id,
                name: project.name,
                patientsAmount: project.patients.length,
                creator: project.creator,
                createdAt: project.createdAt,
                editedAt: project.editedAt
            }));
            res.status(200).send(projectNames);
        } catch (err) {
            console.error(err.message);
            res.status(500).send({error: msgLang.server_error});
        }
    }

    async getProject(req, res) {
        const msgLang = msg[getlang(req.params.lang)];
        try {
            const projectId = new mongoose.Types.ObjectId(req.params.projectId);

            Project.findById(projectId).then((project) => {
                return res.status(200).send(project);
            });
        } catch (e) {
            console.error(err.message);
            res.status(500).send({error: msgLang.server_error});
        }
    }

    async getDrugs(req, res) {
        const msgLang = msg[getlang(req.params.lang)];
        try {
            const projectId = new mongoose.Types.ObjectId(req.params.projectId);

            Project.findById(projectId).then((project) => {
                return res.status(200).send(project.drugs);
            });
        } catch (e) {
            console.error(err.message);
            res.status(500).send({error: msgLang.server_error});
        }
    }

    async getPatients(req, res) {
        const msgLang = msg[getlang(req.params.lang)];
        try {
            const projectId = new mongoose.Types.ObjectId(req.params.projectId);

            Project.findById(projectId).then((project) => {
                return res.status(200).send(project.patients);
            });
        } catch (e) {
            console.error(err.message);
            res.status(500).send({error: msgLang.server_error});
        }
    }

    async deleteProject(req, res) {
        try {
            const projectId = new mongoose.Types.ObjectId(req.params.projectId);
            const projectName = req.params.project_name;
            const msgLang = msg[getlang(req.params.lang)];
            Project.findById(projectId).then((project) => {
                if (!new mongoose.Types.ObjectId(req.user.id).equals(project?.creator))
                    return res.status(403).send({ error: msgLang.project_access_denied });
                    
                if (projectName != project.name)
                    return res.status(403).send({ error: msgLang.project_delete_failed });
                    
                Project.findOneAndDelete(projectId).then((project, err) => {
                    if (err)
                        return res.status(500).send({ error: msgLang.project_deleting_failed });

                    return res.status(403).send({ message: msgLang.project_delete_success });
                });
            })
        } catch (e) {
            console.error(err.message);
            res.status(500).send({error: msgLang.server_error});
        }
    }

    async createProject(req, res) {
        try {
            const projectName = req.body?.name;
            const userId = new mongoose.Types.ObjectId(req.user.id);
            const msgLang = msg[getlang(req.params.lang)];

            Project.findOne({name: projectName, creator: userId}).then((project) => {
                if (project)
                    return res.status(403).send({ error: msgLang.project_name_taken })
                                        
                if (!checkLength(projectName?.length, settings.PROJECT_NAME_MIN_LEN, settings.PROJECT_NAME_MAX_LEN))
                    return res.status(403).send({ error: msgLang.project_name_len_err })

                if (!(/^[a-zA-Z0-9_\p{L}]+$/u).test(projectName))
                    return res.status(403).send({ error: msgLang.project_name_format_err });
                new Project({
                    name: projectName,
                    creator: userId
                }).save().then((project, err) => {
                    if (err)
                        return res.status(403).send({ error: msgLang.project_create_failed });
                        
                    res.status(200).send({ message: msgLang.project_create_success, project});
                });
            })
        } catch (e) {
            console.error(err.message);
            res.status(500).send({error: msgLang.server_error});
        }
    }

    async getUserIdsByUsernames(req, res, list) {
        if (!list) return [];
        const users = await User.find({ username: { $in: list } });
        const userIds = users.map(user => user._id);
        return userIds;
    }
    
    async setShareList(req, res) {
        const msgLang = msg[getlang(req.params.lang)];
        try {
            const projectId = new mongoose.Types.ObjectId(req.params.projectId);
            const shareUsernames = req.body.users;
            console.log(shareUsernames);
            const userId = new mongoose.Types.ObjectId(req.user.id);

            const users = await User.find({ username: { $in: shareUsernames } });
            const shareUserIds = users.map(user => user._id);
            const updatedProject = await Project.findByIdAndUpdate(projectId, { 'settings.shared_to': shareUserIds }, { new: true });
            
            res.status(200).send({ message: msgLang.project_share_success });
            console.log(updatedProject);
        } catch (e) {
            console.log(e);
            res.status(500).send({error: msgLang.server_error});
        }
    }
    
    async renameProject(req, res) {
        const msgLang = msg[getlang(req.params.lang)];
        try {
            if (!req.isOwnProject)
                return res.status(403).send({ error: msgLang.project_access_denied });

            const projectNewName = req.body?.name;
            const projectId = new mongoose.Types.ObjectId(req.params.projectId);
            const userId = new mongoose.Types.ObjectId(req.user.id);

            Project.findOne({name: projectNewName, creator: userId}).then((project) => {
                if (project && !projectId.equals(project._id))
                    return res.status(403).send({ error: msgLang.project_name_taken })
                                        
                if (!checkLength(projectNewName?.length, settings.PROJECT_NAME_MIN_LEN, settings.PROJECT_NAME_MAX_LEN))
                    return res.status(403).send({ error: msgLang.project_name_len_err })

                Project.findById(projectId).then((project) => {
                    project.name = projectNewName;
                    project.save().then(() => {
                        res.status(200).send({ message: msgLang.project_rename_success });
                    }).catch((e) => {
                        res.status(500).send({ error: msgLang.server_error });
                    });
                });
            });
            
        } catch (e) {
            console.log(e);
            res.status(500).send({error: msgLang.server_error});
        }
    }
}


const validPatientInfo = (req, res) => {
    const { name, birthday, card, scheme, diagnosis, drugs } = req.body;
    
    const msgLang = msg[getlang(req.params.lang)];
    
    const error = {fields:[]};

    if (!name || typeof name !== 'string' || name.length < 3 || name.length > 100 || !isValidName(name)) {
        error.fields.push('name');
    }

    if (birthday != undefined && (typeof birthday !== 'number' || birthday < 0 || birthday > 2500 || birthday % 1 !== 0)) {
        error.fields.push('birthday');
    }

    if (card != undefined && (typeof card !== 'number' || card < 0 || card.toString().length > settings.CARD_MAX_LEN || card % 1 !== 0)) {
        error.fields.push('card');
    }

    if (scheme != undefined && (typeof scheme !== 'string' || scheme.length > settings.SCHEME_MAX_LEN)) {
        error.fields.push('scheme');
    }

    if (diagnosis != undefined && (!diagnosis || typeof diagnosis !== 'string' || diagnosis.length > settings.DIAGNOSIS_MAX_LEN)) {
        error.fields.push('diagnosis');
    }

    if (drugs != undefined) {
        if (!Array.isArray(drugs)) {
            error.fields.push('drugs');
        } else {
            drugs.every((drug, index) => {
                if (typeof drug.id !== 'number') {
                    error.fields.push(`drugs:${index}:id`);
                }
                if (typeof drug.amount !== 'number' || drug.amount < 0 || drug.amount > 99) {
                    error.fields.push(`drugs:${index}:amount`);
                }
            });
        }
    }

    if (error.fields.length > 0) {
        error.error = msgLang.err_check_entered_data;
        res.status(400).send(error);
        return false;
    }
    return true;
};


class PatientsController {
    async addPatient(req, res) {
        const msgLang = msg[getlang(req.params.lang)];

        try {
            if (validPatientInfo(req, res)) {
                req.body.name = req.body.name?.trim().replace(/\s+/g, " ");
                req.body.diagnosis = req.body.diagnosis?.trim().replace(/\s+/g, " ");
                req.body.scheme = req.body.scheme?.trim().replace(/\s+/g, " ");
            
                const { name, birthday, card, scheme, diagnosis, drugs } = req.body;
                
                const projectId = req.params.projectId;

                Project.findById(projectId).then((project) => {
                    if (!project) // newer reach (beacause projectMiddleware)
                        return res.status(404).send({error: msgLang.project_not_found });
                    
                    const patientIndex = project.patients.findIndex((p) => p.name === name);
                    if (patientIndex != -1) // patient with thjs already exist
                        return res.status(404).send({error: msgLang.patient_already_exist });

                    const patient = new Patient({ name,birthday,card,scheme,diagnosis,drugs });
                    
                    project.patients.push(patient);
                    
                    project.save().then(() => {
                        res.status(200).send({message: msgLang.patient_add_success})
                    });
                });
            }  
        } catch (e) {
            console.log(e);
            res.status(500).send({error: msgLang.server_error});
        }
    }

    async editPatient(req, res) {
        const msgLang = msg[getlang(req.params.lang)];

        try {
            if (validPatientInfo(req, res)) {
                req.body.name = req.body.name?.trim().replace(/\s+/g, " ");
                req.body.diagnosis = req.body.diagnosis?.trim().replace(/\s+/g, " ");
                req.body.scheme = req.body.scheme?.trim().replace(/\s+/g, " ");
            
                const { name, birthday, card, scheme, diagnosis, drugs } = req.body;

                const projectId = req.params.projectId;
                const patientId = req.params.patientId;

                Project.findById(projectId).then((project) => {
                    if (!project) // newer reach (beacause projectMiddleware)
                        return res.status(404).send({error: msgLang.project_not_found });

                    const patientIndex = project.patients.findIndex((p) => p.id === patientId);
                    if (patientIndex == -1)  // newer reach (beacause patientMiddleware)
                        return res.status(404).send({error: msgLang.patient_not_found });
                    
                    const patient = project.patients[patientIndex];

                    // Update patient data
                    patient.name = name !== undefined ? name : patient.name;
                    patient.birthday = birthday !== undefined ? birthday : patient.birthday;
                    patient.card = card !== undefined ? card : patient.card;
                    patient.scheme = scheme !== undefined ? scheme : patient.scheme;
                    patient.diagnosis = diagnosis !== undefined ? diagnosis : patient.diagnosis;
                    patient.drugs = drugs !== undefined ? drugs : patient.drugs;
                    
                    // Save changes to project
                    project.save().then(() => {
                        res.status(200).send({message: msgLang.patient_edit_success})
                    });
                });
            }
        } catch (e) {
            console.log(e);
            res.status(500).send({error: msgLang.server_error});
        }
    }

    async deletePatientById(req, res) {
        const msgLang = msg[getlang(req.params.lang)];

        try {
            const projectId = req.params.projectId;
            const patientId = req.params.patientId;

            const project = await Project.findByIdAndUpdate(
                projectId,
                { $pull: { patients: { _id: patientId } } },
                { new: true }
            );
        
            res.status(200).send({ message: msgLang.patient_delete_success, project});
        } catch (e) {
            console.log(e);
            res.status(500).send({error: msgLang.server_error});
        }
    }

    
    
}

module.exports = { ProjectController, PatientsController };