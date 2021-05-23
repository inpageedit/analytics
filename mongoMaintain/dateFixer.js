Object.prototype.each = function(next) {
  Object.keys(this).forEach((key) => {
    next && next(key, this[key])
  })
}

const docs = db.analysis.find().toArray()
const users = docs.users
const arr = []
users.each((key, val) => {
  arr.push({
    name: key,
    values: val,
  })
})
console.log(arr)
