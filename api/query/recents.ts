import { VercelRequest, VercelResponse } from '@vercel/node'
import {
  colName,
  dbClient,
  dbName,
  getProjectSrotFromStr,
  HandleResponse,
} from '../util'

export default async (req: VercelRequest, res: VercelResponse) => {
  const http = new HandleResponse(req, res)

  // 预设与标准化
  req.query.prop = (req.query.prop as string) || 'date|siteUrl|userName'
  req.query.sort = (req.query.sort as string) || '!_id'
  const limit = Math.min(100, Math.max(1, Number(req.query.limit))) || 10
  const offset = Math.max(0, Number(req.query.offset)) || 0

  try {
    const client = await dbClient()
    await client.connect()
    const col = client.db(dbName).collection(colName)
    const docCount = await col.countDocuments()

    let dbResult = col
      .find({})
      .sort(getProjectSrotFromStr(req.query.sort))
      .limit(limit)
      .skip(offset)
    if (req.query.prop !== '*') {
      dbResult = dbResult.project(getProjectSrotFromStr(req.query.prop))
    }
    const finalArr = await dbResult.toArray()

    await client.close()
    return http.send(
      200,
      'ok',
      { query: finalArr },
      {
        limit,
        offset,
        docCount,
        hasNext: offset + finalArr.length < docCount,
      }
    )
  } catch (err) {
    return http.mongoError(err)
  }
}
