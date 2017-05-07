let database = require('./database')
let _ = require('lodash')

module.exports = buyer = {
  prefix: 'buyer',
  store: (object) => {
    let key = `${buyer.prefix}:${object.id}`
    return database.set(key, JSON.stringify(object))
  },
  find: (id) => {
    let key = `${buyer.prefix}:${id}`
    return database.getAsync(key)
  },
  getBuyers: (buyer_ids) => {
    return database.mgetAsync(buyer_ids)
  }
}
