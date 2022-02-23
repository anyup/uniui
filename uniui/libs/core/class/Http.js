/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 * @author qiaomingxing
 */
const CONTENT_TYPE = {
  json: 'application/json;charset=UTF-8',
  urlencoded: 'application/x-www-form-urlencoded',
  formdata: 'multipart/form-data'
}

class HttpHeader {
  constructor(params) {
    Object.keys(params).forEach(key => {
      if (key === 'Content-Type') {
        this[key] = CONTENT_TYPE[params[key]] || params[key]
      } else {
        this[key] = params[key]
      }
    })
  }
}

class Builder {
  constructor(http) {
    this.http = http;
  }
  // url分发模块
  dispatch(urls) {
    let obj = {};
    // 类似api
    Object.keys(urls).forEach((name) => {
      obj[name] = this.use.bind(this, urls[name]);
    });
    return obj;
  }
  /**
   * 发送请求
   * @param {*} name : url 名称
   * @param {*} urlConfig : url 配置
   * @param {*} config : 开放配置
   */
  use(urlConfig, payload, config = {}) {
    let url = config.url || urlConfig.url;
    let append = config.append || '';
    url = url + append;
    let data = {};
    let params = {};
    let method = config.method || urlConfig.method || 'get'; // 请求类型，get,post,put,delete
    // const async = config.async || false; // 是否异步
    // 默认回调
    const defaultFn = (res) => {
      return res;
    };
    // 成功回调
    const successFn = config.success || defaultFn;
    // 回调
    const callbackFn = function (res) {
      return successFn(res, defaultFn);
    };
    if (method.toUpperCase() === 'GET') {
      params = payload;
    } else {
      data = payload;
    }
    return this.http.request({ url, method, params, data }).then(callbackFn);
  }
}

class Http {
  static Builder = Builder;
  constructor() {
    this.config = {
      baseURL: '',
      header: new HttpHeader({ 'Content-Type': 'json' }),
      data: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success() { },
      fail() { },
      complete() { }
    }
    this.interceptors = {
      response: {
        use(handler, onerror) {
          this.handler = handler
          this.onerror = onerror
        }
      },
      request: {
        use(handler) {
          this.handler = handler
        }
      }
    }
    // 合并锁 'lock', 'unlock', 'clear'
    wrap(this.interceptors.request)
    wrap(this.interceptors.response)
  }
  setBaseURL(baseURL) {
    this.config.baseURL = baseURL
    return this
  }
  setHeader(header) {
    this.config.header = { ...this.config.header, ...header }
    return this
  }
  setData(data) {
    if (isArray(data)) {
      this.config.data = data
    } else {
      this.config.data = { ...this.config.data, ...data }
    }
    return this
  }
  request(url, data, options) {
    if (!options) options = {}
    options.url = url
    options.baseURL = options.baseURL !== undefined ? options.baseURL : this.config.baseURL
    options.header = { ...this.config.header, ...options.header }
    options.method = options.method || this.config.method
    options.dataType = options.dataType || this.config.dataType
    if (isArray(data)) {
      options.data = data
    } else {
      options.data = { ...this.config.data, ...data }
    }
    // 如果是上传文件
    if (options.method === 'upload') {
      url = url && url.indexOf('http') !== 0 ? options.baseURL + url : url
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url,
          filePath: data.filePath,
          name: data.name,
          formData: data.formData || {},
          success(res) {
            resolve(res)
          },
          fail(e) {
            reject(e)
          }
        })
      })
    }
    // 拦截器处理
    let interceptors = this.interceptors
    let requestInterceptor = interceptors.request
    let responseInterceptor = interceptors.response
    let requestInterceptorHandler = requestInterceptor.handler

    return new Promise((resolve, reject) => {
      function isPromise(p) {
        return p && p.then && p.catch
      }

      /**
       * If the request/response interceptor has been locked，
       * the new request/response will enter a queue. otherwise, it will be performed directly.
       * @param [promise] if the promise exist, means the interceptor is  locked.
       * @param [callback]
       */
      function enqueueIfLocked(promise, callback) {
        if (promise) {
          promise.then(() => {
            callback()
          })
        } else {
          callback()
        }
      }

      function onresult(handler, response, type) {
        enqueueIfLocked(responseInterceptor.p, function () {
          if (handler) {
            //如果失败，添加请求信息
            if (type !== 0) {
              response.request = options
            }
            // 统一添加请求信息
            response.request = options
            let ret = handler.call(responseInterceptor, response, Promise)
            response = ret === undefined ? response : ret
          }
          if (!isPromise(response)) {
            response = Promise[type === 0 ? 'resolve' : 'reject'](response)
          }
          response
            .then(d => {
              resolve(d.data)
            })
            .catch(e => {
              reject(e)
            })
        })
      }

      function onerror(e) {
        onresult(responseInterceptor.onerror, e, -1)
      }

      options.complete = response => {
        let statusCode = response.statusCode
        if ((statusCode >= 200 && statusCode < 300) || statusCode === 304) {
          onresult(responseInterceptor.handler, response, 0)
        } else {
          onerror(response)
        }
      }

      enqueueIfLocked(requestInterceptor.p, () => {
        options = Object.assign({}, this.config, options)
        options.requestId = new Date().getTime()
        let ret = options
        if (requestInterceptorHandler) {
          ret = requestInterceptorHandler.call(requestInterceptor, options, Promise) || options
        }
        if (!isPromise(ret)) {
          ret = Promise.resolve(ret)
        }
        ret.then(
          d => {
            if (d === options) {
              // url处理
              d.url = d.url && d.url.indexOf('http') !== 0 ? d.baseURL + d.url : d.url
              // 是否有追加restful url
              d.url = d.restURL ? d.url + d.restURL : d.url
              // 请求
              uni.request(d)
            } else {
              resolve(d)
            }
          },
          err => {
            reject(err)
          }
        )
      })
    })
  }
  all(promises) {
    return Promise.all(promises)
  }
  spread(callback) {
    return function (arr) {
      return callback.apply(null, arr)
    }
  }
}

;['get', 'post', 'put', 'patch', 'head', 'delete', 'upload'].forEach(e => {
  Http.prototype[e] = function (url, data, option) {
    return this.request(url, data, merge({ method: e }, option))
  }
})

;['lock', 'unlock', 'clear'].forEach(e => {
  Http.prototype[e] = function () {
    this.interceptors.request[e]()
  }
})

// 数据合并
function merge(a, b) {
  for (let key in b) {
    if (!a.hasOwnProperty(key)) {
      a[key] = b[key]
    } else if (isObject(b[key], 1) && isObject(a[key], 1)) {
      this.merge(a[key], b[key])
    }
  }
  return a
}

function isObject(ob, real) {
  if (real) {
    return Object.prototype.toString.call(ob).slice(8, -1).toLowerCase() === 'object'
  } else {
    return ob && typeof ob === 'object'
  }
}

function isArray(value) {
  return Array.isArray(value)
}

function wrap(interceptor) {
  let resolve
  let reject

  function _clear() {
    interceptor.p = resolve = reject = null
  }

  merge(interceptor, {
    lock() {
      if (!resolve) {
        interceptor.p = new Promise((_resolve, _reject) => {
          resolve = _resolve
          reject = _reject
        })
      }
    },
    unlock() {
      if (resolve) {
        resolve()
        _clear()
      }
    },
    clear() {
      if (reject) {
        reject('cancel')
        _clear()
      }
    }
  })
}

export { HttpHeader, Http }
