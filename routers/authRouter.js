const Router = require('express');
const router = Router.Router({ mergeParams: true });
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/signin', authController.signin)
router.post('/signup', authMiddleware, adminMiddleware, authController.signup) // admin creates accounts
router.post('/logout', authController.logout)
router.get('/users', authMiddleware, adminMiddleware, authController.getUsers)
// router.get('/username/:id', authMiddleware, adminMiddleware, authController.getUsernameById)

module.exports = router;
// 642c1ee035252a0b2e2c2f2f