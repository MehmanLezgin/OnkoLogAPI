const User = require('../models/user');
const Project = require('../models/project');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const msg = require('../messages');
const {getlang} = require('../util');

module.exports = function(req, res, next) {
    if (req.method == 'OPTIONS') next();

    try {
        const msgLang = msg[getlang(req.params.lang)];

        const projectId = req.params.id;
        const userId = new mongoose.Types.ObjectId(req.user.id);

        Project.findById(projectId).then((project) => {
            if (!project) return res.status(404).send({ error: msgLang.project_not_found })
            if (project.creator?.equals(userId)) {
                req.isOwnProject = true;
                return next();
            }
            if (project.settings.shared_to?.includes(userId)) {
                req.isOwnProject = false;
                return next();
            }
            return res.status(403).send({ error: msgLang.project_access_denied });
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({error: 'Server Error'});
    }
}