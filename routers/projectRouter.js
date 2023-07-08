const Router = require('express');
const router = Router.Router({ mergeParams: true });
const { ProjectController, PatientsController} = require('../controllers/projectController');

const authMW = require('../middlewares/authMiddleware');
const projectMW = require('../middlewares/projectMiddleware');
const patientMW = require('../middlewares/patientMiddleware');

const projectCont = new ProjectController();
const patientsCont = new PatientsController();

router.get(         '/my',                                      authMW,             projectCont.myProjectsInfo);
router.get(         '/shared',                                  authMW,             projectCont.sharedProjectsInfo);
router.get(         '/all',                                     authMW,             projectCont.allProjectsInfo);
router.get(         '/:projectId',                              authMW, projectMW,  projectCont.getProject);
router.delete(      '/:projectId/:project_name',                authMW, projectMW,  projectCont.deleteProject);
router.post(        '/create',                                  authMW,             projectCont.createProject)
router.put(         '/:projectId/setshare',                     authMW, projectMW,  projectCont.setShareList);
router.put(         '/:projectId/rename',                       authMW, projectMW,  projectCont.renameProject);

router.post(        '/:projectId/patient/',                     authMW, projectMW,  patientsCont.addPatient);
router.get(         '/:projectId/patients/',                    authMW, projectMW,  projectCont.getPatients);
router.get(         '/:projectId/patients/:patientId',          authMW, projectMW,  patientMW, patientsCont.getPatient);
router.put(         '/:projectId/patients/:patientId',          authMW, projectMW,  patientMW, patientsCont.editPatient);
router.delete(      '/:projectId/patients/:patientId',          authMW, projectMW,  patientMW, patientsCont.deletePatient);
router.post(        '/:projectId/impat',                        authMW, projectMW,  patientsCont.importPatient);
// router.get(         '/:projectId/export-xlsx',                  authMW, projectMW,  patientsCont.exportPatientsXLSX);

router.get(         '/:projectId/drugs/',                       authMW, projectMW,  projectCont.getDrugs);
router.get(         '/:projectId/drugs/:drugId',                authMW, projectMW,  projectCont.getDrug);
router.post(        '/:projectId/drugs/imrem',                  authMW, projectMW,  projectCont.importRemainder);
router.put(         '/:projectId/drug/',                        authMW, projectMW,  projectCont.editDrug);

module.exports = router;