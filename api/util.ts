import { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * @module database
 */
import { MongoClient } from 'mongodb'
export const dbName = 'inpageedit'
export const colName =
  process.env.NODE_ENV === 'development' ? 'analytics_v5_dev' : 'analytics_v5'
export const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017'

export async function dbClient() {
  return new MongoClient(dbUri, {})
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
  startTime: number

  constructor(req: VercelRequest, res: VercelResponse) {
    this.req = req
    this.res = res
    this.startTime = Date.now()
  }

  send(code: number, message: string, body = {} as any, custom?: any) {
    return this.res
      .status(code)
      .send({
        code,
        message,
        ping: { start: this.startTime, end: Date.now() },
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

export function isValidFunction(id: string) {
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
