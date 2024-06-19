const express = require('express');
const MiddlewareAuthentication = require('../middleware/midAuthentication');
const userController = require('../controllers/userController');
const eventController = require('../controllers/eventController');
const Routes = express.Router();
const profilepictureauthenticate = require('../middleware/profilePictureAuthentication')

Routes.post('/registration', userController.registration);

Routes.post('/login', userController.logIn);

Routes.post('/forgot-password', MiddlewareAuthentication, userController.sendForgotPasswordEmail);

Routes.get('/all-users', MiddlewareAuthentication, userController.fetchAllUsers);

// Routes.post('/userBymail', MiddlewareAuthentication,userController.fetchUserByEmail);

Routes.post('/updateUser', MiddlewareAuthentication, profilepictureauthenticate, userController.updateUser);

Routes.delete('/delete-user', MiddlewareAuthentication, userController.deleteUser);

Routes.post('/new-event', MiddlewareAuthentication, eventController.createEvent);

Routes.get('/all-event', MiddlewareAuthentication, eventController.getAllEvents);

Routes.put('/update-event', MiddlewareAuthentication, eventController.updateEvent);

Routes.delete('/delete-event', MiddlewareAuthentication, eventController.deleteEvent);

module.exports = Routes; 