let database = require('./database')

module.exports = {
  prefix: 'buyer',
  store: (object) => {
    let key = `${module.exports.prefix}:${object.id}`
    return database.set(key, JSON.stringify(object))
  },
  find: (id) => {
    let key = `${module.exports.prefix}:${id}`
    return database.getAsync(key)
  },
  getBuyers: (buyerIds) => {
    return database.mgetAsync(buyerIds)
  }
}
