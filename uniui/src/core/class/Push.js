class Push {
  constructor(title = '') {
    if (Push.instance) {
      return Push.instance
    }
    this.title = title
    Push.instance = this
    return Push.instance
  }
  // 获取cid
  getCid() {
    let info = plus.push.getClientInfo()
    return info.clientid == 'null' ? '' : info.clientid
  }
  // 消息监听
  register(clickCallback) {
    plus.push.addEventListener(
      'receive',
      msg => {
        if (plus.os.name == 'iOS') {
          if (msg.aps) {
            // Apple APNS message  接收到在线APNS消息
          } else {
            // 接收到在线透传消息
            this.createLocalMsg(msg) //创建本地消息
          }
        }
      },
      false
    )
    plus.push.addEventListener(
      'click',
      msg => {
        if (clickCallback) clickCallback(msg)
      },
      false
    )
  }
  // 创建本地消息
  createLocalMsg(msg) {
    if (!msg) {
      return
    }
    if (msg.payload === 'LocalMSG') {
      return
    }
    plus.push.createMessage(msg.content, 'LocalMSG', {
      cover: false,
      title: this.title || msg.title
    })
  }
  // 清空角标
  clearBadge() {
    setTimeout(() => {
      plus.runtime.setBadgeNumber(0)
      if (uni.getSystemInfoSync().platform == 'ios') {
        //导入个推原生类
        var GeTuiSdk = plus.ios.importClass('GeTuiSdk')
        GeTuiSdk.setBadge(0)
      }
    }, 100)
  }
}

export { Push }
