let _ = require('lodash')
let database = require('./database')
let buyer = require('./buyer')
module.exports = offer = {
  prefix: 'offer',
  storeByCritetia: (buyer_id, offers)=>{
    _.forEach(offers, (one_offer, offer_id) => {
      _.forEach(one_offer.criteria, (criteria, key) => {
        _.forEach(criteria, (value) => {
          let criteria_key = `${key}:${value}`
          offer.addMember(criteria_key, `${buyer_id}:${offer_id}`)
        })
      })
    })
    return true
  },
  addMember: (key, value) => {
    return database.sadd(`${offer.prefix}:${key}`,value)
  },
}