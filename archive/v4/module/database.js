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
    client.connect(async (error) => {
      if (error) {
        client.close()
        return reject(error)
      }
      const db = client.db(dbName)
      db._client = client
      next(db)
    })
  })
}

/**
 * @returns {Promise<mport('mongodb').Collection>}
 */
function dbCollection(collection) {
  return new Promise(async (next, reject) => {
    const db = await dbConnect(dbName)
    db.collection(collection, async (error, col) => {
      if (error) {
        await db._client.close()
        return reject(error)
      }
      col._client = db._client
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
      .toArray(async (error, docs) => {
        if (error) {
          await col._client.close()
          return reject(error)
        }
        await col._client.close()
        next(docs)
      })
  })
}

function dbInsertOne(colName, doc) {
  return new Promise(async (next, reject) => {
    const col = await dbCollection(colName)
    try {
      const res = await col.insertOne(doc)
      await col._client.close()
      next(res)
    } catch (err) {
      await col._client.close()
      return reject(err)
    }
  })
}

function dbUpdateOne(colName, filter = {}, update = {}) {
  return new Promise(async (next, reject) => {
    const col = await dbCollection(colName)
    try {
      const res = await col.updateOne(filter, update)
      await col._client.close()
      next(res)
    } catch (err) {
      await col._client.close()
      reject(err)
    }
  })
}

function dbDeleteOne(colName, filter = {}) {
  return Promise(async (next, reject) => {
    const col = await dbCollection(colName)
    col.deleteOne(filter, async (err, res) => {
      if (err) {
        await col._client.close()
        return reject(err)
      }
      await col._client.close()
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
