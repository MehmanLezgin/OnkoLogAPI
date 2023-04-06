const Router = require('express');
const router = new Router();
const dataController = require('../controllers/dataController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/drugnames', authMiddleware, dataController.drugnames)

module.exports = router;