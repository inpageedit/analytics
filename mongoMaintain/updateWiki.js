/**
 * InPageEdit Analytics 更新wiki数据
 * @author 机智的小鱼君
 * @desc 用于更新 wiki 的站名或者域名的 MongoDB 脚本
 */

// 查找的wiki
var siteUrl = 'https://foo.com'
var userName = ''
// 设定新的站点信息
var newSiteUrl = ''
var newSiteName = ''

// 查找的集合(一般不修改)
var col = 'analytics_v5'
var updates = {}
if (newSiteName) updates.siteName = newSiteName
if (newSiteUrl) update.siteUrl = newSiteUrl

db.collection(col).update({ siteUrl }, { $set: updates })
