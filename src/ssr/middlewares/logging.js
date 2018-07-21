const debug = require('debug')('service-ssr:middlewares:logging')

module.exports = (req, res, next) => {
  debug(`requesting ${req.url}`)
  next()
}
