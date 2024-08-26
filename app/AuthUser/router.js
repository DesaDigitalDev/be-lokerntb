const authRouter = require('express').Router();
const multer = require("multer");
const TokenService = require('../Services/Token/tokenServices');
const AuthUserController = require('./controller/authuser');

authRouter.post('/register', multer().none(), AuthUserController.registerUser);
authRouter.post('/login', multer().none(), AuthUserController.loginUser);
authRouter.post('/logout', multer().none(), TokenService.authenticateRequest, AuthUserController.logoutUser);
authRouter.get('/user', TokenService.authenticateRequest, AuthUserController.getUser);
authRouter.put('/user', multer().none(), TokenService.authenticateRequest, AuthUserController.updateUser);

module.exports = authRouter;
