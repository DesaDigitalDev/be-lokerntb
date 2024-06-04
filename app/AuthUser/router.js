const authRouter = require('express').Router();
const multer = require("multer");
const AuthUserController = require('./middleware/authuser');
authRouter.post('/register', multer().none(), AuthUserController.registerUser);
authRouter.post('/login', multer().none(), AuthUserController.loginUser);

module.exports = authRouter;
