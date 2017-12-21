const passportJWT = require('passport-jwt');
const users = require('../models/user');
const config = require('config');

const jwtSecret = config.get('jwtAuth.jwtSecret');

const { ExtractJwt, Strategy } = passportJWT;
const params = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
};

const strategy = new Strategy(params, (payload, next) => {
  const user = users.findUserById(payload.id);
  if (user) {
    next(null, { id: user.id });
  } else {
    next(null, false);
  }
});

module.exports = strategy;
