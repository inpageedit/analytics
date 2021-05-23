const { dbFind, dbInsertOne, dbUpdateOne } = require('../module/database')

const whiteList = [
  'find_replace',
  'plugin_setting',
  'preview_edit',
  'quick_diff',
  'quick_diff_edit',
  'quick_diff_history_page',
  'quick_diff_modalclick',
  'quick_diff_recentchanges',
  'quick_edit',
  'quick_edit_pagedetail',
  'quick_edit_pagedetail_edit_template',
  'quick_edit_pagedetail_view_image',
  'quick_edit_save',
  'quick_move',
  'quick_redirect',
  'tool_box',
]

function today() {
  const now = new Date()
  const year = now.getFullYear()
  const month = `0${now.getMonth() + 1}`
  const day = `0${now.getDate()}`
  return `${year}-${month.substring(month.length - 2)}-${day.substring(
    day.length - 2
  )}`
}

function insertNewWiki({ siteurl, sitename, username, functionID }) {
  const date = {}
  date[today()] = {}
  date[today()]._total = 1
  date[today()][functionID] = 1

  const functions = {}
  functions[functionID] = 1

  const users = {}
  users[username] = {}
  users[username]._total = 1
  users[username].date = {}
  users[username].date[today()] = {}
  users[username].date[today()]._total = 1
  users[username].date[today()][functionID] = 1
  users[username].functions = {}
  users[username].functions[functionID] = 1

  return dbInsertOne('analysis', {
    _id: siteurl,
    url: siteurl,
    sitename,
    _total: 1,
    date,
    users,
    functions,
  })
}

module.exports = async function(req, res) {
  var ret = require('../_return')()

  if (req.method.toLowerCase() !== 'post') {
    ret.status = false
    ret.error = 'Invalid method: ' + req.method
    res.status(400).send(ret)
    return
  }

  const params = req.body || req.query || {}
  params.siteurl = params.siteurl || params.url
  params.functionID = params.functionID || params['function']
  let { siteurl, sitename, username, functionID } = params

  // 判断参数完整性
  if (!siteurl || !sitename || !username || !functionID) {
    ret.status = false
    ret.error = 'Missing param(s)'
    res.status(400).send(ret)
    return
  }

  // 判断功能 ID 合法性
  // if (!whiteList.includes(functionID)) {
  //   ret.error = 'Invalid function ID: ' + functionID
  //   ret.status = false
  //   res.status(400).send(ret)
  //   return
  // }

  sitename = sitename.replace(/\./g, '{dot}')
  username = username.replace(/\./g, '{dot}')

  ret.submit = {
    siteurl,
    sitename,
    username,
    functionID,
  }

  const wikisFind = await dbFind('analysis', { url: siteurl })

  // 未保存过
  if (wikisFind.length < 1) {
    const insert = await insertNewWiki({
      siteurl,
      sitename,
      username,
      functionID,
    })
    // ret.database = insert
    res.send(ret)
    return
  }

  const wiki = wikisFind[0]

  // total
  wiki._total++

  // date
  if (!wiki.date[today()]) {
    ret.msg.push('New date logged')
    const date = {}
    date[today()] = {}
    date[today()]._total = 0
    date[today()][functionID] = 0

    wiki.date = date
  }
  if (!wiki.date[today()][functionID]) {
    ret.msg.push('New date → function logged')
    const date = wiki.date[today()]
    date[functionID] = 0
  }
  wiki.date[today()]._total++
  wiki.date[today()][functionID]++

  // functions
  if (!wiki.functions[functionID]) {
    ret.msg.push('New function logged')
    wiki.functions[functionID] = 0
  }
  wiki.functions[functionID]++

  // users
  if (!wiki.users[username]) {
    ret.msg.push('New user added')
    const user = {}
    user._total = 0
    user.date = {}
    user.date[today()] = {}
    user.date[today()]._total = 0
    user.date[today()][functionID] = 0
    user.functions = {}
    user.functions[functionID] = 0

    wiki.users[username] = user
  }
  // user → today
  if (!wiki.users[username].date[today()]) {
    ret.msg.push('New user → date logged')
    const userDate = wiki.users[username].date
    userDate[today()] = {}
    userDate[today()]._total = 0
    userDate[today()][functionID] = 0
  }
  // user → today → functionID
  if (!wiki.users[username].date[today()][functionID]) {
    wiki.users[username].date[today()][functionID] = 0
  }
  // user → functions
  wiki.users[username].functions = wiki.users[username].functions || {}
  wiki.users[username].functions[functionID] =
    wiki.users[username].functions[functionID] || 0
  // user++
  let thisUser = wiki.users[username]
  thisUser._total++
  thisUser.date[today()]._total++
  thisUser.date[today()][functionID]++
  thisUser.functions[functionID]++

  const updateRet = await dbUpdateOne(
    'analysis',
    { _id: siteurl },
    { $set: wiki }
  )

  // ret.database = updateRet
  res.send(ret)
}
