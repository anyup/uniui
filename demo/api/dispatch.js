import { Http, Tips, Store, Optimize } from '@anyup/uniui'
import { baseURL, routeURL, isWhiteList } from '@/config'

const header = {}

class Dispatch {
  constructor(urls) {
    this.http = new Http().setBaseURL(baseURL()).setHeader(header)
    this.urls = urls
    this.setInterceptor()
    this.optimize = new Optimize.Builder(2000)
  }

  // 请求拦截器
  setInterceptor() {
    // 请求前
    this.http.interceptors.request.use(
      request => {
        if (request.loading) new Tips().loading()
        if (new Store().get('token')) {
          request.header['X-Access-Token'] = new Store().get('token')
        }
        return request
      },
      error => Promise.resolve(error)
    )
    // 请求后
    this.http.interceptors.response.use(
      response => {
        if (response.request.loading) new Tips().loaded()
        if (!response.data) {
          return Promise.reject(new Error('接口请求未知错误'))
        }
        if (response.data.retCode !== '0000' && response.request.toast) {
          new Tips().toast(response.data.message || response.data.retMsg || '接口请求未知错误', 'fail')
        }
        return Promise.resolve(response)
      },
      error => {
        if (error.request.loading) new Tips().loaded()
        const { statusCode } = error
        if (error.data && error.data.message === '0008') {
          // token 失效
          new Tips().toast('用户登录信息失效，请重新登录！', 'info')
          this.optimize.debounce(() => {
            new Store().reset()
            uni.reLaunch({ url: '/pages/login/login?redirect=' + routeURL() })
          })
        }
        const messages = {
          404: '404,错误请求',
          401: '未授权',
          403: '禁止访问',
          408: '请求超时',
          500: '服务器内部错误',
          501: '功能未实现',
          502: '服务不可用',
          503: '服务不可用',
          504: '网关错误',
          510: '服务器内部错误'
        }
        let statusMessage = messages[~~statusCode]
        return Promise.reject(statusMessage ? new Error(statusMessage) : error)
      }
    )
  }

  register() {
    const modules = { urls: this.urls }
    // 自动注入函数
    Object.keys(this.urls).forEach(key => {
      modules[key] = this.use.bind(this, this.urls[key])
    })
    return modules
  }

  use(_url, data, config = {}) {
    // 如果不在白名单 且 未登录状态下，不要请求接口
    /* #ifdef H5 */
    if (!isWhiteList() && !new Store().get('token')) {
      return new Promise(() => {})
    }
    /* #endif */
    let url = config.url || _url.url
    return this.http.request(url, data, { ..._url, ...config })
  }
}

export default Dispatch
