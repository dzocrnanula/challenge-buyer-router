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
    return new Promise((resolve, reject) => {
      let offer_keys
      return offer
        .getMembers(keys)
        .then(response => {
          let buyers_ids = []
          offer_keys = response
          _.forEach(response, re => {
            let ids = re.split(':')
            let buyer_id = ids[0]
            buyers_ids.push(`${buyer.prefix}:${buyer_id}`)
          })
          return buyer.getBuyers(buyers_ids)
        })
        .then(buyers => {
          if(buyers && buyers.length > 0){
            let offers = []
            _.forEach(buyers, buy_str => {
              let buy = JSON.parse(buy_str)
              _.forEach(buy.offers, (ofr, ofr_id) => {
                if(offer_keys.includes(`${buy.id}:${ofr_id}`)){
                  offers.push(ofr)
                }
              })
            })
            offers = _.sortBy(offers, 'value').reverse()
            resolve(offers[0])
          } else {
            reject('no offers found')
          }
        })
        .catch(error => {
          reject(error.message)
        })
    })
  }
}