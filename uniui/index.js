// class
import { Bluetooth } from './libs/core/class/Bluetooth'
import { Downloader } from './libs/core/class/Downloader'
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
import color from './libs/core/function/color'
import { formatTime, pastTime, getDate } from './libs/core/function/datetime'
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
import { sys, os, isAndroid, isIOS } from './libs/core/function/sys'
import throttle from './libs/core/function/throttle'
import trim from './libs/core/function/trim'

const _u = {
  $parent,
  color,
  formatTime,
  pastTime,
  getDate,
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
  isAndroid,
  isIOS,
  throttle,
  trim,
  plus: new Plus()
}

const install = (Vue, { store } = {}) => {
  Vue.prototype.$_u = _u
  if (store) {
    Vue.mixin(new Mixin(store).init())
    Vue.prototype.$tips = new Tips(store)
    Vue.prototype.$_u.store = new Store(store)
  }
}

export {
  Bluetooth,
  Downloader,
  HttpHeader,
  Http,
  Mixin,
  Optimize,
  Pager,
  Plus,
  Push,
  Store,
  StoreModule,
  Tips,
  checker,
  useStore,
  _u
}

export default { install }
