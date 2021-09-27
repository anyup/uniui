import { StoreModule, Store } from "../../index"
const store = new Store()

const state = {
  user: store.getStorage('user', {}),
  token: store.getStorage('token', ''),
  bundle: {}, // 页面携带信息
  loading: false, // 页面加载
  toast: {} // 弹窗
}

export default {
  anyup: new StoreModule(state, ['user', 'token'])
}
