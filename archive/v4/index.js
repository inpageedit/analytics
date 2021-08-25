const { send } = require('./module/send')

module.exports = (req, res) => {
  send({ req, res, content: { msg: ['hello, world'] } })
}
