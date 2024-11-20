import http from '../http'

const urls = {
  userLogin: { url: '/api/user/login', method: 'POST', loading: true, toast: true, noToken: true } // 用户登陆，测试
}

export default http.dispatch(urls)
