const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  PASSWORD_EMAIL: process.env.PASSWORD_EMAIL,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  EMAIL: process.env.EMAIL,
  URL_CLIENT: process.env.URL_CLIENT,
  URL_SERVER: process.env.URL_SERVER,
  VPS: process.env.VPS,
};
