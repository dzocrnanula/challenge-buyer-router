let database = require('./database')

module.exports = {
  prefix: 'buyer',
  store: (object) => {
    let multi = database.multi()
    let key = `${module.exports.prefix}:${object.id}`
    multi.set(key, JSON.stringify(object))
    return multi.exec()
  },
  find: (id) => {
    let key = `${module.exports.prefix}:${id}`
    return database.getAsync(key)
  }
}
