import { VercelRequest, VercelResponse } from '@vercel/node'
import { Document } from 'mongodb'
import {
  colName,
  dbClient,
  dbName,
  getProjectSrotFromStr,
  HandleResponse,
} from './util'

export default async (req: VercelRequest, res: VercelResponse) => {
  const http = new HandleResponse(req, res)

  try {
    const { client, db, col } = await dbClient(req.query.devMode)
    await client.connect()

    const dbStats = await db.stats()
    const colStats = await col.stats()

    await client.close()
    return http.send(200, 'ok', { dbStats, colStats })
  } catch (err) {
    return http.mongoError(err)
  }
}
