const { dbFind, dbInsertOne, dbUpdateOne } = require('../module/database')
const { send } = require('../module/send')

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

function getToday() {
  const now = new Date()
  const year = now.getFullYear()
  const month = `0${now.getMonth() + 1}`
  const day = `0${now.getDate()}`
  return `${year}-${month.substring(month.length - 2)}-${day.substring(
    day.length - 2
  )}`
}

function insertNewWiki({ siteurl, sitename, username, functionID }) {
  const today = getToday()

  const date = {}
  date[today] = {}
  date[today]._total = 1
  date[today][functionID] = 1

  const functions = {}
  functions[functionID] = 1

  const users = {}
  users[username] = {}
  users[username]._total = 1
  users[username].date = {}
  users[username].date[today] = {}
  users[username].date[today]._total = 1
  users[username].date[today][functionID] = 1
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
  const msg = []
  const today = getToday()

  if (req.method.toLowerCase() !== 'post') {
    return send({
      title: 'HTTP 方法错误',
      content: { status: false, error: 'Invalid method: ' + req.method },
      req,
      res,
      status: 403,
    })
  }

  const params = req.body || req.query || {}
  params.siteurl = params.siteurl || params.url
  params.functionID = params.functionID || params['function']
  let { siteurl, sitename, username, functionID } = params

  // 判断参数完整性
  if (!siteurl || !sitename || !username || !functionID) {
    return send({
      title: '缺少参数',
      content: { status: false, error: `Missing param(s)` },
      req,
      res,
      status: 400,
    })
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

  const submit = {
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
    msg.push('New wiki logged')
    return send({ req, res, content: { msg, submit } })
  }

  const wiki = wikisFind[0]

  // total
  wiki._total++

  // date
  if (!wiki.date[today]) {
    msg.push('New date logged')
    const date = {}
    date[today] = {}
    date[today]._total = 0
    date[today][functionID] = 0

    wiki.date = { ...wiki.date, ...date }
  }
  if (!wiki.date[today][functionID]) {
    msg.push('New date → function logged')
    const date = wiki.date[today]
    date[functionID] = 0
  }
  wiki.date[today]._total++
  wiki.date[today][functionID]++

  // functions
  if (!wiki.functions[functionID]) {
    msg.push('New function logged')
    wiki.functions[functionID] = 0
  }
  wiki.functions[functionID]++

  // users
  if (!wiki.users[username]) {
    msg.push('New user added')
    const user = {}
    user._total = 0
    user.date = {}
    user.date[today] = {}
    user.date[today]._total = 0
    user.date[today][functionID] = 0
    user.functions = {}
    user.functions[functionID] = 0

    wiki.users[username] = user
  }
  // user → today
  if (!wiki.users[username].date[today]) {
    msg.push('New user → date logged')
    const userDate = wiki.users[username].date
    userDate[today] = {}
    userDate[today]._total = 0
    userDate[today][functionID] = 0
  }
  // user → today → functionID
  if (!wiki.users[username].date[today][functionID]) {
    wiki.users[username].date[today][functionID] = 0
  }
  // user → functions
  wiki.users[username].functions = wiki.users[username].functions || {}
  wiki.users[username].functions[functionID] =
    wiki.users[username].functions[functionID] || 0
  // user++
  let thisUser = wiki.users[username]
  thisUser._total++
  thisUser.date[today]._total++
  thisUser.date[today][functionID]++
  thisUser.functions[functionID]++

  const updateRet = await dbUpdateOne(
    'analysis',
    { _id: siteurl },
    { $set: wiki }
  )

  // ret.database = updateRet
  return send({ req, res, content: { msg, submit } })
}
