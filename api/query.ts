import { VercelRequest, VercelResponse } from '@vercel/node'
import { Document } from 'mongodb'
import { getProjectSrotFromStr } from 'serverless-kit'
import { isValidUrl, router } from './utils.js'

export default async (req: VercelRequest, res: VercelResponse) => {
  router.endpoint('/api/query')

  // GET /api/query/stats
  router
    .addRoute()
    .path(['stats', 'meta'])
    .action(async (ctx) => {
      const { col } = ctx
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

      ctx.message = 'Query meta stats'
      ctx.body = { query: { total, sites, users } }
    })

  // GET /api/query/activities
  router
    .addRoute()
    .path(['activities', 'activity', 'recents', 'recent'])
    .parseLimits()
    .action(async (ctx) => {
      const { col } = ctx

      if (!ctx.req.query.sort) {
        ctx.sort = getProjectSrotFromStr('!_id')
      }
      if (!ctx.project && ctx.req.query.project !== '*') {
        ctx.project = getProjectSrotFromStr('date|siteUrl|userName')
      }

      let dbResult = col
        .find({})
        .sort(ctx.sort)
        .limit(ctx.limit + 1)
        .skip(ctx.offset)
      if (ctx.req.query.project !== '*') {
        dbResult = dbResult.project(ctx.project)
      }
      const activities = await dbResult.toArray()

      let hasNext = false
      if (activities.length > ctx.limit) {
        hasNext = true
        activities.pop()
      }

      ctx.message = 'Query activities'
      ctx.body = {
        query: activities,
        hasNext,
        offset: ctx.offset,
        limit: ctx.limit,
      }
    })

  // GET /api/query/date
  router
    .addRoute()
    .path(['date', 'time'])
    .parseLimits()
    .check((ctx) => {
      if (!ctx.req.query.sort) {
        ctx.sort = getProjectSrotFromStr('date')
      }
      if (!ctx.project && ctx.req.query.project !== '*') {
        ctx.project = getProjectSrotFromStr('_total|date')
      }
    })
    .action(async (ctx) => {
      const { req } = ctx
      // 预设与标准化
      req.query.to = (req.query.to as string) || `${Date.now()}`
      let format = ''
      switch ((req.query.interval + '').toLowerCase()) {
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
        ctx.status = 400
        ctx.message = 'Missing required param: from'
        return false
      }
      const fromTime = new Date(intConvert(from))
      const toTime = new Date(intConvert(to))
      if (isNaN(fromTime.getTime() + toTime.getTime())) {
        ctx.status = 400
        ctx.message = 'Invalid date'
        ctx.body = { from, to, fromTime, toTime }
        return false
      }

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
              siteUrl: '$siteUrl',
              userName: '$userName',
              featureID: '$featureID',
            },
            // _total: { $first: '$_id._total' },
            count: { $sum: 1 },
          },
        },
        // Group users
        {
          $group: {
            _id: {
              date: '$_id.date',
              siteName: '$_id.siteName',
              featureID: '$_id.featureID',
            },
            // _total: { $first: '$_total' },
            count: { $sum: '$count' },
            date: { $first: '$date' },
            users: {
              $push: {
                userName: '$_id.userName',
                siteUrl: '$_id.siteUrl',
                siteName: '$_id.siteName',
                count: '$count',
              },
            },
          },
        },
        // Group sites
        {
          $group: {
            _id: {
              date: '$_id.date',
              users: '$users',
              featureID: '$_id.featureID',
            },
            // _total: { $first: '$_total' },
            count: { $sum: '$count' },
            date: { $first: '$_id.date' },
            // users: { $first: '$users' },
            sites: {
              $push: {
                siteName: '$_id.siteName',
                siteUrl: '$_id.siteUrl',
                count: '$count',
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
            // _total: { $first: '$_total' },
            count: { $sum: '$count' },
            date: { $first: '$date' },
            sites: { $first: '$sites' },
            users: { $first: '$users' },
            features: {
              $push: {
                featureID: '$_id.featureID',
                count: '$count',
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
          $sort: ctx.sort,
        },
      ]

      let dbResult = await ctx.col.aggregate(aggregate)
      if (ctx.project) {
        dbResult = dbResult.project(ctx.project)
      }
      const date = await dbResult.toArray()

      ctx.message = 'Query date'
      ctx.body = { query: date, from, to, fromTime, toTime }
    })

  // GET /api/query/users
  router
    .addRoute()
    .path(/users?/)
    .parseLimits()
    .check(async (ctx) => {
      if (!ctx.req.query.userName || !ctx.req.query.siteUrl) {
        ctx.status = 400
        ctx.message = 'Requires query params: userName, siteUrl'
        return false
      }
    })
    .action(async (ctx) => {
      const { siteUrl, userName } = ctx.req.query as Record<string, string>

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
        { $sort: ctx.sort },
      ]

      let dbResult = await ctx.col.aggregate(aggregate)
      if (ctx.req.query.project !== '*') {
        dbResult = dbResult.project(ctx.project)
      }
      const users = await dbResult.toArray()

      ctx.message = 'Query users'
      ctx.body = { query: users }
    })

  // GET /api/query/sites
  router
    .addRoute()
    .path(/(site|wiki)s?/)
    .parseLimits()
    .action(async (ctx) => {
      const siteUrl = req.query.siteUrl as string
      if (!ctx.project && ctx.req.query.project !== '*') {
        ctx.project = getProjectSrotFromStr('siteUrl|siteName|_total')
      }
      if (!ctx.req.query.sort) {
        ctx.sort = getProjectSrotFromStr('!_id')
      }

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
            siteUrl: { $first: '$siteUrl' },
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
        { $sort: ctx.sort },
        { $limit: ctx.limit + 1 },
        { $skip: ctx.offset },
      ]

      // Filter sites
      if (siteUrl) {
        aggregate.unshift({
          $match: { siteUrl },
        })
      }

      if (ctx.project) {
        aggregate.push({
          $project: ctx.project,
        })
      }

      const sites = await ctx.col.aggregate(aggregate).toArray()
      let hasNext = false
      if (sites.length > ctx.limit) {
        hasNext = true
        sites.pop()
      }

      ctx.message = 'Query sites'
      ctx.body = {
        query: sites,
        hasNext,
        limit: ctx.limit,
        offset: ctx.offset,
      }
    })

  // GET /query/site/users
  router
    .addRoute()
    .path(['site', 'wiki'])
    .path('users')
    .parseLimits()
    .check((ctx) => {
      if (!ctx.req.query.siteUrl) {
        ctx.status = 400
        ctx.message = 'Missing siteUrl'
        return false
      } else if (!isValidUrl(ctx.req.query.siteUrl as string)) {
        ctx.status = 400
        ctx.message = 'Invalid siteUrl'
        return false
      }
    })
    .action(async (ctx) => {
      const { siteUrl } = ctx.req.query
      const aggregate: Document[] = [
        {
          $match: { siteUrl },
        },
        {
          $group: {
            _id: {
              userName: '$userName',
              siteUrl: '$siteUrl',
              siteName: '$siteName',
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: {
              userName: '$_id.userName',
            },
            count: { $sum: '$count' },
            userName: { $first: '$_id.userName' },
            siteUrl: { $first: '$_id.siteUrl' },
            siteName: { $first: '$_id.siteName' },
          },
        },
        {
          $project: {
            _id: false,
          },
        },
        { $sort: ctx.sort },
        { $limit: ctx.limit + 1 },
        { $skip: ctx.offset },
      ]
      const users = await ctx.col.aggregate(aggregate).toArray()

      let hasNext = false
      if (users.length > ctx.limit) {
        hasNext = true
        users.pop()
      }

      ctx.body = {
        query: users,
        hasNext,
        offset: ctx.offset,
        limit: ctx.limit,
      }
    })

  return router.init(req, res)
}

function intConvert(str: any) {
  return isNaN(parseInt(str)) ? str : parseInt(str)
}
