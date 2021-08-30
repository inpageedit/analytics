export const ENV = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
export const API_BASE =
  ENV === 'dev' ? 'https://analytics-v5.ipe.wjghj.cn/api' : '/api'
