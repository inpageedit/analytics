import { ref } from 'vue'
import { SiteDataType, UserDataType } from '../utils/userData'

export const sideNavShow = ref<boolean>(false)

// Search Cache
export interface SearchCache {
  input: {
    siteBy: 'url' | 'name'
    userBy: 'name'
    siteUrl: string
    siteName: string
    userName: string
  }
  selected: {
    siteUrl: string
    siteName: string
    userName: string
  }
  result: {
    siteList: SiteDataType[]
    userList: UserDataType[]
  }
}
export const searchModalShow = ref(false)
export const searchContext = ref<SearchCache>({
  input: {
    siteBy: 'name',
    userBy: 'name',
    siteUrl: '',
    siteName: '',
    userName: '',
  },
  selected: {
    siteUrl: '',
    siteName: '',
    userName: '',
  },
  result: {
    siteList: [],
    userList: [],
  },
})

// User self data
export const userData = ref<UserDataType[]>()
