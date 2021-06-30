// class
import { Http } from './src/core/class/http'
import { Push } from './src/core/class/push'
import { Mixin } from './src/core/class/mixin'
import { Tips } from './src/core/class/tips'
import { Store } from './src/core/class/store'

import useStore from './src/store/useStore'
import checker from './src/core/checker/checker'

// function
import $parent from './src/core/function/$parent'
import debounce from './src/core/function/debounce'
import deepClone from './src/core/function/deepClone'
import deepMerge from './src/core/function/deepMerge'
import groupBy from './src/core/function/groupBy'
import guid from './src/core/function/guid'
import pagination from './src/core/function/pagination'
import queryParams from './src/core/function/queryParams'
import random from './src/core/function/random'
import route from './src/core/function/route'
import { sys, os } from './src/core/function/sys'
import throttle from './src/core/function/throttle'
import timeFormat from './src/core/function/timeFormat'
import timeFrom from './src/core/function/timeFrom'
import trim from './src/core/function/trim'

const _u = {
  $parent,
  debounce,
  deepClone,
  deepMerge,
  groupBy,
  guid,
  pagination,
  queryParams,
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
  Vue.prototype.$_u = _u
  if (Vue.prototype.$store) {
    Vue.mixin(new Mixin(Vue.prototype.$store).init())
    Vue.prototype.$tips = new Tips(Vue.prototype.$store)
    Vue.prototype.$_u.store = new Store(Vue.prototype.$store)
  }
}

export { Http, Push, Mixin, Tips, Store, checker, useStore, _u }

export default { install }
