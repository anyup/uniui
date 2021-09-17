/**
 * 公共Utils JS工具类
 */
module.exports = {
  /**
   * 判读是否为空
   * @param {any} v
   * isEmpty()              //true
   * isEmpty([])            //true
   * isEmpty({})            //true
   * isEmpty(0)             //true
   * isEmpty(Number("abc")) //true
   * isEmpty("")            //true
   * isEmpty("   ")         //true
   * isEmpty(false)         //true
   * isEmpty(null)          //true
   * isEmpty(undefined)     //true
   */
  isEmpty: function (v) {
    switch (typeof v) {
      case 'undefined':
        return true
      case 'string':
        if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true
        break
      case 'boolean':
        if (!v) return true
        break
      case 'number':
        if (0 === v || isNaN(v)) return true
        break
      case 'object':
        if (null === v || v.length === 0) return true
        for (var i in v) {
          return false
        }
        return true
    }
    return false
  },
  /**
   * 密码为8~20位数字和字母组合
   * @param {String} value
   */
  checkPwd: function (value) {
    return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(value)
  },
  /**
   * 格式化手机号码
   * @param {String}
   * @return 133*****9999
   */
  formatMobile: function (num) {
    if (utils.isMobile(num)) {
      num = num.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
    }
    return num
  },
  /**
   * 金额格式化
   * @return 86,117.00
   */
  formatMoney: function (money) {
    return parseFloat(money)
      .toFixed(2)
      .toString()
      .split('')
      .reverse()
      .join('')
      .replace(/(\d{3})/g, '$1,')
      .replace(/\,$/, '')
      .split('')
      .reverse()
      .join('')
  },
  /**
   * 格式化时间
   * @param {date} date Date
   * @param {string} fmt yyyy-MM-dd hh:mm:ss
   */
  formatDate: function (date = new Date(), fmt = 'yyyy-MM-dd hh:mm:ss') {
    let o = {
      'M+': date.getMonth() + 1, //月份
      'd+': date.getDate(), //日
      'h+': date.getHours(), //小时
      'm+': date.getMinutes(), //分
      's+': date.getSeconds(), //秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (let k in o) if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    return fmt
  }
}
