import { StoreModule } from "../class/StoreModule";
import { Store } from "../class/Store";

const store = new Store();

const state = {
  user: store.getStorage("user", {}, "base"),
  token: store.getStorage("token", "", "base"),
  bundle: {}, // 页面携带信息
  loading: {}, // 页面加载loading
  toast: {}, // 弹窗toast
  dev: {
    open: false,
    logs: []
  }
};

const baseModule = {
  base: new StoreModule(state, ["user", "token"], "base")
};

export default {
  modules(module = {}) {
    return { ...baseModule, ...module };
  },
  getters(module = {}) {
    let getters = [];
    const modules = this.modules(module);
    Object.keys(modules).forEach((moduleName) => {
      // 将单个模块命名空间整体生成getter
      getters[`getter_${moduleName}`] = (state) => state[moduleName];
      // 将单个模块内的属性生成getter
      Object.keys(modules[moduleName].state).forEach((stateName) => {
        getters[`getter_${moduleName}_${stateName}`] = (state) =>
          state[moduleName][stateName];
      });
    });
    return getters;
  }
};
