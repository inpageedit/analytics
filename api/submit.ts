import { VercelRequest, VercelResponse } from '@vercel/node'
import {
  colName,
  dbClient,
  dbName,
  HandleResponse,
  isValidUrl,
  isValidUserName,
} from './util'
import { filter } from '@dragon-fish/sensitive-words-filter'

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
  if (req.body.ipeVersion && !/^[0-9\.\-]+$/gi.test(req.body.ipeVersion)) {
    return http.send(400, 'Invalid version')
  }
  if (!filter.validator(`${siteName}${siteUrl}${userName}${featureID}`)) {
    return http.send(403, 'Sensitive words detected')
  }

  try {
    const { client, col } = await dbClient(req.query.devMode)
    await client.connect()
    const dbResult = await col.insertOne({
      siteUrl,
      siteName,
      userName,
      featureID,
      ipeVersion: req.body?.ipeVersion,
      timestamp: now.getTime(),
      date: now,
    })

    await client.close()
    return http.send(200, 'ok', { submit: dbResult })
  } catch (err) {
    return http.mongoError(err)
  }
}
