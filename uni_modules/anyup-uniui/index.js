// class
import { Bluetooth } from "./core/class/Bluetooth";
import { Downloader } from "./core/class/Downloader";
import { HttpHeader, Http } from "./core/class/Http";
import { Mixin } from "./core/class/Mixin";
import { Optimize } from "./core/class/Optimize";
import { Pager } from "./core/class/Pager";
import { Plus } from "./core/class/Plus";
import { Push } from "./core/class/Push";
import { Store } from "./core/class/Store";
import { StoreModule } from "./core/class/StoreModule";
import { Tips } from "./core/class/Tips";

import useStore from "./core/store/useStore";
import checker from "./core/checker/checker";

// function
import $parent from "./core/function/$parent";
import color from "./core/function/color";
import { formatTime, pastTime, getDate } from "./core/function/datetime";
import debounce from "./core/function/debounce";
import deepClone from "./core/function/deepClone";
import deepMerge from "./core/function/deepMerge";
import groupBy from "./core/function/groupBy";
import guid from "./core/function/guid";
import pagination from "./core/function/pagination";
import queryParams from "./core/function/queryParams";
import random from "./core/function/random";
import route from "./core/function/route";
import sleep from "./core/function/sleep";
import { sys, os, isAndroid, isIOS } from "./core/function/sys";
import throttle from "./core/function/throttle";
import trim from "./core/function/trim";

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
};

const install = (Vue, { store } = {}) => {
  Vue.prototype.$_u = _u;
  if (store) {
    Vue.mixin(new Mixin(store).init());
    Vue.prototype.$_u.store = new Store(store);
    Vue.prototype.$_u.tips = new Tips(store);
    Vue.prototype.$_u.checker = checker;
  }
};

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
};

export default { install };
