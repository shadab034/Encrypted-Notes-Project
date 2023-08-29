const express = require('express');
const controllers = require('../controllers/UserController');
const Validation = require('../middlewares/ValidationMiddleware');

const router = express.Router();

router.use('/SignUp', Validation.data_validation);
router.post('/SignUp', controllers.User_Signup);
router.post('/Login', controllers.User_Login);
router.get('/LogOut', controllers.User_Logout);

module.exports = router