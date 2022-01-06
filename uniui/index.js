// class
import { Bluetooth } from './libs/core/class/Bluetooth'
import { HttpHeader, Http } from './libs/core/class/Http'
import { Mixin } from './libs/core/class/Mixin'
import { Optimize } from './libs/core/class/Optimize'
import { Pager } from './libs/core/class/Pager'
import { Plus } from './libs/core/class/Plus'
import { Push } from './libs/core/class/Push'
import { Store } from './libs/core/class/Store'
import { StoreModule } from './libs/core/class/StoreModule'
import { Tips } from './libs/core/class/Tips'

import useStore from './libs/core/store/useStore'
import checker from './libs/core/checker/checker'

// function
import $parent from './libs/core/function/$parent'
import debounce from './libs/core/function/debounce'
import deepClone from './libs/core/function/deepClone'
import deepMerge from './libs/core/function/deepMerge'
import groupBy from './libs/core/function/groupBy'
import guid from './libs/core/function/guid'
import pagination from './libs/core/function/pagination'
import queryParams from './libs/core/function/queryParams'
import random from './libs/core/function/random'
import route from './libs/core/function/route'
import sleep from './libs/core/function/sleep'
import { sys, os } from './libs/core/function/sys'
import throttle from './libs/core/function/throttle'
import timeFormat from './libs/core/function/timeFormat'
import timeFrom from './libs/core/function/timeFrom'
import trim from './libs/core/function/trim'

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
