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

  try {
    const { client, db, col } = await dbClient(req.query.devMode)
    await client.connect()

    const total = await col.countDocuments()
    const sites = (
      await col
        .aggregate([
          {
            $group: {
              _id: {
                siteUrl: '$siteUrl',
              },
            },
          },
          {
            $project: {
              _id: 0,
            },
          },
        ])
        .toArray()
    ).length
    const users = (
      await col
        .aggregate([
          {
            $group: {
              _id: {
                siteUrl: '$siteUrl',
                userName: '$userName',
              },
            },
          },
          {
            $project: {
              _id: 0,
            },
          },
        ])
        .toArray()
    ).length
    await client.close()

    return http.send(200, 'ok', { total, users, sites })
  } catch (err) {
    return http.mongoError(err)
  }
}
