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

  set(name, value, namespace = 'anyup') {
    this.store.commit(`${namespace}/commit`, { [name]: value })
    return this
  }

  reset(namespaces = 'anyup') {
    if (Array.isArray(namespaces)) {
      namespaces.forEach(namespace => {
        this.store.commit(`${namespace}/reset`)
      })
    }
    if (typeof namespaces === 'string') {
      this.store.commit(`${namespaces}/reset`)
    }
    return this
  }

  getStorage(key, defaultValue) {
    try {
      return uni.getStorageSync(`anyup_${key}`) || defaultValue
    } catch (error) {}
  }

  removeStorage(key) {
    try {
      uni.removeStorageSync(`anyup_${key}`)
    } catch (error) {}
    return this
  }

  clearStorage() {
    try {
      uni.clearStorageSync()
    } catch (error) {}
    return this
  }

  setDev(logs, open = true) {
    const olds = this.get('dev').logs || []
    this.set('dev', { open, logs: Array.isArray(logs) ? [...olds, ...logs] : [...olds, ...[logs]] })
    return this
  }

  closeDev() {
    this.set('dev', { open: false, logs: [] })
    return this
  }
}

export { Store }
