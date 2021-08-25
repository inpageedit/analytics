import { VercelRequest, VercelResponse } from '@vercel/node'
import { HandleResponse } from './util'
import { name, version, author, license } from '../package.json'

export default async (req: VercelRequest, res: VercelResponse) => {
  const http = new HandleResponse(req, res)
  http.send(200, 'ok', {
    about: { name, version, author, license },
    server: {
      backend: 'Vercel, serverless Node.js API',
      datacenter: 'MongoDB Atlas, AWS / Oregon (us-west-2)',
    },
    endpoints: [
      {
        name: 'query_date',
        path: '/api/query/date',
        method: 'GET',
      },
      {
        name: 'query_wiki',
        path: '/api/query/wiki',
        method: 'GET',
      },
      {
        name: 'query_user',
        path: '/api/query/user',
        method: 'GET',
      },
      {
        name: 'submit',
        path: '/api/submit',
        method: 'POST',
      },
    ],
  })
}
