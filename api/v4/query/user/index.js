var ret = require('../../_return')
const dbFind = require('../../module/dbFind')

/**
 * @function queryUser 查询指定 wiki 的用户信息
 */
function queryUser(req, res) {
  var { siteurl, username } = req.query
  ret.query = {
    user: {}
  }

  if (!siteurl || !username) {
    ret.error = 'Missing params: siteurl & username are required'
    ret.status = false
    res.status(400).send(ret)
    return
  }

  var project = {}
  project['users.' + username] = 1
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
      ret.query.user = docs[0]
    } else {
      ret.msg.push(`Can not find user data for ${username} in ${siteurl}`)
    }
    res.send(ret)
  })
}

module.exports = queryUser