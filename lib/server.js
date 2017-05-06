let http = require('http')
let httpHashRouter = require('http-hash-router')
let router = httpHashRouter()
let entity = require('./entity')

module.exports = function () {
  router.set('/buyer', {
    POST: function (request, response) {
      let body = ''
      request.on('data', function (chunk) {
        body += chunk
      })
      request.on('end', function () {
        entity.key = 'buyer'
        let out = {success: false}
        response.statusCode = 500
        if (entity.store(JSON.parse(body))) {
          response.statusCode = 201
          out.success = true
        }
        response.write(JSON.stringify(out))
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
