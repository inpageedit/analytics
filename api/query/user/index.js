const dbFind = require('../../module/dbFind')
const pretty = require('../../module/prettyPrint')

function send({ title = '', req, res, ret, status = 200 }) {
  if (req.query && req.query.pretty) {
    ret = pretty({ title, query: req.query, result: ret, status })
  }
  res.status(status).send(ret)
}

/**
 * @function queryUser 查询指定 wiki 的用户信息
 */
function queryUser(req, res) {
  var ret = require('../../_return')()

  var { siteurl, username } = req.query

  if (!siteurl || !username) {
    ret.error = 'Missing params: siteurl & username are required'
    ret.status = false
    send({ title: '请求错误', req, res, ret, status: 400 })
    return
  }

  var usernameSafe = username.replace(/\./g, '{dot}')

  var project = {}
  project['users.' + usernameSafe] = 1
  project['sitename'] = 1
  project['url'] = 1

  dbFind({
    collection: 'analysis',
    find: {
      url: siteurl
    },
    project
  }, (error, docs) => {
    if (error) {
      ret.error = error
      ret.status = false
      send({ title: '服务器错误', req, res, ret, status: 503 })
      return
    }
    if (docs.length > 0) {
      var data = docs[0]
      var userObj = {}
      userObj[data.url] = {}
      userObj[data.url][username] = data.users[usernameSafe]
      ret.query = {
        user: userObj
      }
    } else {
      ret.msg.push(`Can not find user data for ${username} in ${siteurl}, user or site may not exist.`)
    }
    send({ req, res, ret })
  })
}

module.exports = queryUser