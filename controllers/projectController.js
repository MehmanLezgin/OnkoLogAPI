const Project = require('../models/project');
const User = require('../models/user');
const msg = require('../messages')
const { getlang, checkLength, isValidName, drugNames, exportPatientsXLSXAsync } = require('../util');
const settings = require('../settings');
const mongoose = require('mongoose');
const XLSX = require('excel4node');

const toObjectIdSafe = (res, id, message, errCode = 404) => {
    try {
        return new mongoose.Types.ObjectId(id);
    } catch (e1) {
        res.status(errCode).send({ error: message });
        return null;
    }
}


const calcUsedDrugs = (patients) => {
    let usedDrugs = [];

    for (let j = 0; j < patients.length; j++) {
        const patient = patients[j];
    
        if (!Array.isArray(patient.therapy)) continue;
        
        for (let j = 0; j < patient.therapy.length; j++) {
            const therapyItem = patient.therapy[j];
            
            if (!Array.isArray(therapyItem.drugs)) continue;
            
            for (let k = 0; k < therapyItem.drugs.length; k++) {
                const drug = therapyItem.drugs[k];
                
                if (typeof drug.id != 'number' || typeof drug.amount != 'number')
                   return;
                
                usedDrugs[drug.id] ??= 0;
                usedDrugs[drug.id] += drug.amount;
            }
        }
    }
    return usedDrugs;
};

const validDrug = (req, res) => {
    const { id, remainder, income } = req.body;

    const msgLang = msg[getlang(req.params.lang)];

    const error = { fields: [] };

    if (typeof id !== 'number' || id < 0 || id >= drugNames.length || id % 1 !== 0) {
        error.fields.push('id');
    }

    if (typeof remainder !== 'number' || remainder < 0 || remainder > 999 || remainder % 1 !== 0) {
        error.fields.push('remainder');
    }

    if (typeof income !== 'number' || income < 0 || income > 999 || income % 1 !== 0) {
        error.fields.push('income');
    }

    if (error.fields.length > 0) {
        error.error = msgLang.err_check_entered_data;
        res.status(400).send(error);
        return false;
    }
    return true;
};

class ProjectController {
    /*async myProjectsInfo(req, res) {
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
    }*/
    async myProjectsInfo(req, res) {
        try {
            const projects = await Project.find({ creator: req.user.id });

            const projectInfoList = [];

            for (const project of projects) {
                // Extract the _id values from shared_to field
                const sharedToIds = project.settings.shared_to;

                // Find the user objects for each shared_to _id
                const sharedToUsers = await User.find(
                    { _id: { $in: sharedToIds } },
                    { _id: 1, username: 1 }
                );

                // Create a list of objects containing _id and username fields for each user
                const sharedToUsernames = sharedToUsers.map(user => ({
                    _id: user._id,
                    username: user.username
                }));

                // Add the sharedToUsernames list to the projectNames object
                projectInfoList.push({
                    name: project.name,
                    _id: project._id,
                    patientsAmount: project.patients.length,
                    shared_to: sharedToUsernames,
                    createdAt: project.createdAt,
                    editedAt: project.editedAt
                });
            }

            res.status(200).send(projectInfoList);
        } catch (err) {
            console.error(err.message);
            res.status(500).send({ error: msgLang.server_error });
        }
    }

    /*async sharedProjectsInfo(req, res) {
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
    }*/

    async sharedProjectsInfo(req, res) {
        const msgLang = msg[getlang(req.params.lang)];
        try {
            const userId = new mongoose.Types.ObjectId(req.user.id);
            const projects = await Project.find({ 'settings.shared_to': { $elemMatch: { $eq: userId } } });

            const projectInfoList = [];
            for (const project of projects) {
                const creator = await User.findById(project.creator);
                projectInfoList.push({
                    _id: project._id,
                    name: project.name,
                    patientsAmount: project.patients.length,
                    creator: {
                        _id: creator?._id,
                        username: creator?.username
                    },
                    createdAt: project.createdAt,
                    editedAt: project.editedAt
                });
            }
            res.status(200).send(projectInfoList);
        } catch (err) {
            console.error(err);
            res.status(500).send({ error: msgLang.server_error });
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
            res.status(500).send({ error: msgLang.server_error });
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
            res.status(500).send({ error: msgLang.server_error });
        }
    }

    async getDrug(req, res) {
        const msgLang = msg[getlang(req.params.lang)];
        const drugId = parseInt(req.params.drugId);

        // Check if drugId is valid
        if (drugId < 0 || drugId >= drugNames.length) {
            return res.status(400).send({ error: msgLang.err_check_entered_data });
        }

        try {
            const projectId = new mongoose.Types.ObjectId(req.params.projectId);
            const project = await Project.findById(projectId);

            // Check if project has the drug with the given id
            const drug = project.drugs.find(d => d.id === drugId);
            if (!drug) {
                return res.status(200).send({ id: drugId, income: 0, remainder: 0 })
                // return res.status(404).send({ error: msgLang.drug_not_found });
            }

            return res.status(200).send(drug);
        } catch (e) {
            console.error(e);
            res.status(500).send({ error: msgLang.server_error });
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
            res.status(500).send({ error: msgLang.server_error });
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
                    return res.status(422).send({ error: msgLang.project_delete_failed });

                Project.findOneAndDelete(projectId).then((project, err) => {

                    return res.status(200).send({ message: msgLang.project_delete_success });
                }).catch(e => {
                    return res.status(500).send({ error: msgLang.project_deleting_failed });
                });
            })
        } catch (e) {
            console.error(err.message);
            res.status(500).send({ error: msgLang.server_error });
        }
    }

    async createProject(req, res) {
        try {
            const projectName = req.body?.name;
            const userId = new mongoose.Types.ObjectId(req.user.id);
            const msgLang = msg[getlang(req.params.lang)];

            Project.findOne({ name: projectName, creator: userId }).then((project) => {
                if (project)
                    return res.status(409).send({ error: msgLang.project_name_taken })

                if (!checkLength(projectName?.length, settings.PROJECT_NAME_MIN_LEN, settings.PROJECT_NAME_MAX_LEN))
                    return res.status(400).send({ error: msgLang.project_name_len_err })

                if (!(/^[a-zA-Z0-9_\p{L}]+$/u).test(projectName))
                    return res.status(400).send({ error: msgLang.project_name_format_err });
                new Project({
                    name: projectName,
                    creator: userId
                }).save().then((project, err) => {
                    res.status(201).send({ message: msgLang.project_create_success, project });
                }).catch(err => {
                    return res.status(500).send({ error: msgLang.project_create_failed });
                });
            })
        } catch (e) {
            console.error(err.message);
            res.status(500).send({ error: msgLang.server_error });
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

            const userId = new mongoose.Types.ObjectId(req.user.id);

            const users = await User.find({ username: { $in: shareUsernames } });
            const shareUserIds = users.map(user => user._id);
            const updatedProject = await Project.findByIdAndUpdate(projectId, { 'settings.shared_to': shareUserIds }, { new: true });

            res.status(200).send({ message: msgLang.project_share_success });
        } catch (e) {
            console.log(e);
            res.status(500).send({ error: msgLang.server_error });
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

            Project.findOne({ name: projectNewName, creator: userId }).then((project) => {
                if (project && !projectId.equals(project._id))
                    return res.status(409).send({ error: msgLang.project_name_taken })

                if (!checkLength(projectNewName?.length, settings.PROJECT_NAME_MIN_LEN, settings.PROJECT_NAME_MAX_LEN))
                    return res.status(400).send({ error: msgLang.project_name_len_err })

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
            res.status(500).send({ error: msgLang.server_error });
        }
    }


    async importRemainder(req, res) {
        const msgLang = msg[getlang(req.params.lang)];

        try {
            const userId = new mongoose.Types.ObjectId(req.user.id);

            const projectId = toObjectIdSafe(res, req.params.projectId, msgLang.project_not_found + ' (i)');
            const ex_projectId = toObjectIdSafe(res, req.params.projectId, msgLang.project_not_found + ' (e)');
            if (!projectId || !ex_projectId) return;

            if (ex_projectId.equals(projectId))
                return res.status(403).send({ error: msgLang.import_same_project_err });

            Project.findById(ex_projectId).then(ex_project => {
                if (!ex_project) return res.status(404).send({ error: msgLang.project_not_found })

                if (!ex_project.creator?.equals(userId) && !ex_project.settings.shared_to?.includes(userId))
                    return res.status(403).send({ error: msgLang.project_access_denied });

                const usedDrugsAmount = calcUsedDrugs(ex_project.patients);
                const drugs = ex_project.drugs;

                Project.findById(projectId).then(im_project => {
                    for (let id = 0; id < drugNames.length; id++) {
                        const drug_ex = drugs.find(drug => drug.id == id);
                        const index_im = im_project.drugs.findIndex(drug => drug.id == id);

                        const remainder = drug_ex ? drug_ex.remainder : 0;
                        const income = drug_ex ? drug_ex.income : 0;

                        const newRemainder = remainder + income - (usedDrugsAmount[id] ?? 0);

                        if (index_im != -1) {
                            im_project.drugs[index_im].remainder = newRemainder;
                        } else {
                            im_project.drugs.push({ id, remainder: newRemainder, income: 0 });
                        }
                    }
                    im_project.save().then(() => {
                        res.status(200).send({ message: msgLang.remainder_import_success, project: im_project });
                    })
                }).catch(err => {
                    console.log(err);
                    res.status(403).send({ error: msgLang.project_not_found });
                });

            }).catch(err => {
                console.log(err);
                res.status(403).send({ error: msgLang.project_not_found });
            });

        } catch (e) {
            console.log(e);
            res.status(500).send({ error: msgLang.server_error });
        }
    }

    async editDrug(req, res) {
        const msgLang = msg[getlang(req.params.lang)];

        if (!validDrug(req, res)) return;
        const { id, remainder, income } = req.body;

        try {
            const projectId = toObjectIdSafe(res, req.params.projectId, msgLang.project_not_found);
            if (!projectId) return;

            Project.findById(projectId).then(project => {
                let index = project.drugs.findIndex(drug => drug.id == id);
                if (index == -1) {
                    index = project.drugs.length;
                    project.drugs.push({ id: id })
                }

                project.drugs[index].remainder = remainder;
                project.drugs[index].income = income;

                project.save().then(() => {
                    res.status(200).send({ message: msgLang.edits_saved, project: project });
                })
            }).catch(err => {
                console.log(err);
                res.status(403).send({ error: msgLang.project_not_found });
            });

        } catch (e) {
            console.log(e);
            res.status(500).send({ error: msgLang.server_error });
        }
    }
}


const validPatientInfo = (req, res, nameRequired = true) => {
    const { name, birthday, card, scheme, diagnosis, therapy } = req.body;

    const msgLang = msg[getlang(req.params.lang)];

    const error = { fields: [] };

    if (nameRequired && (!name || typeof name !== 'string' || name.length < 3 || name.length > 100 || !isValidName(name))) {
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

    if (therapy != undefined) {
        if (!Array.isArray(therapy))
            error.fields.push('therapy');
        else if (therapy.length > 50)
            error.fields.push('therapy.length');
        else {
            for (let i = 0; i < therapy.length; i++) {
                const therapyItem = therapy[i];

                if (typeof therapyItem != 'object') {
                    error.fields.push(`therapy[${i}]`);
                    continue;
                }

                const therapyItemDrugs = therapyItem.drugs;

                if (therapyItemDrugs != undefined) {
                    if (!Array.isArray(therapyItemDrugs)) {
                        error.fields.push(`therapy[${i}]`);
                        continue;
                    }

                    if (therapyItemDrugs.length > drugNames.length) {
                        error.fields.push(`therapy[${i}].drugs.length`);
                        continue;
                    }

                    for (let j = 0; j < therapyItemDrugs.length; j++) {
                        const drug = therapyItemDrugs[j];

                        if (typeof drug.id !== 'number')
                            error.fields.push(`therapy[${i}].drugs[${j}].id`);

                        if (typeof drug.amount !== 'number' || drug.amount < 0 || drug.amount > 99)
                            error.fields.push(`therapy[${i}].drugs[${j}].amount`);
                    }
                }
            }
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
            req.body.name = req.body.name?.trim().replace(/\s+/g, " ");
            req.body.diagnosis = req.body.diagnosis?.trim().replace(/\s+/g, " ");
            req.body.scheme = req.body.scheme?.trim().replace(/\s+/g, " ");

            if (!validPatientInfo(req, res)) return;
            const { name, birthday, card, scheme, diagnosis, therapy } = req.body;

            const projectId = req.params.projectId;

            Project.findById(projectId).then((project) => {
                if (!project) // newer reach (beacause projectMiddleware)
                    return res.status(404).send({ error: msgLang.project_not_found });

                const patientIndex = project.patients.findIndex((p) => p.name === name);
                if (patientIndex != -1) // patient with thjs already exist
                    return res.status(409).send({ error: msgLang.patient_already_exist });

                const patient = { name, birthday, card, scheme, diagnosis, therapy };

                project.patients.push(patient);

                project.save().then(() => {
                    res.status(201).send({ message: msgLang.patient_add_success, project });
                });
            });
        } catch (e) {
            console.log(e);
            res.status(500).send({ error: msgLang.server_error });
        }
    }

    async editPatient(req, res) {
        const msgLang = msg[getlang(req.params.lang)];

        try {
            if (!validPatientInfo(req, res, false)) return;
            // req.body.name = req.body.name?.trim().replace(/\s+/g, " ");
            req.body.diagnosis = req.body.diagnosis?.trim().replace(/\s+/g, " ");
            req.body.scheme = req.body.scheme?.trim().replace(/\s+/g, " ");

            const { name, birthday, card, scheme, diagnosis, therapy } = req.body;

            const projectId = req.params.projectId;
            const patientId = req.params.patientId;

            Project.findById(projectId).then((project) => {
                if (!project) // newer reach (beacause projectMiddleware)
                    return res.status(404).send({ error: msgLang.project_not_found });

                const patientIndex = project.patients.findIndex((p) => p.id === patientId);
                if (patientIndex == -1)  // newer reach (beacause patientMiddleware)
                    return res.status(404).send({ error: msgLang.patient_not_found });

                const patient = project.patients[patientIndex];

                // Update patient data
                // patient.name        = name      !== undefined ? name        : patient.name;
                patient.birthday = birthday !== undefined ? birthday : patient.birthday;
                patient.card = card !== undefined ? card : patient.card;
                patient.scheme = scheme !== undefined ? scheme : patient.scheme;
                patient.diagnosis = diagnosis !== undefined ? diagnosis : patient.diagnosis;
                patient.therapy = therapy !== undefined ? therapy : patient.therapy;

                // Save changes to project
                project.save().then(() => {
                    res.status(200).send({ message: msgLang.patient_edit_success, project });
                });
            });
        } catch (e) {
            console.log(e);
            res.status(500).send({ error: msgLang.server_error });
        }
    }

    async deletePatient(req, res) {
        const msgLang = msg[getlang(req.params.lang)];

        try {
            const projectId = req.params.projectId;
            const patientId = req.params.patientId;

            const project = await Project.findByIdAndUpdate(
                projectId,
                { $pull: { patients: { _id: patientId } } },
                { new: true }
            );

            res.status(200).send({ message: msgLang.patient_delete_success, project });
        } catch (e) {
            console.log(e);
            res.status(500).send({ error: msgLang.server_error });
        }
    }

    async importPatient(req, res) {
        const msgLang = msg[getlang(req.params.lang)];

        try { // CRASH IF INVALID ID
            const userId = new mongoose.Types.ObjectId(req.user.id);
            const projectId = new mongoose.Types.ObjectId(req.params.projectId);

            try {
                // return res.end('aaa');

            } catch (e1) {
                return res.status(404).send({ error: msgLang.project_not_found })
            }


            const { ex_projectId, ex_patientId } = req.body;

            if (ex_projectId == (projectId))
                return res.status(403).send({ error: msgLang.import_same_project_err });

            const exProjectPromise = Project.findById(ex_projectId);
            const imProjectPromise = Project.findById(projectId);

            Promise.all([exProjectPromise, imProjectPromise]).then(([ex_project, im_project]) => {
                if (!ex_project) return res.status(404).send({ error: msgLang.project_not_found })

                if (!ex_project.creator?.equals(userId) && !ex_project.settings.shared_to?.includes(userId))
                    return res.status(403).send({ error: msgLang.project_access_denied });

                // access reached
                const exPatientIndex = ex_project.patients.findIndex((p) => p.id === ex_patientId);
                if (exPatientIndex == -1)
                    return res.status(404).send({ error: msgLang.patient_not_found });

                const patient1 = ex_project.patients[exPatientIndex];
                const patient = {
                    name: patient1.name,
                    birthday: patient1.birthday,
                    card: patient1.card,
                    scheme: patient1.scheme,
                    diagnosis: patient1.diagnosis,
                    therapy: patient1.therapy
                }

                const imPatientIndex = im_project.patients.findIndex((p) => p.name === patient.name);
                const patients = im_project.patients;

                if (imPatientIndex == -1) { // not exist
                    patients.push(patient);
                } else { // exist
                    patients[imPatientIndex] = patient;
                }

                im_project.patients = patients;

                im_project.save().then(() => {
                    res.status(200).send({ message: msgLang.patient_import_success, project: im_project });
                })
            }).catch((error) => {
                console.log(error);
                res.status(500).send({ error: msgLang.project_not_found });
            });
        } catch (e) {
            console.log(e);
            res.status(500).send({ error: msgLang.server_error });
        }
    }

    async getPatient(req, res) {
        const msgLang = msg[getlang(req.params.lang)];
        try {
            const projectId = new mongoose.Types.ObjectId(req.params.projectId);
            const patientId = new mongoose.Types.ObjectId(req.params.patientId);

            Project.findById(projectId).then((project) => {
                const patient = project.patients.find((p) => p._id.equals(patientId));
                if (!patient) {
                    return res.status(404).send({ error: msgLang.patient_not_found });
                }
                return res.status(200).send(patient);
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send({ error: msgLang.server_error });
        }
    }

    async exportPatientsXLSX(req, res) {
        const msgLang = msg[getlang(req.params.lang)];
        try {
            const projectId = new mongoose.Types.ObjectId(req.params.projectId);
            Project.findById(projectId).then((project) => {
                const fileName = req.query.name || `${project.name}`;
                exportPatientsXLSXAsync(
                    project.patients,
                    true, true, req.query.month, req.query.year
                ).then(workbook => {
                    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.set('Content-Disposition', 'attachment; filename=example.xlsx');
                    workbook.write(`${fileName}.xlsx`, res);
                    // res.end();
                    // const buffer = XLSX.write(workbook, { type: 'buffer' });
                    // res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    // res.set('Content-Disposition', 'attachment; filename=example.xlsx');
                    // res.send(buffer);
                }).catch(err => {
                    res.status(500).send({ error: msgLang.server_error });
                    console.log(err);
                });
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send({ error: msgLang.server_error });
        }
    }
}

module.exports = { ProjectController, PatientsController };