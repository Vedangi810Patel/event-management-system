const express = require('express');
const MiddlewareAuthentication = require('../middleware/midAuthentication');
const userController = require('../controllers/userController')
const Routes = express.Router();


Routes.post('/registration', userController.Registration);

Routes.post('/login', userController.LogIn);

Routes.post('/forgot-password', userController.sendForgotPasswordEmail);


module.exports = Routes; 