
import http from '../http'

const urls = {
	login: { url: '/user/login', method: 'POST', loading: true, toast: true }, // 用户-登录
}

export default http.dispatch(urls);

