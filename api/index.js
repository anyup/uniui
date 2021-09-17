import Dispatch from './dispatch'

const urls = {
  // 用户
  login: { url: '/UserLogin.json', method: 'POST', loading: true, toast: true }, // 用户-登录
}

// 模块导出
export default new Dispatch(urls).register()
