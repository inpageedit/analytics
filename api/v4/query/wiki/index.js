var ret = require('../../_return')
const dbFind = require('../../module/dbFind')

/**
 * @function queryWiki 通过 wiki 搜索
 */
function queryWiki(req, res) {
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
    ret.msg.push('Note: Find via sitename is not recommended, please use siteurl instead.')
  } else {
    ret.msg.push('Find all wikis')
  }

  // 处理搜索字段
  if (prop && (prop !== '*' || prop.toLowerCase() !== 'all')) {
    prop = prop.split('|')
    prop.forEach(element => {
      project[element] = 1
    })
  } else if (prop && (prop === '*' || prop.toLowerCase() === 'all')) {
    project = {}
  } else {
    project = {
      url: 1,
      sitename: 1,
      _total: 1
    }
  }
  var allProject = Object.values(project)
  if (allProject.length === 0) {
    ret.msg.push('Find all props')
  } else {
    ret.msg.push(`Find via ${allProject.length > 1 ? 'props' : 'prop'}: ${allProject.join(', ')}`)
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
    ret.msg.push(`Sort in ${sortorder > 0 ? 'acending order' : 'descending order'} of ${sortby}`)
  }

  // 开始搜索
  dbFind({
    collection: 'analysis',
    find,
    project,
    sort
  }, (error, docs) => {
    if (error) {
      ret.error = error
      ret.status = false
      res.status(503).send(ret)
      return
    }
    ret.qeury = {
      wiki: docs
    }
    res.send(ret)
  })
}

module.exports = queryWiki