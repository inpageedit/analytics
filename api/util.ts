import { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * @module database
 */
import { MongoClient } from 'mongodb'
export const dbName = 'inpageedit'
export const colName = 'analytics_v5'
export const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017'

export async function dbClient(devMode?: any) {
  const client = new MongoClient(dbUri, {})
  const db = client.db(dbName)
  const col = db.collection(
    process.env.NODE_ENV === 'development' || devMode
      ? 'analytics_v5_dev'
      : 'analytics_v5'
  )
  const dbConnect = () => client.connect()
  const dbClose = () => client.close()
  return { client, db, col, dbConnect, dbClose }
}

export function getProjectSrotFromStr(str = ''): Record<string, 1 | -1> {
  const project = {}
  str.split('|').forEach((i) => {
    const name = i.replace(/^!/, '')
    if (!name) return
    project[name] = i.startsWith('!') ? -1 : 1
  })
  return project
}

/**
 * @module HandleResponse
 */
export class HandleResponse {
  req: VercelRequest
  res: VercelResponse
  _start: number
  _env: 'prod' | 'dev'
  _debug: boolean

  constructor(req: VercelRequest, res: VercelResponse) {
    this.req = req
    this.res = res
    this._start = Date.now()
    this._debug = this.req.query.debug ? true : false
    this._env =
      process.env.NODE_ENV === 'development' || this.req.query.devMode
        ? 'dev'
        : 'prod'
  }

  send(code: number, message: string, body = {} as any, custom?: any) {
    return this.res.status(code).send({
      code,
      message,
      devMode: this._env === 'dev' ? true : undefined,
      ping: this._debug ? { start: this._start, end: Date.now() } : undefined,
      body,
      ...custom,
    })
  }

  axiosError(e: any) {
    console.error('[SERVER]', 'Axios Error', e)
    return this.send(
      e?.response?.status || 500,
      `Internal network error: ${e.message}`,
      {},
      { error: e?.response?.data || e }
    )
  }

  mongoError(e: any) {
    console.error('[SERVER]', 'Mongo Error', e)
    return this.send(
      500,
      `Internal database error: ${e.message}`,
      {},
      { error: e }
    )
  }
}

export function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol.startsWith('http')
  } catch (e) {
    return false
  }
}

export function isValidPageName(name: string): boolean {
  return /^[\s%!\"$&'()*,\-.\/0-9@:;=?A-Z\^_`a-z~\u0080-\uFFFF]+$/gi.test(name)
}

export function isValidUserName(name: string): boolean {
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

export default async (req: VercelRequest, res: VercelResponse) => {
  const http = new HandleResponse(req, res)
  http.send(403, 'Forbidden entry')
}
