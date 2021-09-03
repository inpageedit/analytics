export const ENV = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
export const API_BASE =
  ENV === 'dev' ? 'https://analytics-v5.ipe.wjghj.cn/api' : '/api'
export const F_VERSION = '3.0.0-beta.0'

// Copyright
export const GITHUB_OWNER = 'inpageedit'
export const GITHUB_REPO = 'analytics'
export const GITHUB_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`
export const COPY_YEAR = `2019 - ${new Date().getFullYear()}`
