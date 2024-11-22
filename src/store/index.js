import Vue from 'vue'
import Vuex from 'vuex'
import { useStore, StoreModule, Store } from 'colorful-uni'

Vue.use(Vuex)

const store = new Store()

/**
 * @demo new StoreModule(state, keys, namespace)
 * @param {*} state 初始状态，例如：{ userinfo: store.getStorage('userinfo', {}, 'user'), token: '' }
 * @param {*} keys 为需要持久化存储的字段，例如：['userinfo', 'token']
 * @param {*} namespace 命名空间，例如：'user'
 */
const modules = {
  user: new StoreModule(
    {
      userinfo: store.getStorage('userinfo', {}, 'user'),
      token: store.getStorage('token', '', 'user')
    }, // 初始状态
    ['userinfo', 'token'], // 为需要持久化存储的字段
    'user' // 命名空间
  )
}

export default new Vuex.Store({
  modules: useStore.modules(modules),
  getters: useStore.getters(modules)
})
