import Vue from 'vue'
import App from './App'
import store from './store'
import api from '@/api'
import utils from '@/common/utils'
import { env } from '@/config'
import wxapi from '@/common/wxapi'
import filters from './filters'

import uView from 'uview-ui'
Vue.use(uView)

import uniUI, { Tips } from '@/uni_modules/colorful-uni'
Vue.use(uniUI, { store })

// 将过滤器注册到全局使用
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$api = api
Vue.prototype.$utils = utils
Vue.prototype.$env = env
Vue.prototype.$wxapi = wxapi
Vue.prototype.$tips = new Tips(store)

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
