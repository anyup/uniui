import { Http, Tips, Store, Optimize } from '@/uni_modules/anyup-uniui'
import { baseURL, routeURL, isWhiteList } from '@/config'

const header = {}
const http = new Http().setBaseURL(baseURL()).setHeader(header)
const optimize = new Optimize.Builder(2000)

// 请求前
http.interceptors.request.use(
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
http.interceptors.response.use(
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
			optimize.debounce(() => {
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
	},
	complete => {
		console.log('complete：', complete)
	}
)

export default new Http.Builder(http);
