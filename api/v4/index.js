module.exports = (req, res) => {
  var ret = require('./_return')()
  ret.msg.push('hello, world')

  ret.api = {
    query: {
      url: '/api/v4/query/:type',
      method: 'get'
    },
    submit: {
      url: '/api/v4/submit',
      method: 'post'
    },
    update: {
      url: '/api/v4/update/:type',
      method: 'put',
      disabled: true
    }
  }

  res.send(ret)
}
