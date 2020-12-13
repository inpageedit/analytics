const mongodb = require('./_connect')

module.exports = (colName, find = {}, next) => {
  mongodb((error, db) => {
    if (error) {
      next && next(error, null)
      return
    }
    db.collection(colName, (error, col) => {
      if (error) {
        next && next(error, null)
        return
      }
      col.find(find).toArray((error, docs) => {
        if (error) {
          next && next(error, null)
          return
        }
        next && next(null, docs)
      })
    })
  })
}
