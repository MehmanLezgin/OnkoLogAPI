const Router = require('express');
const router = new Router();
const dataController = require('../controllers/dataController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/drugnames', authMiddleware, dataController.getDrugnames);
router.get('/diagnosis', authMiddleware, dataController.getDiagnosis);
router.get('/schemes', authMiddleware, dataController.getTherapySchemes);
router.get('/drugnames-ext', authMiddleware, dataController.drugnamesExtended);
router.get('/myinfo', authMiddleware, dataController.myInfo);
router.get('/profile-img', authMiddleware, dataController.myProfileImg);
module.exports = router;