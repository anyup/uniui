/**
 * Vuex Store JS工具类
 */
import Vue from 'vue'

class Store {
  constructor(store) {
    if (Store.instance) {
      return Store.instance
    }
    this.store = store || new Vue().$store
    Store.instance = this
    return Store.instance
  }

  commit(method, payload) {
    this.store.commit(method, payload)
  }

  dispatch(method, payload) {
    this.store.dispatch(method, payload)
  }

  get(name) {
    return this.store.getters[`g_${name}`]
  }

  set(name, value, method = 'anyup/commit') {
    this.store.commit(method, { [name]: value })
    return this
  }

  reset() {
    this.set('token', '').set('user', {})
    uni.clearStorageSync()
  }
}

export { Store }
