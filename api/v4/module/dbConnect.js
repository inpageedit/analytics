const { MongoClient } = require('mongodb')
const dbName = 'inpageedit'
const uri = process.env.MONGODB_URI || 'mongodb://localhost'

module.exports = (next) => {
  const client = new MongoClient(uri, { useNewUrlParser: true })
  client.connect((error) => {
    if (error) {
      next && next(error, null)
      return
    }
    const db = client.db(dbName)
    next && next(null, db)
  })
  client.close()
}
