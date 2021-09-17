// class
import { Bluetooth } from './src/core/class/Bluetooth'
import { HttpHeader, Http } from './src/core/class/Http'
import { Mixin } from './src/core/class/Mixin'
import { Optimize } from './src/core/class/Optimize'
import { Pager } from './src/core/class/Pager'
import { Plus } from './src/core/class/Plus'
import { Push } from './src/core/class/Push'
import { Store } from './src/core/class/Store'
import { StoreModule } from './src/core/class/StoreModule'
import { Tips } from './src/core/class/Tips'

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
import sleep from './src/core/function/sleep'
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
  sleep,
  sys,
  os,
  throttle,
  timeFormat,
  timeFrom,
  trim,
  plus: new Plus()
}

const install = Vue => {
  Vue.prototype.$_u = _u
  if (Vue.prototype.$store) {
    Vue.mixin(new Mixin(Vue.prototype.$store).init())
    Vue.prototype.$tips = new Tips(Vue.prototype.$store)
    Vue.prototype.$_u.store = new Store(Vue.prototype.$store)
  }
}

export { Bluetooth, HttpHeader, Http, Mixin, Optimize, Pager, Plus, Push, Store, StoreModule, Tips, checker, useStore, _u }

export default { install }
