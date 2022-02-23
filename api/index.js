// import Dispatch from './dispatch'
import http from './http'

const urls = {
  // 用户
  login: { url: '/UserLogin.json', method: 'POST', loading: true, toast: true }, // 用户-登录
}

export default http.dispatch(urls);

// 模块导出
// export default new Dispatch(urls).register()
