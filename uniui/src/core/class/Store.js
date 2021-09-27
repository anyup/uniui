/**
 * Vuex Store JS 操作工具类
 * @author qiaomingxing
 */
import Vue from 'vue'

class Store {
  constructor(store) {
    if (Store.instance && this.store) {
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

  reset(namespace) {
    this.store.commit(`${namespace}/reset`)
  }

  getStorage(key, defaultValue) {
    try {
      return uni.getStorageSync(`anyup_${key}`) || defaultValue
    } catch (error) {
    }
  }
  
  removeStorage(key) {
    try {
      return uni.removeStorageSync(`anyup_${key}`)
    } catch (error) {
    }
  }

  clearStorage() {
    try {
      uni.clearStorageSync()
    } catch (error) {
    }
  }
}

export { Store }
