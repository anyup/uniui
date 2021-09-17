/* #ifndef H5 */
import { __APP__CONFIG } from '@/static/config.js'
/* #endif */
/* #ifdef H5 */
__APP__CONFIG = window.__APP__CONFIG
/* #endif */

// 环境变量
const env = __APP__CONFIG.env
// 接口URL
const apiURL = __APP__CONFIG.apiURL
// 图片资源URL
const fileURL = __APP__CONFIG.fileURL
// 白名单
const whiteList = __APP__CONFIG.whiteList

const baseURL = () => {
  if (env.isProd) return apiURL.prod
  return apiURL.dev
}

const baseFileURL = () => {
  if (env.isProd) return fileURL.prod
  return fileURL.dev
}

// 白名单路由校验
const isWhiteList = () => {
  let result = false
  // #ifdef H5
  result = whiteList.some(page => window.location.href.indexOf(page) > -1)
  // #endif
  return result
}

// 获取当前路由路径
const routeURL = () => {
  let result = ''
  // #ifdef H5
  const href = window.location.href
  result = href.slice(href.indexOf('#/') + 1, href.length)
  // #endif
  return encodeURIComponent(result)
}

export { env, baseURL, baseFileURL, isWhiteList, routeURL }
