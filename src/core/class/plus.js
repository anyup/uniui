class Plus {
  constructor() {
    if (Plus.instance) {
      return Plus.instance
    }
    Plus.instance = this
    return Plus.instance
  }

  version() {
    return plus.runtime.version
  }

  versionCode() {
    return plus.runtime.versionCode
  }
}

export { Plus }
