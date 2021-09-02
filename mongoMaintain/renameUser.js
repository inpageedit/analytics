/**
 * InPageEdit Analytics 用户重命名
 * @author 机智的小鱼君
 * @desc 用于更新用户名的 MongoDB 脚本
 */

// 查找的wiki
var siteUrl = 'https://foo.com'
// 查找的用户名
var userName = ''
// 设定新的用户名
var newUserName = ''

// 查找的集合(一般不修改)
var col = 'analytics_v5'

db.collection(col).update(
  { siteUrl, userName },
  { $set: { userName: newUserName } }
)
