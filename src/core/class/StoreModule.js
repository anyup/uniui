/**
 * Vuex Store JS Class
 */
class StoreModule {
  constructor(state) {
    this.namespaced = true
    this.state = state
    this.mutations = {
      commit(state, payload) {
        // 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
        let nameStr = Object.keys(payload)[0]
        let nameArr = nameStr.split('.')
        let saveKey = ''
        let len = nameArr.length
        if (len >= 2) {
          let obj = state[nameArr[0]]
          for (let i = 1; i < len - 1; i++) {
            obj = obj[nameArr[i]]
          }
          obj[nameArr[len - 1]] = payload[nameStr]
          saveKey = nameArr[0]
        } else {
          // 单层级变量，在state就是一个普通变量的情况
          state[nameStr] = payload[nameStr]
          saveKey = nameStr
        }
      }
    }
    this.actions = {
      dispatch({ commit }, payload) {
        commit('commit', payload)
      }
    }
  }
}

export { StoreModule }
