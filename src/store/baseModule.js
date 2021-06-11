let storageData = {}

try {
  // 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
  storageData = uni.getStorageSync('anyup_data')
} catch (e) {}

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = ['user', 'token']

// 保存变量到本地存储中
const saveStorageData = function (key, value) {
  // 判断变量名是否在需要存储的数组中
  if (saveStateKeys.indexOf(key) != -1) {
    // 获取本地存储的lifeData对象，将变量添加到对象中
    let tmp = uni.getStorageSync('anyup_data')
    // 第一次打开APP，不存在lifeData变量，故放一个{}空对象
    tmp = tmp ? tmp : {}
    tmp[key] = value
    // 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
    uni.setStorageSync('anyup_data', tmp)
  }
}

const anyup = {
  namespaced: true,
  state: {
    user: storageData.user ? storageData.user : {},
    token: storageData.token ? storageData.token : '',
    result: {}, // 页面返回信息
    bundle: '', // 页面携带信息
    loading: false, // 页面加载
    toast: {}, // 弹窗
    checkedUpdate: false, // App检测更新标记,false:未检测,true:已检测
    forceUpdate: false // App强制检测更新,false:不强制更新,true:强制更新
  },
  mutations: {
    $commit(state, payload) {
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
    }
  }
}

export default {
  anyup
}
