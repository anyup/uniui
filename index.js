import Mixin from './src/mixin/mixin.js'
import baseModule from './src/store/baseModule.js'
import useGetters from './src/store/useGetters'

import checker from './src/core/checker'
import Http from './src/core/http'
import Push from './src/core/push'
import Tips from './src/core/tips/index'

// util
import $parent from './src/core/util/$parent'
import debounce from './src/core/util/debounce'
import deepClone from './src/core/util/deepClone'
import deepMerge from './src/core/util/deepMerge'
import guid from './src/core/util/guid'
import random from './src/core/util/random'
import throttle from './src/core/util/throttle'
import trim from './src/core/util/trim'
import timeFormat from './src/core/util/timeFormat'
import timeFrom from './src/core/util/timeFrom'

const $au = {
  $parent,
  debounce,
  deepClone,
  deepMerge,
  guid,
  random,
  throttle,
  trim,
  timeFormat,
  timeFrom
}

const install = Vue => {
  // 时间格式化，同时两个名称，date和timeFormat
  Vue.filter('timeFormat', (timestamp, format) => {
    return timeFormat(timestamp, format)
  })
  Vue.filter('date', (timestamp, format) => {
    return timeFormat(timestamp, format)
  })
  // 将多久以前的方法，注入到全局过滤器
  Vue.filter('timeFrom', (timestamp, format) => {
    return timeFrom(timestamp, format)
  })
  // 获取设备信息，挂载到$au的sys(system的缩写)属性中，
  // 同时把安卓和ios平台的名称"ios"和"android"挂到$au.os中，方便取用
  $au.sys = uni.getSystemInfoSync()
  $au.os = $au.sys.platform
  Vue.prototype.$au = $au
}

export { Http, Push, Mixin, Tips, checker, baseModule, useGetters }

export default { install }
