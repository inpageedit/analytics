import { VercelRequest, VercelResponse } from '@vercel/node'
import { Document } from 'mongodb'
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
  const siteUrl = req.query.siteUrl as string
  req.query.prop = (req.query.prop as string) || 'siteUrl|siteName|_total'
  req.query.sort = (req.query.sort as string) || '_id'
  const limit = Math.min(100, Math.max(1, Number(req.query.limit))) || 10
  const offset = Math.max(0, Number(req.query.offset)) || 0

  try {
    const client = await dbClient()
    await client.connect()
    const col = client.db(dbName).collection(colName)

    const aggregate: Document[] = [
      // Group by siteUrl
      {
        $group: {
          _id: {
            siteUrl: '$siteUrl',
            userName: '$userName',
            featureID: '$featureID',
          },
          _total: { $sum: 1 },
          siteName: { $first: '$siteName' },
        },
      },
      // Group users
      {
        $group: {
          _id: {
            siteUrl: '$_id.siteUrl',
            featureID: '$_id.featureID',
          },
          _total: { $sum: '$_total' },
          siteUrl: { $first: '$_id.siteUrl' },
          siteName: { $first: '$siteName' },
          users: {
            $push: {
              userName: '$_id.userName',
              count: '$_total',
            },
          },
        },
      },
      // Group features
      {
        $group: {
          _id: {
            siteUrl: '$_id.siteUrl',
          },
          _total: { $sum: '$_total' },
          siteUrl: { $first: '$_id.siteUrl' },
          siteName: { $first: '$siteName' },
          features: {
            $addToSet: {
              featureID: '$_id.featureID',
              count: '$_total',
            },
          },
          users: { $first: '$users' },
        },
      },
      {
        $project: {
          _id: false,
        },
      },
      { $sort: getProjectSrotFromStr(req.query.sort) },
      { $limit: limit },
      { $skip: offset },
    ]

    // Filter sites
    if (siteUrl) {
      aggregate.unshift({
        $match: { siteUrl },
      })
    }

    let dbResult = await col.aggregate(aggregate)
    if (req.query.prop !== '*') {
      dbResult = dbResult.project(getProjectSrotFromStr(req.query.prop))
    }
    const finalArr = await dbResult.toArray()

    await client.close()
    return http.send(
      200,
      'ok',
      { query: finalArr },
      { limit, offset, hasNext: !(finalArr.length < limit) }
    )
  } catch (err) {
    return http.mongoError(err)
  }
}
