const allowedFunctions = require('./allowedFunctions')

function insertNewWiki(data) { }

function insertNewUser(data) { }

function insertNewFunction(data) { }

function updateUserData(data) { }

function submitData(req, res) {
  var ret = require("../_return")()

  if (req.method.toLowerCase() !== 'post') {
    ret.error = 'Invalid method: ' + req.method
    res.status(400).send(ret)
    return
  }

  var { siteurl, sitename, username, functionID } = req.body || {}

  // 判断参数完整性
  if (!siteurl || !sitename || !username || !functionID) {
    ret.error = 'Missing param(s)'
    ret.status = false
    res.status(400).send(ret)
  }

  // 判断功能 ID 合法性
  if (allowedFunctions.indexOf(functionID) < 0) {
    ret.error = 'Invalid function ID: ' + functionID
    ret.status = false
    res.status(400).send(ret)
    return
  }

  // TBD
  ret.msg.push('Submit module TBD')
  ret.submit = {
    siteurl,
    sitename,
    username,
    functionID
  }
  res.send(ret)

}

module.exports = submitData