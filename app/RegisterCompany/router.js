const registerCompanyRouter = require('express').Router();
const multer = require("multer");
const TokenService = require('../Services/Token/tokenServices');
const RegisterCompanyController = require('./controller/RegisterCompanyController');
const os = require('os');

// register 
registerCompanyRouter.post('/register', multer({ dest: os.tmpdir(), limits: { fieldSize: 2 * 1024 * 1024 } }).single('filegambar'),TokenService.authenticateRequest, RegisterCompanyController.createCompany);
// register 
// update
// registerCompanyRouter.put('/update',multer({ dest: os.tmpdir(), limits: { fieldSize: 2 * 1024 * 1024 } }).single('filegambar'),TokenService.authenticateRequest, RegisterCompanyController.updateCompany);
registerCompanyRouter.put('/update',multer({ dest: os.tmpdir(), limits: { fieldSize: 2 * 1024 * 1024 } }).single('filegambar'),TokenService.authenticateRequest,RegisterCompanyController.updateCompanyProfile);
// update

registerCompanyRouter.get('/company-profile',TokenService.authenticateRequest, RegisterCompanyController.getCompanyProfile);

// delete
registerCompanyRouter.delete('/delete/:idperusahaan',TokenService.authenticateRequest,RegisterCompanyController.deleteCompanyProfile)

module.exports = registerCompanyRouter;


