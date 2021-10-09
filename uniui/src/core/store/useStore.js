import { StoreModule } from "../class/StoreModule"
import { Store } from "../class/Store"

const store = new Store()

const state = {
  user: store.getStorage('user', {}),
  token: store.getStorage('token', ''),
  bundle: {}, // 页面携带信息
  loading: false, // 页面加载
  toast: {} // 弹窗
}

const baseModule = {
  anyup: new StoreModule(state, ['user', 'token'])
}

export default {
  modules(module = {}) {
    return { ...baseModule, ...module }
  },
  getters(module = {}) {
    let getters = []
    const modules = this.modules(module)
    Object.keys(modules).forEach(moduleName => {
      Object.keys(modules[moduleName].state).forEach(stateName => {
        getters[`g_${stateName}`] = state => state[moduleName][stateName]
      })
    })
    return getters
  }
}
