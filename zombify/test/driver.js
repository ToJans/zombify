var spawn = require('child_process').spawn
var http = require('http')
var querystring = require('querystring')

var Driver = function(dir, options) {
  this.dir = dir
  this.options = options || {}
  this.options.port = this.options.port || 8081
  this.process = null
  this.baseHref = 'http://localhost:' + this.options.port
}

Driver.prototype = {
  start: function(cb) {
    this.process = spawn('xsp2', [ '--port', this.options.port], {
      cwd: this.dir,
    })
    this.process.stdout.setEncoding('utf8')
    this.process.stdout.on('data', this.onStdOut.bind(this))
    this.process.stderr.setEncoding('utf8')
    this.process.stderr.on('data', this.onStdErr.bind(this))
    this.process.on('exit', this.onExit.bind(this))
    this.waitForConnection(cb)
  },
  invoke: function(method, params, cb) {
    var qs = querystring.stringify({
      method: method,
      params: JSON.stringify(params)
    })
    var req = http.request({
      host: 'localhost',
      port: 9000,
      method: 'GET',
      path: '/?' + qs
    }, function(res) {
      if(res.statusCode === 200)
        return cb()
      res.setEncoding('utf8')
      res.on('data', function(data) {
        console.error(data)
      })
    })

    req.on('error', function(err) {
      console.error(err)
    })
    req.end()
  },
  waitForConnection: function(cb) {
    var self = this
    http.get(this.baseHref, function(res) {
      cb()
    }).on('error', function() {
      self.waitForConnection(cb)
    })
  },
  onStdOut: function(data) {
//    console.log(data)
  },
  onStdErr: function(data) {
 //   console.log(data)
  },
  onExit: function(code) {
  //  console.log(code)
  },
  stop: function(err, cb) {
    this.process.kill()
    cb()
  }
}


module.exports = Driver
