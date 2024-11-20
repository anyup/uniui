/**
 * 公共提示Tips JS工具类
 * @author qiaomingxing
 */
import Vue from "vue";

class Tips {
  constructor(store) {
    if (Tips.instance) {
      return Tips.instance;
    }
    this.store = store || new Vue().$store;
    Tips.instance = this;
    return Tips.instance;
  }
  /**
   * 显示Loading加载框
   * @param {String} 加载框id 和loaded保持一致
   */
  loading(text = "", options = {}) {
    this.store.commit("base/commit", {
      loading: { show: true, text, ...options }
    });
  }
  /**
   * 隐藏Loading加载框
   * @param {String} 加载框id 和loading保持一致
   */
  loaded() {
    this.store.commit("base/commit", { loading: { show: false } });
  }
  /**
   * toast提示
   * @param {String} 提示内容
   * @param {String} 图标 none/success/info/fail
   */
  toast(title, icon = "none", options = {}) {
    if (Boolean(title) === false) {
      this.store.commit("base/commit", { toast: {} });
      return;
    }
    this.store.commit("base/commit", { toast: { title, icon, ...options } });
  }
  info(title) {
    this.toast(title, "info");
  }
  success(title) {
    this.toast(title, "success");
  }
  fail(title) {
    this.toast(title, "fail");
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
        title: options.title || "提示",
        content: content,
        showCancel: options.showCancel,
        confirmText: options.confirmText || "确定",
        cancelText: options.cancelText || "取消",
        success: (res) => {
          if (res.confirm) {
            resolve(payload);
          } else if (res.cancel) {
            reject(payload);
          }
        }
      });
    });
  }
}

export { Tips };
