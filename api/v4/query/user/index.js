const dbFind = require('../../module/dbFind')

/**
 * @function queryUser 查询指定 wiki 的用户信息
 */
function queryUser(req, res) {
  var ret = require('../../_return')()

  var { siteurl, username } = req.query

  if (!siteurl || !username) {
    ret.error = 'Missing params: siteurl & username are required'
    ret.status = false
    res.status(400).send(ret)
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
      res.status(503).send(ret)
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
    res.send(ret)
  })
}

module.exports = queryUser