module.exports = (req, res) => {
  const ret = require('./_return')()
  ret.msg.push('hello, world')
  res.send(ret)
}
