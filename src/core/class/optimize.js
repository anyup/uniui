class Builder {
  constructor(callback, delay) {
    this.callback = callback
    this.delay = delay
  }

  setCallback(callback) {
    this.callback = callback
    return this
  }

  getCallback() {
    return this.callback
  }

  setDelay(delay) {
    this.delay = delay
    return this
  }

  getDelay() {
    return this.delay
  }

  build(type) {
    if (type === 'debounce') {
      return new DebounceOptimize(this)
    } else if (type === 'throttle') {
      return new ThrottleOptimize(this)
    }
  }
}
//优化基类
class Optimize {
  static Builder = Builder
  constructor() {
    this.callback = null
    this.delay = 500
  }
  excute(params) {
    // do something......
  }
}
//防抖
class DebounceOptimize extends Optimize {
  constructor(builder) {
    super()
    this.callback = builder.callback
    this.delay = builder.delay
    this.timeout = undefined
  }
  excute(params) {
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.callback(params)
    }, this.delay)
  }
}

//节流
class ThrottleOptimize extends Optimize {
  constructor(builder) {
    super()
    this.callback = builder.callback
    this.delay = builder.delay
    this.previous = 0
  }
  excute(params) {
    let now = Date.now()
    if (now - this.previous > this.delay) {
      this.callback(params)
      this.previous = now
    }
  }
}

export { Optimize }
