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
  req.query.prop = (req.query.prop as string) || 'userName|siteUrl|_total'
  req.query.sort = (req.query.sort as string) || '_id'

  const { siteUrl, userName } = req.query as Record<string, string>
  if (!siteUrl || !userName) {
    return http.send(400, 'Missing params')
  }

  try {
    const client = await dbClient()
    await client.connect()
    const col = client.db(dbName).collection(colName)

    const aggregate: Document[] = [
      // Filter user
      { $match: { userName: { $in: userName.split('|') }, siteUrl } },
      // Group by user
      {
        $group: {
          _id: {
            userName: '$userName',
            featureID: '$featureID',
          },
          _total: { $sum: 1 },
          siteUrl: { $first: '$siteUrl' },
          siteName: { $first: '$siteName' },
          userName: { $first: '$userName' },
        },
      },
      // Group features
      {
        $group: {
          _id: {
            userName: '$_id.userName',
            // featureID: '$_id.featureID',
          },
          userName: { $first: '$userName' },
          siteUrl: { $first: '$siteUrl' },
          siteName: { $first: '$siteName' },
          _total: { $sum: '$_total' },
          features: {
            $push: {
              featureID: '$_id.featureID',
              count: '$_total',
            },
          },
        },
      },
      {
        $project: {
          _id: false,
        },
      },
      { $sort: getProjectSrotFromStr(req.query.sort) },
    ]

    let dbResult = await col.aggregate(aggregate)
    if (req.query.prop !== '*') {
      dbResult = dbResult.project(getProjectSrotFromStr(req.query.prop))
    }
    const finalArr = await dbResult.toArray()

    await client.close()
    return http.send(200, 'ok', { query: finalArr })
  } catch (err) {
    return http.mongoError(err)
  }
}
