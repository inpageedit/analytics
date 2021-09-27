import { VercelRequest, VercelResponse } from '@vercel/node'
import { Collection, Document } from 'mongodb'
import {
  colName,
  dbClient,
  dbName,
  getProjectSrotFromStr,
  HandleResponse,
  isValidUrl,
} from './util'

export default async (req: VercelRequest, res: VercelResponse) => {
  const http = new HandleResponse(req, res)
  const { type } = req.query

  switch (type) {
    case 'user.fuzzy':
      searchUserFuzzy({ userName: req.query.userName as string })
      break
    case 'user.withsite':
      searchUserWithSite({
        userName: req.query.userName as string,
        siteUrl: req.query.siteUrl as string,
      })
      break
    case 'site.name':
      searchSiteByName({ siteName: req.query.siteName as string })
      break
    case 'site.url':
      searchSiteByUrl({ siteUrl: req.query.siteUrl as string })
      break
    default:
      return http.send(
        400,
        `invalid search type: ${type}`,
        {},
        { validTypes: ['user.fuzzy', 'user.withsite', 'site.name', 'site.url'] }
      )
  }

  async function searchUserFuzzy({ userName }: Record<string, string>) {
    if (!userName) {
      return http.send(400, 'missing params')
    }

    const { client, col } = await dbClient(req.query.devMode)
    let result = []
    try {
      await client.connect()
      result = await aggregateUser(col, {
        userName: new RegExp(userName, 'ig'),
      })
      await client.close()
    } catch (err) {
      return http.mongoError(err)
    }
    return http.send(200, 'ok', result)
  }

  async function searchUserWithSite({
    userName,
    siteUrl,
  }: Record<string, string>) {
    if (!userName || !siteUrl) {
      return http.send(400, 'missing params')
    }

    const { client, col } = await dbClient(req.query.devMode)
    let result = []
    try {
      await client.connect()
      result = await aggregateUser(col, {
        userName: new RegExp(userName, 'ig'),
        siteUrl,
      })
      await client.close()
    } catch (err) {
      return http.mongoError(err)
    }
    return http.send(200, 'ok', result)
  }

  async function searchSiteByName({ siteName }: Record<string, string>) {
    if (!siteName) {
      return http.send(400, 'missing params')
    }

    const { client, col } = await dbClient(req.query.devMode)
    let result
    try {
      await client.connect()
      result = await aggregateSite(col, {
        siteName: new RegExp(siteName, 'ig'),
      })
      await client.close()
    } catch (err) {
      return http.mongoError(err)
    }
    return http.send(200, 'ok', result)
  }

  async function searchSiteByUrl({ siteUrl }: Record<string, string>) {
    if (!siteUrl) {
      return http.send(400, 'missing params')
    }

    const { client, col } = await dbClient(req.query.devMode)
    let result
    try {
      await client.connect()
      result = await aggregateSite(col, {
        siteUrl: new RegExp(siteUrl, 'ig'),
      })
      await client.close()
    } catch (err) {
      return http.mongoError(err)
    }
    return http.send(200, 'ok', result)
  }
}

async function aggregateUser(col: Collection<Document>, $match: any) {
  return (
    await col
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
}

async function aggregateSite(col: Collection<Document>, $match: any) {
  return (
    await col
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
          },
        },
      ])
      .toArray()
  ).map(({ _id }) => _id)
}
