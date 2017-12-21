const users = require('../models/user');
const redisClient = require('../common/redis');
const config = require('config');
const randomstring = require('randomstring');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const smtpTransport = require('../common/mailer');

const jwtSecret = config.get('jwtAuth.jwtSecret');
const expireConfig = config.get('redis.expire');

const sendEmail = async (email, link) => {
  const mailOptions = {
    to: email,
    subject: 'Please confirm your Email account',
    html: `Hello,<br> Please Click on the link to verify your email.<br><a href="${link}">Click here to verify</a>`,
  };

  await smtpTransport.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
      throw new Error({ success: false, message: 'mail is not send' });
    }
  });
};

const registration = async (req, res, next) => {
  const { id, email } = await users.addNewUser(req.body);

  const hashCode = randomstring.generate();

  await redisClient.set(hashCode, id);
  await redisClient.expire(hashCode, expireConfig);

  const link = `http://${config.general.host}:${config.general.port}/api/auth/confirm/${hashCode}`;
  console.log(link);

  await sendEmail(email, link);

  res.data = { success: true };
  next();
};

const confirmUser = async (req, res, next) => {
  const { params: { hash_code: hashCode } } = req;
  const id = await redisClient.getAsync(hashCode);

  if (!id) {
    throw { success: false, message: 'hashcode is not found' };
    // Promise.reject({ success: false, message: 'hashcode is not found' });
  }

  const affectedCount = await users.confirmUser(id);

  if (affectedCount[0] > 0) {
    await redisClient.del(hashCode);
    res.data = { success: true };
    return next();
  }

  throw { success: false, message: 'user is not added' };
};

const login = async (req, res, next) => {
  if (req.body.email && req.body.password) {
    const { email, password } = req.body;
    const user = await users.findUserByEmail(email);

    if (user === null) {
      throw { success: false, message: 'user is not found' };
    }

    if (user.status === false) {
      throw { success: false, message: 'email is not confirmed' };
    }

    if (bcrypt.compareSync(password, user.password)) {
      const payload = {
        id: user.id,
      };
      const token = await jwt.sign(payload, jwtSecret);
      res.data = {
        success: true,
        token,
      };
      return next();
    }

    throw { success: false, message: 'user or password are not entered correctly' };
  }
  throw { success: false, message: 'not all data is entered' };
};

const changePassword = async (req, res, next) => {
  const { email } = req.body;
  const hashCode = randomstring.generate();

  await redisClient.set(hashCode, email);
  await redisClient.expire(hashCode, expireConfig);

  console.log(hashCode);
  res.data = { success: true };

  next();
};

const checkCode = async (req, res, next) => {
  const { params: { code } } = req;
  const email = await redisClient.getAsync(code);
  if (email === null) {
    res.data = { response: 'this code is not valid' };
  } else {
    res.data = { response: 'this code is valid' };
  }
  next();
};

const reset = async (req, res, next) => {
  const { body: { code, new_password: newPassword } } = req;
  const email = await redisClient.getAsync(code);

  if (email === null) {
    throw { success: false, message: 'this code is not valid' };
  }

  const affectedCount = await users.changePassword(email, newPassword);
  if (affectedCount[0] > 0) {
    await redisClient.del(code);
    res.data = { success: true };
    return next();
  }

  throw { success: false, message: 'password is not changed' };
};

module.exports = {
  registration,
  confirmUser,
  login,
  changePassword,
  reset,
  checkCode,
};
