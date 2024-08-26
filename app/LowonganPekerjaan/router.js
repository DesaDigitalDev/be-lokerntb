const TokenService = require('../Services/Token/tokenServices');
const LowonganPekerjaanController = require('./controller/LowonganPekerjaanController');

const lowonganpekerjaanRouter = require('express').Router();
const multer = require('multer');

lowonganpekerjaanRouter.post('/create',multer().none(),TokenService.authenticateRequest, LowonganPekerjaanController.createLowongan);
lowonganpekerjaanRouter.get('/get', TokenService.userWithTokenOrNoToken, LowonganPekerjaanController.getLowongan);
lowonganpekerjaanRouter.get('/getinuser', TokenService.authenticateRequest, LowonganPekerjaanController.getLowongan);
lowonganpekerjaanRouter.put('/update',TokenService.authenticateRequest, LowonganPekerjaanController.updateLowongan);
lowonganpekerjaanRouter.delete('/delete/:id',TokenService.authenticateRequest, LowonganPekerjaanController.deleteLowongan);

module.exports = lowonganpekerjaanRouter;
