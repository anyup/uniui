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

  clientInfo() {
    return plus.push.getClientInfo()
  }

  clientid() {
    let id = this.clientInfo().clientid
    return id == 'null' ? '' : id
  }

  openURL(url) {
    plus.runtime.openURL(url)
  }
}

export { Plus }
