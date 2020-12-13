const dbConnect = require('./dbConnect')

/**
 * 
 * @param {Object} options
 * @param {String} options.collection
 * @param {Object} options.find 
 * @param {Object} options.project
 * @param {Object} options.sort
 * @param {Function} next 
 */
module.exports = (options, next) => {

  const { collection, find = {}, project = {}, sort = {} } = options

  if (!collection) {
    next && next('Invalid collection', null)
    return
  }

  dbConnect((error, db) => {
    if (error) {
      next && next(error, null)
      return
    }
    db.collection(collection, (error, col) => {
      if (error) {
        next && next(error, null)
        return
      }
      col.find(find).project(project).sort(sort).toArray((error, docs) => {
        if (error) {
          next && next(error, null)
          return
        }
        next && next(null, docs)
      })
    })
  })
}
