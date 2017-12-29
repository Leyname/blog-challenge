const jwt = require('jsonwebtoken');

const injectionUser = async (req, res, next) => {
  const token = req.headers.authorization.slice(4);
  const decodedPayload = await jwt.decode(token);
  req.user = {
    id: decodedPayload.id,
    iat: decodedPayload.iat,
  };
  next();
};

module.exports = injectionUser;
