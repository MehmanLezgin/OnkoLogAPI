const Router = require('express');
const router = Router.Router({ mergeParams: true });
const { ProjectController, PatientsController} = require('../controllers/projectController');
const authMW = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const projectMW = require('../middlewares/projectMiddleware');
const patientMW = require('../middlewares/patientMiddleware');

const projectCont = new ProjectController();
const patientsCont = new PatientsController();

router.get(         '/my',                                     authMW,             projectCont.myProjectsInfo);
router.get(         '/shared',                                 authMW,             projectCont.sharedProjectsInfo);
router.get(         '/:projectId',                             authMW, projectMW,  projectCont.getProject);
router.delete(      '/:projectId/:project_name',               authMW, projectMW,  projectCont.deleteProject);
router.post(        '/create',                                 authMW,             projectCont.createProject)
router.put(         '/:projectId/setshare',                    authMW, projectMW,  projectCont.setShareList);
router.put(         '/:projectId/rename',                      authMW, projectMW,  projectCont.renameProject);
router.get(         '/:projectId/drugs',                       authMW, projectMW,  projectCont.getDrugs);
router.get(         '/:projectId/patients',                    authMW, projectMW,  projectCont.getPatients);
    
router.post(        '/:projectId/patient/',                    authMW, projectMW,  patientsCont.addPatient);
router.put(         '/:projectId/patient/:patientId',          authMW, projectMW,  patientMW, patientsCont.editPatient);
router.delete(      '/:projectId/patient/:patientId',          authMW, projectMW,  patientMW, patientsCont.deletePatientById);
/*
GET     /api/project/:projectId/my-projects                 - myProjectsInfo        // DONE
GET     /api/project/:projectId/shared-projects             - sharedProjectsInfo    // DONE
POST    /api/project/:projectId/                            - createProject         // DONE
GET     /api/project/:projectId/                            - getProject            // DONE
POST    /api/project/:projectId/imp-rem                     - importRemainder       // 

POST    /api/project/:projectId/patients/import             - importPatient         // 
GET     /api/project/:projectId/patients/                   - getPatients           // DONE
POST    /api/project/:projectId/patients/                   - addPatient            // 
PUT     /api/project/:projectId/patients/:patientId         - editPatient           // 
DELETE  /api/project/:projectId/patients/:patientId         - deletePatient         // DONE

DELETE  /api/project/:projectId/patients/:projectId         - deleteProject         // DONE
PUT     /api/project/:projectId/patients/:projectId         - renameProject         // DONE
PUT     /api/project/:projectId/patients/:projectId/share   - updateShareList       // DONE
GET     /api/project/:projectId/drugs/                      - getDrugs              // 
PUT     /api/project/:projectId/drugs/:drugId               - editDrug              // 
*/

module.exports = router;