const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const authRoutes = require('./routes/auth');
const db = require('./common/db');

const portConfig = config.get('general.port');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

app.use('/api', authRoutes);

app.use('/', (req, res, next) => {
  res.json(res.data);
  next();
});

app.use('/', (err, req, res, next) => {
  res.json(err);
  next();
});

(async () => {
  await db.authenticate();
  app.listen(portConfig, () => {
    console.log(portConfig);
  });
})();

module.exports = app;
