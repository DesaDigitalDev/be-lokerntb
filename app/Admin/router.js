const adminRouter = require('express').Router();
const multer = require("multer");
const TokenService = require('../Services/Token/tokenServices');
const AdminController = require('./controller/AdminController');

// get all company to acc
adminRouter.get('/acc-company-profile',TokenService.authenticateRequest,TokenService.adminRequest,AdminController.getAccCompanyProfile)
adminRouter.post('/acc-company-profile',multer().none(),TokenService.authenticateRequest,TokenService.adminRequest,AdminController.accOrDeleteCompany)
module.exports = adminRouter;
