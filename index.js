import Mixin from './src/mixin/mixin.js'
import useStore from './src/store/useStore'

import checker from './src/core/checker'
import Http from './src/core/http'
import Push from './src/core/push'
import Tips from './src/core/tips/index'

// util
import $parent from './src/core/util/$parent'
import debounce from './src/core/util/debounce'
import deepClone from './src/core/util/deepClone'
import deepMerge from './src/core/util/deepMerge'
import groupBy from './src/core/util/groupBy'
import guid from './src/core/util/guid'
import pagination from './src/core/util/pagination'
import random from './src/core/util/random'
import route from './src/core/util/route'
import { sys, os } from './src/core/util/sys'
import throttle from './src/core/util/throttle'
import timeFormat from './src/core/util/timeFormat'
import timeFrom from './src/core/util/timeFrom'
import trim from './src/core/util/trim'

const $au = {
  $parent,
  debounce,
  deepClone,
  deepMerge,
  groupBy,
  guid,
  pagination,
  random,
  route,
  sys,
  os,
  throttle,
  timeFormat,
  timeFrom,
  trim
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
  Vue.prototype.$au = $au
}

export { Http, Push, Mixin, Tips, checker, useStore }

export default { install }
