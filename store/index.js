import Vue from 'vue'
import Vuex from 'vuex'
import { useStore, StoreModule, Store } from '@/uniui/index'

Vue.use(Vuex)

const store = new Store()

const modules = {
  user: new StoreModule(
    { userinfo: store.getStorage('userinfo', {}), nickname: '' },
    ['userinfo']),
}

export default new Vuex.Store({
  modules: useStore.modules(modules),
  getters: useStore.getters(modules)
})
