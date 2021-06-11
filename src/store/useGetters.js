export default {
  use(modules) {
    let getters = []
    Object.keys(modules).forEach(moduleName => {
      Object.keys(modules[moduleName].state).forEach(stateName => {
        getters[`g_${stateName}`] = state => state[moduleName][stateName]
      })
    })
    return getters
  }
}
