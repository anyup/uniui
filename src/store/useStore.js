import baseModule from './baseModule'

export default {
  modules(md) {
    return { ...baseModule, ...md }
  },
  getters(md) {
    let getters = []
    const mds = this.modules(md)
    Object.keys(mds).forEach(moduleName => {
      Object.keys(mds[moduleName].state).forEach(stateName => {
        getters[`g_${stateName}`] = state => state[moduleName][stateName]
      })
    })
    return getters
  }
}
