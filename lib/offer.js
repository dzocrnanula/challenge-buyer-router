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
          one_offer.id = `${buyer_id}:${offer_id}`
          offer.addMember(criteria_key, one_offer)
        })
      })
    })
    return true
  },
  addMember: (key, value) => {
    if(typeof value !== 'string'){
      value = JSON.stringify(value)
    }
    return database.sadd(`${offer.prefix}:${key}`,value)
  },
  getMembers: (keys) => {
    return database.sinterAsync(keys)
  },
  getByCriteria: (hour, day, device, state) => {
    let keys = []
    _.forEach({hour, day, device, state}, (value, key) => {
      if(value){
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