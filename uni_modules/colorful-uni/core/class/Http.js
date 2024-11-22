/**
 * 通用 uni-app 网络请求，uni.request
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 * @author anyup
 */
const CONTENT_TYPE = {
  json: "application/json;charset=UTF-8",
  urlencoded: "application/x-www-form-urlencoded",
  formdata: "multipart/form-data"
};

class HttpHeader {
  constructor(params) {
    Object.keys(params).forEach((key) => {
      if (key === "Content-Type") {
        this[key] = CONTENT_TYPE[params[key]] || params[key];
      } else {
        this[key] = params[key];
      }
    });
  }
}

class Builder {
  constructor(http) {
    this.http = http;
  }
  // url分发模块
  dispatch(urls) {
    const obj = {};
    // 类似api
    Object.keys(urls).forEach((name) => {
      obj[name] = this.use.bind(this, urls[name]);
    });
    return obj;
  }
  /**
   * 发送请求
   * @param {*} urlConfig : URL 配置表内容
   * @param {*} data ：data 请求体
   * @param {*} config ：开发配置
   * @returns Promise
   */
  use(urlConfig, data, config = {}) {
    let url = config.url || urlConfig.url;
    // 设置append为拼接url，restful请求方式常用
    const append = config.append || "";
    url = url + append;
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
    return this.http
      .request({ url, data, ...urlConfig, ...config })
      .then(callbackFn);
  }
}

class Http {
  static get Builder() {
    return Builder;
  }
  constructor(options = {}) {
    this.config = {
      baseURL: "",
      header: new HttpHeader({ "Content-Type": "json" }),
      data: {},
      method: "GET",
      dataType: "json",
      responseType: "text",
      success() {},
      fail() {},
      complete() {},
      ...options
    };
    this.interceptors = {
      response: {
        use(handler, onerror, complete) {
          this.handler = handler;
          this.onerror = onerror;
          this.complete = complete;
        }
      },
      request: {
        use(handler) {
          this.handler = handler;
        }
      }
    };
    // 合并锁 'lock', 'unlock', 'clear'
    wrap(this.interceptors.request);
    wrap(this.interceptors.response);
  }
  setBaseURL(baseURL) {
    this.config.baseURL = baseURL;
    return this;
  }
  setHeader(header) {
    this.config.header = { ...this.config.header, ...header };
    return this;
  }
  setData(data) {
    if (isArray(data)) {
      this.config.data = data;
    } else {
      this.config.data = { ...this.config.data, ...data };
    }
    return this;
  }
  setOptions(options) {
    this.config = { ...this.config, ...options };
  }
  /**
   * 请求主方法
   * @param {Object} options 实时传递的配置
   * @returns Promise
   * 说明：配置优先级 实时传递的 options > 公共配置的 config
   */
  request(options) {
    if (!options) options = {};
    // 请求URL
    // let url = options.url;
    // 请求体
    const data = options.data || {};
    // 请求baseURL：优先级为：实时传递的 > 公共配置的
    options.baseURL =
      options.baseURL !== undefined ? options.baseURL : this.config.baseURL;
    // 请求头：合并公共配置与实时设置的header， 且优先级实时设置会覆盖公共配置的
    options.header = { ...this.config.header, ...options.header };
    // 请求方式：优先级为：实时传递的 > 公共配置的
    options.method = options.method || this.config.method;
    // 数据格式：默认json
    options.dataType = options.dataType || this.config.dataType;
    // 请求体：优先级为：实时传递的 > 公共配置的
    if (isArray(data)) {
      options.data = data;
    } else {
      options.data = { ...this.config.data, ...data };
    }
    // 如果是上传文件
    // if (options.method === "upload") {
    //   url = url && url.indexOf("http") !== 0 ? options.baseURL + url : url;
    //   return new Promise((resolve, reject) => {
    //     uni.uploadFile({
    //       url,
    //       filePath: data.filePath,
    //       name: data.name,
    //       formData: data.formData || {},
    //       success(res) {
    //         resolve(res);
    //       },
    //       fail(e) {
    //         reject(e);
    //       }
    //     });
    //   });
    // }
    // 拦截器处理
    const interceptors = this.interceptors;
    const requestInterceptor = interceptors.request;
    const responseInterceptor = interceptors.response;
    const requestInterceptorHandler = requestInterceptor.handler;

    return new Promise((resolve, reject) => {
      function isPromise(p) {
        return p && p.then && p.catch;
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
            callback();
          });
        } else {
          callback();
        }
      }

      function onresult(handler, response, type) {
        enqueueIfLocked(responseInterceptor.p, function () {
          if (handler) {
            // 统一添加请求信息
            response.request = options;
            const ret = handler.call(responseInterceptor, response, Promise);
            response = ret === undefined ? response : ret;
          }
          if (!isPromise(response)) {
            response = Promise[type === 0 ? "resolve" : "reject"](response);
          }
          response
            .then((d) => {
              resolve(d.data);
            })
            .catch((e) => {
              reject(e);
            });
        });
      }

      options.complete = (response) => {
        const statusCode = response.statusCode;
        let type = 0;
        if ((statusCode >= 200 && statusCode < 300) || statusCode === 304) {
          // 请求成功
          type = 0;
          onresult(responseInterceptor.handler, response, type);
        } else {
          // 请求错误
          type = -1;
          onresult(responseInterceptor.onerror, response, type);
        }
        // 请求完成，无论请求成功、失败都会走的回调
        onresult(responseInterceptor.complete, response, type);
      };

      enqueueIfLocked(requestInterceptor.p, () => {
        options = Object.assign({}, this.config, options);
        options.requestId = new Date().getTime();
        let ret = options;
        if (requestInterceptorHandler) {
          ret =
            requestInterceptorHandler.call(
              requestInterceptor,
              options,
              Promise
            ) || options;
        }
        if (!isPromise(ret)) {
          ret = Promise.resolve(ret);
        }
        ret.then(
          (d) => {
            if (d === options) {
              // url处理
              d.url =
                d.url && d.url.indexOf("http") !== 0
                  ? d.baseURL + d.url
                  : d.url;
              // 是否有追加restful url
              d.url = d.restURL ? d.url + d.restURL : d.url;
              // 将请求方式 method 统一转换为大写
              d.method = d.method.toUpperCase();
              // 请求
              d.method === "UPLOAD" ? uni.uploadFile(d) : uni.request(d);
            } else {
              resolve(d);
            }
          },
          (err) => {
            reject(err);
          }
        );
      });
    });
  }
  all(promises) {
    return Promise.all(promises);
  }
}

["get", "post", "put", "patch", "head", "delete", "upload"].forEach((e) => {
  Http.prototype[e] = function (url, data, option) {
    return this.request(merge({ url, data, method: e }, option));
  };
});
["lock", "unlock", "clear"].forEach((e) => {
  Http.prototype[e] = function () {
    this.interceptors.request[e]();
  };
});

// 数据合并
function merge(a, b) {
  for (const key in b) {
    // eslint-disable-next-line no-prototype-builtins
    if (!a.hasOwnProperty(key)) {
      a[key] = b[key];
    } else if (isObject(b[key], 1) && isObject(a[key], 1)) {
      this.merge(a[key], b[key]);
    }
  }
  return a;
}

function isObject(ob, real) {
  if (real) {
    return (
      Object.prototype.toString.call(ob).slice(8, -1).toLowerCase() === "object"
    );
  } else {
    return ob && typeof ob === "object";
  }
}

function isArray(value) {
  return Array.isArray(value);
}

function wrap(interceptor) {
  let resolve;
  let reject;

  function _clear() {
    interceptor.p = resolve = reject = null;
  }

  merge(interceptor, {
    lock() {
      if (!resolve) {
        interceptor.p = new Promise((_resolve, _reject) => {
          resolve = _resolve;
          reject = _reject;
        });
      }
    },
    unlock() {
      if (resolve) {
        resolve();
        _clear();
      }
    },
    clear() {
      if (reject) {
        reject("cancel");
        _clear();
      }
    }
  });
}

export { HttpHeader, Http };
