/**
 * Vuex Store JS Class vuex模块类
 * @author anyup
 */

import deepMerge from "../function/deepMerge";
import deepClone from "../function/deepClone";

// 保存变量到本地存储中
function saveStorageData(key, value, saveKeys, namespace = "") {
  // 判断变量名是否在需要存储的数组中
  if (saveKeys.indexOf(key) != -1) {
    try {
      uni.setStorageSync(`storage_${namespace}_${key}`, value);
    } catch (error) {}
  }
}
// 递归获取变量
function getObj(key, value) {
  return { [key]: value };
}
// 根据数据类型判断返回默认值 数组[],对象{},其他''
function getDefaultValue(value) {
  if (Array.isArray(value)) {
    return [];
  }
  if (typeof value === "object") {
    return {};
  }
  if (typeof value === "boolean") {
    return false;
  }
  return "";
}
class StoreModule {
  constructor(state, saveKeys = [], namespace = "base") {
    this.namespaced = true;
    this.state = state;
    this.mutations = {
      /**
       *
       * @param {*} state : state
       * @param {*} payload ：{ name: value }
       */
      commit(state, payload) {
        let arr = Object.keys(payload);
        arr.forEach((nameStr) => {
          // 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
          // let nameStr = Object.keys(payload)[0]
          let nameArr = nameStr.split(".");
          let saveKey = "";
          let len = nameArr.length;
          if (len >= 2) {
            let key = nameArr[len - 1];
            let obj = { [key]: payload[nameStr] };
            for (let i = len - 2; i > 0; i--) {
              obj = getObj([nameArr[i]], obj);
            }
            saveKey = nameArr[0];
            state[saveKey] = deepClone(deepMerge(state[saveKey] || {}, obj));
          } else {
            // 单层级变量，在state就是一个普通变量的情况
            saveKey = nameStr;
            state[saveKey] = deepClone(payload[saveKey]);
          }
          // 保存变量到本地，见顶部函数定义
          saveStorageData(saveKey, state[saveKey], saveKeys, namespace);
        });
      },
      reset(state) {
        // 重置vuex变量
        for (let k in state) {
          state[k] = getDefaultValue(state[k]);
        }
        // 清空storage变量
        saveKeys.forEach((key) => {
          try {
            uni.removeStorageSync(`storage_${namespace}_${key}`);
          } catch (error) {}
        });
      }
    };
    this.actions = {
      dispatch({ commit }, payload) {
        commit("commit", payload);
      },
      reset({ commit }) {
        commit("reset");
      }
    };
  }
}

export { StoreModule };
