let http = require('http')
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
