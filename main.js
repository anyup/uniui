import Vue from 'vue'
import App from './App'
import store from './store'
import api from '@/api'

import uView from 'uview-ui'
Vue.use(uView)

import uniUI from '@anyup/uniui'

Vue.use(uniUI, { store })

Vue.prototype.$store = store
Vue.prototype.$api = api

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
