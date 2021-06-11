/**
 * 公共提示Tips JS工具类
 */
class Tips {
  constructor(store) {
    this.store = store
  }
  /**
   * 显示Loading加载框
   * @param {String} 加载框id 和loaded保持一致
   */
  loading() {
    this.store.commit('anyup/$commit', { loading: true })
  }
  /**
   * 隐藏Loading加载框
   * @param {String} 加载框id 和loading保持一致
   */
  loaded() {
    this.store.commit('anyup/$commit', { loading: false })
  }
  /**
   * toast提示
   * @param {String} 提示内容
   */
  toast(title, icon = 'none', options = {}) {
    if (Boolean(title) === false) {
      return
    }
    this.store.commit('anyup/$commit', { toast: { title, icon } })
  }
  /**
   * 弹出确认框
   * @param {String} 内容
   */
  confirm(
    content,
    options = {
      showCancel: true
    },
    payload = {}
  ) {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: options.title || '提示',
        content: content,
        showCancel: options.showCancel,
        confirmText: options.confirmText || '确定',
        cancelText: options.cancelText || '取消',
        success: res => {
          if (res.confirm) {
            resolve(payload)
          } else if (res.cancel) {
            reject(payload)
          }
        }
      })
    })
  }
}

export default Tips
