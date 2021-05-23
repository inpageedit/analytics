/**
 * InPageEdit Analysis 更新wiki数据
 * @author 机智的小鱼君
 * @description 用于更新 wiki 的站名或者域名的 MongoDB 脚本
 */

// 查找的 wiki
var oldSite = ''
var newSite = ''

// 查找的集合(一般不修改)
var col = 'analysis_test'

// 查找 wiki
const wikis = db.getCollection(col).find({ _id: { $in: [oldSite, newSite] } })
if (wikis.length < 2) return

const oldData = wikis.find(({ url }) => url === oldSite)
const newData = wikis.find(({ url }) => url === newSite)
if (!oldData || !newData) return

let data = oldData

// ...