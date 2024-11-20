/**
 * @desc 函数节流：在一定时间内，只能触发一次
 * @param {Function} func 函数
 * @param {Number} wait 延迟执行毫秒数
 */
let previous = 0;
function throttle(func, wait = 500) {
  let now = Date.now();
  if (now - previous > wait) {
    typeof func === "function" && func();
    previous = now;
  }
}

export default throttle;
