import { VercelRequest, VercelResponse } from '@vercel/node'
import { isValidUrl, isValidUserName, router } from './utils'
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
  router.endpoint('/api/submit')

  // POST /api/submit
  router
    .addRoute()
    .method('POST')
    // Validate params
    .check(async (ctx) => {
      ctx.req.body.featureID = req.body.featureID || req.body.functionID || ''
      const { siteUrl, siteName, userName, featureID } = ctx.req
        .body as DbSubmitData

      if (!siteUrl || !siteName || !userName || !featureID) {
        ctx.status = 400
        ctx.message = 'Missing required parameters'
        return false
      }
      if (!isValidUrl(siteUrl)) {
        ctx.status = 400
        ctx.message = 'Invalid siteUrl'
        return false
      }
      if (!isValidUserName(userName)) {
        ctx.status = 400
        ctx.message = 'Invalid userName'
        return false
      }
    })
    // Validate InPageEdit Version
    .check(async (ctx) => {
      if (
        ctx.req.body.ipeVersion &&
        !/^\d+\.\d+\.\d+(-(alpha|beta|rc|fix)\.\d+)?$/.test(req.body.ipeVersion)
      ) {
        ctx.status = 400
        ctx.message = 'Invalid InPageEdit Version'
        return false
      }
    })
    // Check sensitive words
    .check(async (ctx) => {
      const { siteUrl, siteName, userName, featureID } = ctx.req
        .body as DbSubmitData
      if (!filter.validator(`${siteName}${siteUrl}${userName}${featureID}`)) {
        ctx.status = 400
        ctx.message = 'Sensitive words detacted'
        return false
      }
    })
    .action(async (ctx) => {
      const now = new Date()
      const { siteUrl, siteName, userName, featureID, ipeVersion } = ctx.req
        .body as DbSubmitData & { ipeVersion?: string }

      const submit = await ctx.col.insertOne({
        siteUrl,
        siteName,
        userName,
        featureID,
        ipeVersion,
        timestamp: now.getTime(),
        date: now,
      })

      ctx.message = 'ok'
      ctx.body = { submit }
    })
}
