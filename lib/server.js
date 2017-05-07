let http = require('http')
let diff = require('deep-diff')
let url = require('url')
let _ = require('lodash')
let querystring = require('querystring')
let httpHashRouter = require('http-hash-router')
let router = httpHashRouter()
let buyer = require('./buyer')
let offer = require('./offer')

module.exports = function () {
  router.set('/buyers', {
    POST: function (request, response) {
      let body = ''
      request.on('data', function (chunk) {
        body += chunk
      })
      request.on('end', function () {
        response.statusCode = 500
        let out = {success: false}
        let data = null
        try {
          data = JSON.parse(body)
        } catch (er) {}
        if (data
          && buyer.store(data)
          && offer.storeByCritetia(data.id, data.offers)) {
          response.statusCode = 201
          out.success = true
        }
        response.write(JSON.stringify(out))
        response.end()
      })
    }
  })
  router.set('/buyers/:id', {
    GET: function (request, response) {
      let id = request.url.split('/')[2]
      buyer
        .find(id)
        .then(object => {
          response.statusCode = 200
          response.write(object)
          response.end()
        })
        .catch(error => {
          response.statusCode = 500
          response.write(error.message)
          response.end()
        })
    }
  })
  router.set('/route', {
    GET: function (request, response) {
      let query = url.parse(request.url).query
      let params = querystring.parse(query)

      let date = new Date(params.timestamp)
      let day = date.getDay()
      let hour = date.getHours()
      offer
        .getByCriteria(hour, day, params.device, params.state)
        .then(response => {
          let ofr = JSON.parse(response)
          response.writeHead(302, {Location: ofr.location})
          response.end()
        })
        .catch(error => {
          response.statusCode = 400
          response.end()
        })
    }
  })
  return http.createServer(requestHandler(router))
}
function requestHandler (router) {
  return function handler (request, response) {
    return router(request, response, {}, function onError (error) {
      if (error) {
        response.statusCode = error.statusCode || 500
        response.end(error.message)
      }
    })
  }
}
