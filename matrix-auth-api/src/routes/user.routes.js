const express = require('express');
const router = express.Router();
const registerUserController  = require('../controllers/user.controller').registerUserController;
const updatePasswordController = require('../controllers/user.controller').updatePasswordController;
const authMiddleware = require('../utils/authMiddleware').authenticate;

router.post('/register',authMiddleware, registerUserController );
router.post('/update-password',authMiddleware, updatePasswordController );

module.exports = router;