const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, userController.getUser);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/', protect,  userController.updateUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/password-reset/:resetToken', userController.resetPassword);

module.exports = router;
