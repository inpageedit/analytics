const { dbFind } = require('../module/database')
const { send } = require('../module/send')

const Time = (function() {
  this.now = Date.now()
  this.second = 1000
  this.minute = 60 * this.second
  this.hour = 60 * this.minute
  this.day = 24 * this.hour
  this.year = 365 * this.day

  this.dayAgo = (day, from) => {
    from = from || this.now
    return new Date(from).getTime() - this.day * day
  }

  this.ymd = (time) => {
    time = time || this.now
    const date = new Date()
    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`
    const day = `0${date.getDate()}`
    return `${year}-${month.substring(month.length - 2)}-${day.substring(
      day.length - 2
    )}`
  }

  return this
})()

function getDateArr(from, to) {
  const arr = []
  for (let i = from; i < to; i = i + Time.day) {
    console.log(i)
    arr.push(Time.ymd(i))
  }
  return arr
}

/**
 * @function queryWiki 通过 wiki 搜索
 */
async function queryWiki(req, res) {
  const msg = []

  var { siteurl, sitename, prop, sortby, sortorder, limit } = req.query
  var find = {}
  var project = {}
  var sort = {}

  // 处理使用 URL 或是 SiteName 搜索
  if (siteurl) {
    siteurl = decodeURI(siteurl)
    find.url = siteurl
    msg.push(`Find via URL: ${siteurl}`)
  } else if (sitename) {
    find.sitename = new RegExp(sitename, 'i')
    msg.push(`Find via sitename: ${sitename}`)
    msg.push(
      'Note: Find via sitename is not recommended, please use siteurl instead.'
    )
  } else {
    msg.push('Find all wikis')
  }

  // 处理搜索字段
  if (!prop) {
    project = {
      url: 1,
      sitename: 1,
      _total: 1,
    }
  } else if (prop === '*' || prop === 'all') {
    project = {}
  } else {
    prop = prop.split('|')
    prop.forEach((element) => {
      project[element] = 1
    })
  }

  var allProject = Object.keys(project)
  if (allProject.length === 0) {
    msg.push('Find all props')
  } else {
    msg.push(
      `Find via ${allProject.length > 1 ? 'props' : 'prop'}: ${allProject.join(
        ', '
      )}`
    )
  }

  // 处理排序顺逆
  if (!sortorder) sortorder = 1
  if (Number(sortorder) >= 0) {
    sortorder = 1
  } else {
    sortorder = -1
  }

  // 处理排序键
  if (sortby) {
    sort[sortby] = sortorder
    msg.push(
      `Sort in ${
        sortorder > 0 ? 'acending order' : 'descending order'
      } of ${sortby}`
    )
  }

  // 开始搜索
  try {
    const docs = await dbFind('analysis', find, project, sort)
    return send({ title: '', req, res, content: { msg, query: docs } })
  } catch (err) {
    return send({
      title: '服务器错误',
      req,
      res,
      content: { error: err, status: false },
      status: 503,
    })
  }
}

function queryDate(req, res) {
  return send({
    req,
    res,
    content: {
      msg: ['In progress'],
      query: [],
    },
  })
}

module.exports = (req, res) => {
  const { queryType } = req.query
  switch (queryType) {
    case 'wiki':
    case 'site':
      return queryWiki(req, res)
    case 'date':
      return queryDate(req, res)
    default:
      return send({
        title: 'API 未找到',
        req,
        res,
        content: {
          msg: ['API Not Found'],
          apis: { wiki: '/api/query/wiki', date: '/api/query/date' },
        },
        status: 404,
      })
  }
}
