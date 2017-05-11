let _ = require('lodash')
let database = require('./database')
let offer = {
  prefix: 'offer',
  storeByCritetia: (buyerId, offers) => {
    _.forEach(offers, (oneOffer, offerId) => {
      _.forEach(oneOffer.criteria, (criteria, key) => {
        _.forEach(criteria, (value) => {
          let criteriaKey = `${key}:${value}`
          oneOffer.id = `${buyerId}:${offerId}`
          offer.addMember(criteriaKey, oneOffer)
        })
      })
    })
    return true
  },
  addMember: (key, value) => {
    if (typeof value !== 'string') {
      value = JSON.stringify(value)
    }
    return database.sadd(`${offer.prefix}:${key}`, value)
  },
  getMembers: (keys) => {
    return database.sinterAsync(keys)
  },
  getByCriteria: (hour, day, device, state) => {
    let keys = []
    _.forEach({hour, day, device, state}, (value, key) => {
      if (value) {
        keys.push(`${offer.prefix}:${key}:${value}`)
      }
    })
    return offer.getMembers(keys)
      .then(response => {
        let offers = _.sortBy(_.map(response, JSON.parse), 'value').reverse()
        return offers[0]
      })
  }
}
module.exports = offer
