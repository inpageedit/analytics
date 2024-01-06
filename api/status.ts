import { VercelRequest, VercelResponse } from '@vercel/node'
import { router } from './utils.js'

export default async (req: VercelRequest, res: VercelResponse) => {
  router.endpoint('/api/status')

  // GET /api/status/db
  router
    .addRoute()
    .path('')
    .action(async (ctx) => {
      const database = await ctx.db.stats()
      const collection = await ctx.col.stats()

      ctx.message = 'MongoDB is OK'
      ctx.body = { status: { database, collection } }
    })

  return router.init(req, res)
}
