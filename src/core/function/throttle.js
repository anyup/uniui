/**
 * @desc 节流函数：在一定时间内，只能触发一次
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 时间戳版，time 2 定时器版:timeout 默认timeout
 */
function throttle(func, wait = 500, type = 'timeout') {
  let previous = 0
  let timeout
  return function () {
    let context = this
    let args = arguments
    if (type === 'timeout') {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null
          func.apply(context, args)
        }, wait)
      }
    } else {
      let now = Date.now()
      if (now - previous > wait) {
        func.apply(context, args)
        previous = now
      }
    }
  }
}

export default throttle
