import { userData } from '../components/states'

// Types
export interface SiteDataType {
  siteName: string
  siteUrl: string
}
export type UserDataType = SiteDataType & {
  userName: string
}

export function getUserData(): UserDataType[] {
  const local = localStorage.getItem('userData')
  let data: UserDataType[]
  try {
    data = JSON.parse(local as string)
  } catch (err) {
    data = []
  }
  userData.value = data
  return data
}
export function addUserData(ctx: UserDataType): UserDataType[] {
  const data = getUserData()
  if (data.find(({ siteUrl: i }) => i === ctx.siteUrl)) {
    return data
  }
  data.push(ctx)
  userData.value = data
  localStorage.setItem('userData', JSON.stringify(data))
  return data
}
export function removeUserData(ctx: {
  siteUrl: string
  userName: string
}): UserDataType[] {
  const data = getUserData()
  const index = data.findIndex(
    ({ siteUrl: a, userName: b }) => a === ctx.siteUrl && b === ctx.userName
  )
  if (index >= 0) data.splice(index, 1)
  userData.value = data
  localStorage.setItem('userData', JSON.stringify(data))
  return data
}
export function isMySite(ctx: SiteDataType): Boolean {
  const data = getUserData()
  return !!data.find(({ siteUrl: i }) => i === ctx.siteUrl)
}
export function isMyself(ctx: UserDataType): Boolean {
  const data = getUserData()
  return !!data.find(
    ({ siteUrl: a, userName: b }) => a === ctx.siteUrl && b === ctx.userName
  )
}
