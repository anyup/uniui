/**
 * @desc 函数防抖：一定时间内，只有最后一次操作，再过wait毫秒后才执行函数
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
function debounce(func, wait = 500, immediate = false) {
  let timeout

  return function () {
    let context = this
    let args = arguments
    // 清除定时器
    if (timeout) clearTimeout(timeout)
    // 立即执行，此类情况一般用不到
    if (immediate) {
      var callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait)
    }
  }
}

export default debounce
