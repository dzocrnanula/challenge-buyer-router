let bluebird = require('bluebird')
let redis = require('redis')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

module.exports = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
})

