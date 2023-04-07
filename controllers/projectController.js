const Project = require('../models/project');
const User = require('../models/user');
const msg = require('../messages')
const { getlang, checkLength } = require('../util');
const settings = require('../settings');
const mongoose = require('mongoose');


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
            const projectId = new mongoose.Types.ObjectId(req.params.id);

            Project.findById(projectId).then((project) => {
                return res.status(200).send(project);
            });
        } catch (e) {
            console.error(err.message);
            res.status(500).send({error: msgLang.server_error});
        }
    }

    async deleteProject(req, res) {
        try {
            const projectId = new mongoose.Types.ObjectId(req.params.id);
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
            const projectId = new mongoose.Types.ObjectId(req.params.id);
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
            const projectId = new mongoose.Types.ObjectId(req.params.id);
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

module.exports = new ProjectController();