import { VercelRequest, VercelResponse } from '@vercel/node'
import {
  colName,
  dbClient,
  dbName,
  HandleResponse,
  isValidUrl,
  isValidUserName,
} from './util'

export interface DbSubmitData {
  siteUrl: string
  siteName: string
  userName: string
  featureID: string
  date: Date
  timestamp: number // 时间戳
}

export default async (req: VercelRequest, res: VercelResponse) => {
  const http = new HandleResponse(req, res)
  const now = new Date()
  if (req.method.toLowerCase() !== 'post') {
    return http.send(405, `Invalid method: ${req.method}`)
  }

  req.body = req?.body || {}
  req.body.featureID = req?.body?.featureID || req?.body?.functionID || ''
  const { siteUrl, siteName, userName, featureID } = req.body as DbSubmitData

  if (!siteUrl || !siteName || !userName || !featureID) {
    return http.send(400, 'Missing params')
  }
  if (!isValidUrl(siteUrl)) {
    return http.send(400, 'Bad site URL')
  }
  if (!isValidUserName(userName)) {
    return http.send(400, 'Bad user name')
  }

  try {
    const client = await dbClient()
    await client.connect()
    const dbResult = await client.db(dbName).collection(colName).insertOne({
      siteUrl,
      siteName,
      userName,
      featureID,
      timestamp: now.getTime(),
      date: now,
    })

    await client.close()
    return http.send(200, 'ok', { submit: dbResult })
  } catch (err) {
    return http.mongoError(err)
  }
}
