var ret = require('../_return')

function queryWiki(req, res) {
  // const { type, siteurl, sitename, username, prop, limit, sortby, sortprop } = req.query
  // var find = {}

  require('../database/find')('analysis', {}, (error, docs) => {
    if (error) {
      ret.error = error
      res.status(503).send(ret)
      return
    }
    ret.query = docs
    res.send(ret)
  })
}

function queryUnknown(req, res) {
  ret.error = 'Invalid type: ' + req.query.type
  res.status(400).send(ret)
}

module.exports = (req, res) => {
  const { type } = req.query

  switch (type) {
    case 'wiki':
      return queryWiki(req, res)
    default:
      return queryUnknown(req, res)
  }
}
