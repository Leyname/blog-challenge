const nodemailer = require('nodemailer');
const config = require('config');

const mailerService = config.get('mailer.service');
const mailerName = config.get('mailer.user');
const mailerPass = config.get('mailer.pass');

const smtpTransport = nodemailer.createTransport({
  service: mailerService,
  auth: {
    user: mailerName,
    pass: mailerPass,
  },
});

const sendEmail = async (email, link) => {
  const mailOptions = {
    to: email,
    subject: 'Please confirm your Email account',
    html: `Hello,<br> Please Click on the link to verify your email.<br><a href="${link}">Click here to verify</a>`,
  };

  await smtpTransport.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
      throw { success: false, message: 'mail is not send' };
    }
  });
};

module.exports = {
  sendEmail,
};
