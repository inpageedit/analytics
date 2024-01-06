import { VercelRequest, VercelResponse } from '@vercel/node'
import { router } from './utils.js'
import { name, version, author, license } from '../package.json'

export default async (req: VercelRequest, res: VercelResponse) => {
  router.endpoint('/api')

  // GET /
  router
    .addRoute()
    .path('')
    .action((ctx) => {
      ctx.body = {
        name,
        version,
        author,
        license,
        server: {
          backend: 'Vercel, serverless Node.js API',
          datacenter: 'MongoDB Atlas, AWS / Oregon (us-west-2)',
        },
      }
    })

  return router.init(req, res)
}
