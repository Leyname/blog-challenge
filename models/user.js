const {
  models: {
    User: user,
  },
} = require('../common/db');
const crypto = require('crypto');

const hashingPassword = (password, salt) => {
  const hashpassword = crypto.createHash('sha512')
    .update(salt + password, 'utf8')
    .digest('hex');
  return hashpassword;
};

const addNewUser = async (userdata) => {
  const salt = Math.round(`${Date.now() * Math.random()}`);
  const newUser = await user.create({
    first_name: userdata.first_name,
    last_name: userdata.last_name,
    password: hashingPassword(userdata.password, salt),
    salt,
    email: userdata.email,
  });
  return newUser.toJSON();
};

const confirmUser = id =>
  user.update({
    status: true,
  }, {
    where: {
      id,
    },
  });

const findUserByEmail = email =>
  user.findOne({
    where: {
      email,
    },
  });

const findUserById = id =>
  user.findById(id);

const changePassword = (email, password) =>
  user.update({
    password: hashingPassword(password),
  }, {
    where: {
      email,
    },
  });

module.exports = {
  addNewUser,
  confirmUser,
  findUserByEmail,
  findUserById,
  changePassword,
};
