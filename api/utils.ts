import { VercelRequest, VercelResponse } from '@vercel/node'
import process from 'process'
import { Collection, Db, MongoClient } from 'mongodb'
import { HandleRouter, Route, getProjectSrotFromStr } from 'serverless-kit'

// Type gymnastics
declare module '../node_modules/serverless-kit/lib/modules/HandleRouter' {
  interface Route<ContextT extends unknown = RouteContextDefaults> {
    parseLimits: () => Route<
      RouteContextDefaults &
        ContextT & {
          offset: number
          limit: number
          project: Record<string, -1 | 1> | null
          sort: Record<string, -1 | 1>
        }
    >
  }
}

// Constants
export const ENV = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
export const DB_NAME = 'inpageedit'
export const COL_NAME = 'analytics_v5'
export const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
export const QUERY_LIMIT = 100

// Methods
Route.prototype.parseLimits = function () {
  return this.check((ctx) => {
    ctx.offset = parseInt((ctx.req.query.offset as string) || '0')
    if (['max', 'infinity'].includes(ctx.req.query.limit)) {
      ctx.req.query.limit = Infinity
    }
    ctx.limit = Math.min(
      QUERY_LIMIT,
      parseInt((ctx.req.query.limit as string) || '10')
    )
    ctx.sort = getProjectSrotFromStr((ctx.req.query.sort as string) || '!_id')

    ctx.project = null
    ctx.req.query.project = ctx.req.query.project || ctx.req.query.prop || ''
    if (ctx.req.query.project && ctx.req.query.project !== '*') {
      ctx.project = getProjectSrotFromStr(ctx.req.query.project as string)
    }
  })
}

// Constuct a router
const router = new HandleRouter<{
  mongo: MongoClient
  db: Db
  col: Collection
}>()
// Make sure the body exists
router.beforeEach((ctx) => {
  ctx.body = ctx.body || {}
  ctx.customBody = ctx.customBody || {}
  ctx.req.body = ctx.req.body || {}
})
// Connect db
router.beforeEach(async (ctx) => {
  const client = new MongoClient(DB_URI)
  const db = client.db(DB_NAME)
  const col = db.collection(
    `${COL_NAME}${ctx.req.query.devMode || ENV === 'dev' ? '_dev' : ''}`
  )
  try {
    await client.connect()
  } catch (e) {
    ctx.status = 501
    ctx.message =
      'Unable to connect to the database or the MONGO_URI is incorrectly configured.'
    return false
  }
  console.log('DB connected')
  ctx.mongo = client
  ctx.db = db
  ctx.col = col
})
// Close db
router.afterEach(async (ctx) => {
  await ctx.mongo.close()
  console.log('DB closed')
})
export { router }
export default router.init

export function isValidUrl(url: string): boolean {
  return url.startsWith('http') || url.startsWith('//')
}

export function isValidPageName(name: string): boolean {
  if (!name) return false
  return /^[\s%!\"$&'()*,\-.\/0-9@:;=?A-Z\^_`a-z~\u0080-\uFFFF]+$/gi.test(name)
}

export function isValidUserName(name: string): boolean {
  if (!name) return false
  name = name.replace(/_+/g, '_').trim()
  return isValidPageName(name) && !/[@:]/g.test(name)
}

export function isValidFeature(id: string) {
  const whiteList = [
    'find_replace',
    'plugin_setting',
    'preview_edit',
    'quick_diff',
    'quick_diff_edit',
    'quick_diff_history_page',
    'quick_diff_modalclick',
    'quick_diff_recentchanges',
    'quick_edit',
    'quick_edit_pagedetail',
    'quick_edit_pagedetail_edit_template',
    'quick_edit_pagedetail_view_image',
    'quick_edit_save',
    'quick_move',
    'quick_redirect',
    'tool_box',
  ]
  return whiteList.includes(id)
}
