let dotenv = require('dotenv')
let server = require('./lib/server')()

dotenv.config({ path: './.env' })
server.listen(process.env.HTTP_PORT)
console.log('listening to port : ', process.env.HTTP_PORT)
