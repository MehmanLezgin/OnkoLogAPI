const Router = require('express');
const router = new Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/signin', authController.signin)
router.post('/signup', authMiddleware, adminMiddleware, authController.signup) // admin creates accounts
router.post('/logout', authController.logout)
router.post('/users', authMiddleware, adminMiddleware, authController.getUsers)

module.exports = router;