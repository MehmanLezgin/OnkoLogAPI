const Router = require('express');
const router = Router.Router({ mergeParams: true });
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const projectMiddleware = require('../middlewares/projectMiddleware');

router.get('/my',                   authMiddleware,     projectController.myProjectsInfo);
router.get('/shared',               authMiddleware,     projectController.sharedProjectsInfo);
router.get('/:id',                  authMiddleware, projectMiddleware, projectController.getProject);
router.delete('/:id/:project_name', authMiddleware, projectMiddleware, projectController.deleteProject);
router.post('/create-project',      authMiddleware,     projectController.createProject)
router.put('/:id/setshare',         authMiddleware, projectMiddleware, projectController.setShareList);
router.put('/:id/rename',           authMiddleware, projectMiddleware, projectController.renameProject);
/*
GET      /api/project/my-projects           - myProjectsInfo        // DONE
GET      /api/project/shared-projects       - sharedProjectsInfo    // DONE
POST     /api/project                       - createProject         // DONE
PUT      /api/project/patients/:patientId   - editPatient           // 
DELETE   /api/project/patients/:patientId   - deletePatient         //
GET      /api/project/:projectId            - getProject            // DONE
DELETE   /api/project/:projectId            - deleteProject         // DONE
PUT      /api/project/:projectId            - renameProject         //
PUT      /api/project/:projectId/share      - updateShareList       // 
*/

module.exports = router;