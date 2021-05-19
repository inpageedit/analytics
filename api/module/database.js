const { MongoClient, Db } = require('mongodb')
const dbName = 'inpageedit'
const uri = process.env.MONGODB_URI || 'mongodb://localhost'

/**
 * @returns {Promise<Db>}
 */
function dbConnect() {
  return new Promise((next, reject) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    client.connect((error) => {
      if (error) {
        reject(error)
      }
      const db = client.db(dbName)
      next(db)
      // client.close()
    })
  })
}

/**
 * @returns {Promise<import('mongodb').Collection>}
 */
function dbCollection(collection) {
  return new Promise(async (next, reject) => {
    const db = await dbConnect(dbName)
    db.collection(collection, (error, col) => {
      if (error) {
        return reject(error)
      }
      next(col)
    })
  })
}

function dbFind(colName, find = {}, project = {}, sort = {}) {
  return new Promise(async (next, reject) => {
    const col = await dbCollection(colName)
    col
      .find(find)
      .project(project)
      .sort(sort)
      .toArray((error, docs) => {
        if (error) {
          return reject(error)
        }
        next(docs)
      })
  })
}

function dbInsertOne(colName, doc) {
  return new Promise(async (next, reject) => {
    const col = await dbCollection(colName)
    try {
      const res = await col.insertOne(doc)
      next(res)
    } catch (err) {
      reject(err)
    }
  })
}

function dbUpdateOne(colName, filter = {}, update = {}) {
  return new Promise(async (next, reject) => {
    const col = await dbCollection(colName)
    try {
      const res = await col.updateOne(filter, update)
      next(res)
    } catch (err) {
      reject(err)
    }
  })
}

function dbDeleteOne(colName, filter = {}) {
  return Promise(async (next, reject) => {
    const col = await dbCollection(colName)
    col.deleteOne(filter, (err, res) => {
      if (err) {
        return reject(err)
      }
      next(res)
    })
  })
}

module.exports = {
  dbConnect,
  dbCollection,
  dbFind,
  dbInsertOne,
  dbUpdateOne,
  dbDeleteOne,
}
