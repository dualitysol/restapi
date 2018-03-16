const express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/check_auth');
const UserController = require('../controllers/user');

router.post('/signup', UserController.SignUp);

router.post('/login', UserController.Login);

router.post('/admin', UserController.AdminLogin);

router.delete('/:userID', checkAuth, UserController.DeleteAccount);

module.exports = router;
