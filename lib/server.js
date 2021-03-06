let http = require('http')
let url = require('url')
let querystring = require('querystring')
let httpHashRouter = require('http-hash-router')
let router = httpHashRouter()
let buyer = require('./buyer')

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
        if (data && data.id) {
          buyer.store(data, (error) => {
            if (!error) {
              response.statusCode = 201
              out.success = true
            }
            response.write(JSON.stringify(out))
            response.end()
          })
        } else {
          response.write(JSON.stringify(out))
          response.end()
        }
      })
    }
  })
  router.set('/buyers/:id', {
    GET: function (request, response) {
      let [, , id] = request.url.split('/')
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
      let hour = date.getHours() - 1
      buyer
        .getByCriteria(hour, day, params.device, params.state)
        .then(ofr => {
          response.writeHead(302, {Location: ofr.location})
          response.end()
        })
        .catch(error => {
          response.statusCode = 400
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
