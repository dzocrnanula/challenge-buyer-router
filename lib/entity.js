let bluebird = require('bluebird')
let redis = require('redis')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

let client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
})

module.exports = entity = {
  key: null,
  store: (object) => {
    let key = `${entity.key}:${object.id}`
    return client.set(key, JSON.stringify(object))
  },
  find: (id) => {
    let key = `${entity.key}:${id}`
    return client.getAsync(key)
  },
}
