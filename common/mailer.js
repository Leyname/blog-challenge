const nodemailer = require('nodemailer');
const config = require('config');

const mailerService = config.get('mailer.service');
const mailerName = config.get('mailer.user');
const mailerPass = config.get('mailer.pass');

module.exports = nodemailer.createTransport({
  service: mailerService,
  auth: {
    user: mailerName,
    pass: mailerPass,
  },
});
