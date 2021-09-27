/**
 * Vuex Store JS Class vuex模块类
 * @author qiaomingxing
 */

import { deepClone } from '../function/deepClone'
let saveStateKeys = []
let initState = {}

// 保存变量到本地存储中
const saveStorageData = function (key, value) {
  // 判断变量名是否在需要存储的数组中
  if (saveStateKeys.indexOf(key) != -1) {
    try {
      uni.setStorageSync(key, value)
    } catch (error) {
    }
  }
}
class StoreModule {
  constructor(state, saveKeys = []) {
    saveStateKeys = saveKeys
    initState = deepClone(state)
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
        // 保存变量到本地，见顶部函数定义
        saveStorageData(saveKey, state[saveKey])
      },
      reset(state) {
        // 重置vuex变量
        state = deepClone(initState)
        // 清空storage变量
        saveStateKeys.forEach(key => {
          try {
            uni.removeStorageSync(key)
          } catch (error) {
          }
        })
      }
    }
    this.actions = {
      dispatch({ commit }, payload) {
        commit('commit', payload)
      },
      reset({ commit }) {
        commit('reset')
      }
    }
  }
}

export { StoreModule }
