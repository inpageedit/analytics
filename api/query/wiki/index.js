const { dbFind } = require('../../module/database')
const pretty = require('../../module/prettyPrint')

function send({ title = '', req, res, ret, status = 200 }) {
  if (req.query && req.query.pretty) {
    ret = pretty({ title, query: req.query, result: ret, status })
  }
  res.status(status).send(ret)
}

/**
 * @function queryWiki 通过 wiki 搜索
 */
async function queryWiki(req, res) {
  var ret = require('../../_return')()

  var { siteurl, sitename, prop, sortby, sortorder, limit } = req.query
  var find = {}
  var project = {}
  var sort = {}

  // 处理使用 URL 或是 SiteName 搜索
  if (siteurl) {
    siteurl = decodeURI(siteurl)
    find.url = siteurl
    ret.msg.push(`Find via URL: ${siteurl}`)
  } else if (sitename) {
    find.sitename = new RegExp(sitename, 'i')
    ret.msg.push(`Find via sitename: ${sitename}`)
    ret.msg.push(
      'Note: Find via sitename is not recommended, please use siteurl instead.'
    )
  } else {
    ret.msg.push('Find all wikis')
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
    ret.msg.push('Find all props')
  } else {
    ret.msg.push(
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
    ret.msg.push(
      `Sort in ${
        sortorder > 0 ? 'acending order' : 'descending order'
      } of ${sortby}`
    )
  }

  // 开始搜索
  try {
    const docs = await dbFind('analysis', find, project, sort)
    ret.query = docs
    send({ req, res, ret })
  } catch (err) {
    ret.error = err
    ret.status = false
    send({ req, res, title: '服务器错误', ret, status: 503 })
  }
}

module.exports = queryWiki
