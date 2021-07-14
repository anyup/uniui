/**
 * @desc 函数节流：在一定时间内，只能触发一次
 * @param {Function} func 函数
 * @param {Number} wait 延迟执行毫秒数
 * @param {Boolean} type true 表示时间戳版，false 表示定时器版
 */
function throttle(func, wait = 500, type = true) {
  let previous = 0
  let timeout
  return function () {
    let context = this
    let args = arguments
    if (type) {
      let now = Date.now()
      if (now - previous > wait) {
        typeof func === 'function' && func.apply(context, args)
        previous = now
      }
    } else {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null
          typeof func === 'function' && func.apply(context, args)
        }, wait)
      }
    }
  }
}

export default throttle
