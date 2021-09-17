import baseModule from './baseModule'

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
