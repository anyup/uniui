;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], factory)
    : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self), factory((global.__APP__CONFIG = {})))
})(this, function (exports) {
  'use strict'

  var __APP__CONFIG = {
    // 环境
    env: {
      isProd: true,
      version: '1.0.0'
    },
    // 接口URL
    apiURL: {
      dev: '',
      prod: ''
    },
    // 资源URL
    fileURL: {
      dev: '',
      prod: ''
    },
    // 白名单
    whiteList: ['/pages/login/login']
  }

  if (window) window.__APP__CONFIG = __APP__CONFIG

  exports.__APP__CONFIG = __APP__CONFIG

  Object.defineProperty(exports, '__esModule', { value: true })
})
