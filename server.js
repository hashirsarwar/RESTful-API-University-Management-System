const http = require('http')
const app = require('./app')
var port = 8888
var server = http.createServer(app)
server.listen(port)
