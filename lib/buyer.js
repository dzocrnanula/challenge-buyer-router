let database = require('./database')

let buyer = {
  prefix: 'buyer',
  store: (object) => {
    let key = `${buyer.prefix}:${object.id}`
    return database.set(key, JSON.stringify(object))
  },
  find: (id) => {
    let key = `${buyer.prefix}:${id}`
    return database.getAsync(key)
  },
  getBuyers: (buyerIds) => {
    return database.mgetAsync(buyerIds)
  }
}
module.exports = buyer
