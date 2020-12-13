const mongodb = require('./_connect')

module.exports = (colName, find = {}, next) => {
  mongodb(db => {
    db.collection(colName, (error, col) => {
      if (error) {
        next && next({ error })
        return
      }
      col.find(find).toArray((error, docs) => {
        if (error) {
          next && next({ error })
          return
        }
        next && next(docs)
      })
    })
  })
}
