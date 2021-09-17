class Builder {
  constructor(delay = 500) {
    this.delay = delay
    this.previous = 0
    this.timeout = undefined
  }

  // 节流
  throttle(callback, delay) {
    delay = delay || this.delay
    let now = Date.now()
    if (now - this.previous > delay) {
      callback()
      this.previous = now
    }
  }

  // 防抖
  debounce(callback, delay) {
    delay = delay || this.delay
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      callback()
    }, delay)
  }
}
//优化基类
class Optimize {
  static Builder = Builder
  constructor() {}
}

export { Optimize }
