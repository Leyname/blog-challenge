const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('config');

const databaseConfig = config.get('db.database');
const usernameConfig = config.get('db.username');
const passwordConfig = config.get('db.password');
const paramsConfig = config.get('db.params');

const db = new Sequelize(
  databaseConfig,
  usernameConfig,
  passwordConfig,
  paramsConfig,
);

const dir = path.join(__dirname, '../models/scheme');
fs.readdirSync(dir).forEach((file) => {
  const modelDir = path.join(dir, file);
  db.import(modelDir);
});

Object.keys(db.models).forEach((modelName) => {
  if ('associate' in db.models[modelName]) {
    db.models[modelName].associate(db.models);
  }
});

db.sync();

module.exports = db;
