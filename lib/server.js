let http = require('http')
let httpHashRouter = require('http-hash-router')
let router = httpHashRouter()
module.exports = function () {
  return http.createServer(requestHandler(router))
}
function requestHandler (router) {
  return function handler (request, response) {
    router(request, response, {}, function onError (error) {
      if (error) {
        response.statusCode = error.statusCode || 500
        response.end(error.message)
      }
    })
  }
}
