const ProfesiPekerjaanController = require('./controller/ProfesiPekerjaanController');

const profesipekerjaanRouter = require('express').Router();

profesipekerjaanRouter.get('/',ProfesiPekerjaanController.attributeLowonganPekerjaan)

module.exports = profesipekerjaanRouter;
