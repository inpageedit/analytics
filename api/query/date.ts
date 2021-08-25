import { VercelRequest, VercelResponse } from '@vercel/node'
import { Document } from 'mongodb'
import {
  colName,
  dbClient,
  dbName,
  getProjectSrotFromStr,
  HandleResponse,
} from '../util'

function intConvert(str: any) {
  return isNaN(parseInt(str)) ? str : parseInt(str)
}

export default async (req: VercelRequest, res: VercelResponse) => {
  const http = new HandleResponse(req, res)

  // 预设与标准化
  req.query.prop = (req.query.prop as string) || '_total|date'
  req.query.to = (req.query.to as string) || `${Date.now()}`
  req.query.sort = (req.query.sort as string) || 'date'
  req.query.interval = (req.query.interval as string) || 'day'
  let format = ''
  switch (req.query.interval.toLowerCase()) {
    case 'year':
      format = '%Y'
      break
    case 'month':
      format = '%Y-%m'
      break
    case 'day':
    default:
      format = '%Y-%m-%d'
      break
    case 'hour':
      format = '%Y-%m-%d %H:00:00'
      break
  }

  let { from, to } = req.query as Record<string, string>
  if (!from) {
    return http.send(400, 'Missing date `from`')
  }
  const fromTime = new Date(intConvert(from))
  const toTime = new Date(intConvert(to))
  if (isNaN(fromTime.getTime() + toTime.getTime())) {
    return http.send(
      400,
      'Invalid date',
      {},
      { date: { from, to, fromTime, toTime } }
    )
  }

  try {
    const client = await dbClient()
    await client.connect()
    const col = client.db(dbName).collection(colName)

    const aggregate: Document[] = [
      // Filter by timestamp
      {
        $match: {
          date: {
            $gt: fromTime,
            $lt: toTime,
          },
        },
      },
      // Group by day
      {
        $group: {
          _id: {
            date: { $dateToString: { date: '$date', format } },
            siteName: '$siteName',
            userName: '$userName',
            featureID: '$featureID',
          },
          _total: { $sum: 1 },
        },
      },
      // Group sites
      {
        $group: {
          _id: {
            date: '$_id.date',
            userName: '$_id.userName',
            featureID: '$_id.featureID',
          },
          _total: { $sum: '$_total' },
          date: { $first: '$_id.date' },
          sites: { $push: { siteName: '$_id.siteName', count: '$_total' } },
        },
      },
      // Group users
      {
        $group: {
          _id: {
            date: '$_id.date',
            featureID: '$_id.featureID',
          },
          _total: { $sum: '$_total' },
          date: { $first: '$date' },
          sites: { $first: '$sites' },
          users: {
            $push: {
              userName: '$_id.userName',
              siteName: '$siteName',
              count: '$_total',
            },
          },
        },
      },
      // Group features
      {
        $group: {
          _id: {
            date: '$_id.date',
          },
          _total: { $sum: '$_total' },
          date: { $first: '$date' },
          sites: { $first: '$sites' },
          users: { $first: '$users' },
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
      {
        $sort: getProjectSrotFromStr(req.query.sort),
      },
    ]

    let dbResult = await col.aggregate(aggregate)
    if (req.query.prop !== '*') {
      dbResult = dbResult.project(getProjectSrotFromStr(req.query.prop))
    }
    const finalArr = await dbResult.toArray()

    await client.close()
    return http.send(200, 'ok', { query: finalArr }, { fromTime, toTime })
  } catch (err) {
    return http.mongoError(err)
  }
}
