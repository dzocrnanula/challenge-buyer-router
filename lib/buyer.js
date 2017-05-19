let database = require('./database')
let _ = require('lodash')

module.exports = {
  buyer_prefix: 'buyer',
  offer_prefix: 'offer',
  store: (buyer, cb) => {
    let multi = database.multi()
    let key = `${module.exports.buyer_prefix}:${buyer.id}`
    multi.set(key, JSON.stringify(buyer))
    _.forEach(buyer.offers, (oneOffer, offerId) => {
      _.forEach(oneOffer.criteria, (criteria, key) => {
        _.forEach(criteria, (value) => {
          let criteriaKey = `${key}:${value}`
          oneOffer.id = `${buyer.id}:${offerId}`
          if (typeof oneOffer !== 'string') {
            oneOffer = JSON.stringify(oneOffer)
          }
          multi.sadd(`${module.exports.offer_prefix}:${criteriaKey}`, oneOffer)
        })
      })
    })
    multi.exec(cb)
  },
  find: (id) => {
    let key = `${module.exports.buyer_prefix}:${id}`
    return database.getAsync(key)
  },
  getMembers: (keys) => {
    return database.sinterAsync(keys)
  },
  getByCriteria: (hour, day, device, state) => {
    let keys = []
    _.forEach({hour, day, device, state}, (value, key) => {
      if (value) {
        keys.push(`${module.exports.offer_prefix}:${key}:${value}`)
      }
    })
    return module.exports.getMembers(keys)
      .then(response => {
        let offers = _.sortBy(_.map(response, JSON.parse), 'value').reverse()
        return offers[0]
      })
  }
}
