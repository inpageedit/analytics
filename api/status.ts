import { VercelRequest, VercelResponse } from '@vercel/node'
import { router } from './utils'

export default async (req: VercelRequest, res: VercelResponse) => {
  router.endpoint('/api/status')

  // GET /api/status/db
  router
    .addRoute()
    .path(['database', 'db', 'mongodb', 'mongo'])
    .action(async (ctx) => {
      const database = await ctx.db.stats()
      const collection = await ctx.col.stats()

      ctx.message = 'MongoDB is OK'
      ctx.body = { database, collection }
    })

  return router.init(req, res)
}
