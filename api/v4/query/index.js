var ret = require('../_return')()

module.exports = (req, res) => {
  ret.api = {
    user: {
      url: '/api/v4/qeury/user',
      method: 'get'
    },
    wiki: {
      url: '/api/v4/query/wiki',
      method: 'get'
    }
  }
  res.send(ret)
}