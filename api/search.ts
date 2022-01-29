import { VercelRequest, VercelResponse } from '@vercel/node'
import { getProjectSrotFromStr } from 'serverless-kit'
import { isValidUserName, router } from './utils'
import { isValidUrl } from './utils'

export default async (req: VercelRequest, res: VercelResponse) => {
  router.endpoint('/api/search')

  // GET /search/users
  router
    .addRoute()
    .path(['user', 'users'])
    // Check if userName is valid
    .check((ctx) => {
      if (!isValidUserName(ctx.req.query.userName as string)) {
        ctx.status = 400
        ctx.message = 'Invalid user name'
        return false
      }
    })
    // Check if siteUrl is valid
    .check((ctx) => {
      if (
        ctx.req.query.siteUrl &&
        !isValidUrl(ctx.req.query.siteUrl as string)
      ) {
        ctx.status = 400
        ctx.message = 'Invalid site url'
        return false
      }
    })
    .action(async (ctx) => {
      const userName = ctx.req.query.userName as string
      const siteUrl = ctx.req.query.siteUrl as string
      ctx.message = 'Fuzzy search users'

      const $match: Record<string, any> = {
        userName: new RegExp(userName, 'ig'),
      }
      if (siteUrl) {
        ctx.message = 'Search users in specific site'
        $match.siteUrl = siteUrl
      }

      const users = (
        await ctx.col
          .aggregate([
            {
              $match,
            },
            {
              $group: {
                _id: {
                  siteUrl: '$siteUrl',
                  siteName: '$siteName',
                  userName: '$userName',
                },
              },
            },
          ])
          .toArray()
      ).map(({ _id }) => _id)

      ctx.body = { search: users, $match: { userName, siteUrl } }
    })

  // GET /search/sites
  router
    .addRoute()
    .path(['site', 'sites', 'wiki', 'wikis'])
    // Generate message
    .check((ctx) => {
      if (ctx.req.query.siteUrl && ctx.req.query.siteName) {
        ctx.message = 'Search sites by url and name'
      } else if (ctx.req.query.siteUrl) {
        ctx.message = 'Search sites by url'
      } else if (ctx.req.query.siteName) {
        ctx.message = 'Search sites by name'
      } else {
        ctx.status = 400
        ctx.message = 'Missing params'
        return false
      }
    })
    .parseLimits()
    .action(async (ctx) => {
      const siteUrl = ctx.req.query.siteUrl as string
      const siteName = ctx.req.query.siteName as string

      const $match: Record<string, any> = {}
      if (siteUrl) {
        $match.siteUrl = new RegExp(siteUrl, 'ig')
      }
      if (siteName) {
        $match.siteName = new RegExp(siteName, 'ig')
      }

      const sites = await ctx.col
        .aggregate([
          {
            $match,
          },
          {
            $group: {
              _id: {
                siteUrl: '$siteUrl',
                siteName: '$siteName',
              },
              _total: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: {
                siteUrl: '$_id.siteUrl',
              },
              _total: { $sum: '$_total' },
              siteUrl: { $first: '$_id.siteUrl' },
              siteName: { $first: '$_id.siteName' },
            },
          },
          {
            $project: { _id: false },
          },
        ])
        .sort(ctx.sort)
        .project(
          ctx.project || getProjectSrotFromStr('_total|siteUrl|siteName')
        )
        .toArray()

      ctx.body = { search: sites, $match: { siteUrl, siteName } }
    })

  return router.init(req, res)
}
