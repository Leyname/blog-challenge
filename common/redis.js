const Promise = require('bluebird');
const redis = require('redis-node');
const config = require('config');

const redisPort = config.get('redis.port');
const redisHost = config.get('redis.host');

const redisClient = Promise.promisifyAll(redis.createClient(redisPort, redisHost));

redisClient.on('error', (err) => {
  console.log(err);
});

module.exports = redisClient;
