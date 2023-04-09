const Router = require('express');
const router = Router.Router({ mergeParams: true });
const { ProjectController, PatientsController} = require('../controllers/projectController');
const authMW = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const projectMW = require('../middlewares/projectMiddleware');
const patientMW = require('../middlewares/patientMiddleware');

const projectCont = new ProjectController();
const patientsCont = new PatientsController();

router.get(         '/my',                                      authMW,             projectCont.myProjectsInfo);
router.get(         '/shared',                                  authMW,             projectCont.sharedProjectsInfo);
router.get(         '/:projectId',                              authMW, projectMW,  projectCont.getProject);
router.delete(      '/:projectId/:project_name',                authMW, projectMW,  projectCont.deleteProject);
router.post(        '/create',                                  authMW,             projectCont.createProject)
router.put(         '/:projectId/setshare',                     authMW, projectMW,  projectCont.setShareList);
router.put(         '/:projectId/rename',                       authMW, projectMW,  projectCont.renameProject);
router.get(         '/:projectId/patients',                     authMW, projectMW,  projectCont.getPatients);

router.post(        '/:projectId/patient/',                     authMW, projectMW,  patientsCont.addPatient);
router.put(         '/:projectId/patient/:patientId',           authMW, projectMW,  patientMW, patientsCont.editPatient);
router.delete(      '/:projectId/patient/:patientId',           authMW, projectMW,  patientMW, patientsCont.deletePatient);
router.post(        '/:projectId/impat',                        authMW, projectMW,  patientsCont.importPatient);

router.get(         '/:projectId/drugs',                        authMW, projectMW,  projectCont.getDrugs);
router.post(        '/:projectId/drugs/imrem',                  authMW, projectMW,  projectCont.importRemainder);
router.put(         '/:projectId/drugs/',                       authMW, projectMW,  projectCont.editDrug);
/*
GET     /api/project/:projectId/my-projects                 - myProjectsInfo        // DONE
GET     /api/project/:projectId/shared-projects             - sharedProjectsInfo    // DONE
POST    /api/project/:projectId/                            - createProject         // DONE
GET     /api/project/:projectId/                            - getProject            // DONE

POST    /api/project/:projectId/patients/impat              - importPatient         // DONE
GET     /api/project/:projectId/patients/                   - getPatients           // DONE
POST    /api/project/:projectId/patients/                   - addPatient            // DONE
PUT     /api/project/:projectId/patients/:patientId         - editPatient           // DONE
DELETE  /api/project/:projectId/patients/:patientId         - deletePatient         // DONE

DELETE  /api/project/:projectId/patients/:projectId         - deleteProject         // DONE
PUT     /api/project/:projectId/patients/:projectId         - renameProject         // DONE
PUT     /api/project/:projectId/patients/:projectId/share   - updateShareList       // DONE
GET     /api/project/:projectId/drugs/                      - getDrugs              // DONE
PUT     /api/project/:projectId/drugs/                      - editDrug              // DONE
POST    /api/project/:projectId/drugs/imrem                 - importRemainder       // DONE
*/

module.exports = router;