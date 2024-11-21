import { Http, Optimize, _u } from '@anyup/uniui'
import env from '@/config/env'

// 请求标头
const header = { 'Content-Type': 'application/x-www-form-urlencoded' }
// Http 实例化
const http = new Http().setBaseURL(env.baseURL).setHeader(header)
// 优化类
const optimize = new Optimize.Builder(2000)

// 请求前
http.interceptors.request.use(
  request => {
    // 设置请求header
    if (!request.noToken && _u.store.get('token')) {
      request.header['Authorization'] = `Bearer ${_u.store.get('token')}`
    } else if (!request.noToken && !_u.store.get('token')) {
      // 如果用户未登录，拦截并返回，不请求接口
      return Promise.reject()
    }
    // 如果配置了loading，显示
    if (request.loading) {
      _u.tips.loading('加载中...')
    }
    return request
  },
  error => Promise.reject(error)
)
// 请求后
http.interceptors.response.use(
  response => {
    // 请求成功
    if (!response.data) {
      _u.tips.fail('接口请求未知错误')
      return Promise.reject(new Error('unknown error'))
    }
    // 其他业务处理
    const { status, msg } = response.data
    // 如果是token失效，清除本地缓存，跳转到登录页
    if (status == '-99') {
      // 同步请求多个接口时，如果当多个接口返回token失效，应考虑优化
      optimize.throttle(() => {
        _u.tips.fail(msg)
        optimize.debounce(() => {
          // 如果有其他模块，也一并清除
          _u.store.reset(['base'])
          //  跳转到登录页
          uni.reLaunch({ url: '/pages/user/login' })
        })
      })
    }
    return Promise.resolve(response)
  },
  error => {
    const { request, errMsg, data } = error
    if (request.toast) {
      if (errMsg && errMsg.indexOf('request:fail') >= 0) {
        _u.tips.fail('网络连接错误')
      } else if (data && data.message) {
        _u.tips.fail(data.message)
      } else {
        _u.tips.fail('服务器错误')
      }
    }
    return Promise.reject(error)
  },
  complete => {
    // 请求完成
    if (complete.request.loading) {
      // 如果配置了loading，关闭
      _u.tips.loaded()
    }
  }
)

export default new Http.Builder(http)
