import gbk from './gbk'

const commands = {
  LF: [0x0a],
  FS: [0x1c],
  FF: [0x0c],
  GS: [0x1d],
  DLE: [0x10],
  EOT: [0x04],
  NUL: [0x00],
  ESC: [0x1b],
  EOL: '\n',
  /**
   * [BEEP description]
   * @type {string}
   */
  BEEP: [0x1b, 0x42], // Printer Buzzer pre hex

  TEXT_FORMAT: {
    TXT_NORMAL: [0x1b, 0x21, 0x00], // Normal text
    TXT_NORMAL: [0x1b, 0x21, 0x00], // Normal text
    TXT_2HEIGHT: [0x1b, 0x21, 0x10], // Double height text
    TXT_2WIDTH: [0x1b, 0x21, 0x20], // Double width text
    TXT_4SQUARE: [0x1b, 0x21, 0x30], // Double width & height text

    TXT_CUSTOM_SIZE: function (width, height) {
      // other sizes
      width = width > 8 ? 8 : width
      width = width < 1 ? 1 : width
      height = height > 8 ? 8 : height
      height = height < 1 ? 1 : height

      var widthDec = (width - 1) * 16 // Values between 1-8
      var heightDec = height - 1 // Values between 1-8
      var sizeDec = widthDec + heightDec
      return [0x1d, 0x21, sizeDec]
    },

    TXT_UNDERL_OFF: [0x1b, 0x2d, 0x00], // Underline font OFF
    TXT_UNDERL_ON: [0x1b, 0x2d, 0x01], // Underline font 1-dot ON
    TXT_UNDERL2_ON: [0x1b, 0x2d, 0x02], // Underline font 2-dot ON
    TXT_BOLD_OFF: [0x1b, 0x45, 0x00], // Bold font OFF
    TXT_BOLD_ON: [0x1b, 0x45, 0x01], // Bold font ON
    TXT_ITALIC_OFF: [0x1b, 0x35], // Italic font ON
    TXT_ITALIC_ON: [0x1b, 0x34], // Italic font ON

    TXT_FONT_A: [0x1b, 0x4d, 0x00], // Font type A
    TXT_FONT_B: [0x1b, 0x4d, 0x01], // Font type B
    TXT_FONT_C: [0x1b, 0x4d, 0x02], // Font type C

    TXT_ALIGN_LT: [0x1b, 0x61, 0x00], // Left justification
    TXT_ALIGN_CT: [0x1b, 0x61, 0x01], // Centering
    TXT_ALIGN_RT: [0x1b, 0x61, 0x02] // Right justification
  },
  COLOR: {
    0: [0x1b, 0x72, 0x00], // black
    1: [0x1b, 0x72, 0x01] // red
  },
  /**
   * [HARDWARE Printer hardware]
   * @type {Object}
   */
  HARDWARE: {
    HW_INIT: [0x1b, 0x40], // Clear data in buffer and reset modes
    HW_SELECT: [0x1b, 0x3d, 0x01], // Printer select
    HW_RESET: [0x1b, 0x3f, 0x0a, 0x00] // Reset printer hardware
  },
  LINE_SPACING: {
    LS_DEFAULT: [0x1b, 0x32],
    LS_SET: [0x1b, 0x33]
  }
}

const utils = {
  /**
   * @param str
   * @returns {boolean} str是否全是中文
   */
  // isChinese(str) {
  //   return /^[\u4e00-\u9fa5]$/.test(str)
  // },
  isChinese(str) {
    return /^[\u4e00-\u9fa5，。℃！？；：“”‘’（）【】、]+$/.test(str)
  },
  /**
   * 返回字符串宽度(1个中文=2个英文字符)
   * @param str
   * @returns {number}
   */
  getStringWidth(str) {
    let width = 0
    for (let i = 0, len = str.length; i < len; i++) {
      width += utils.isChinese(str.charAt(i)) ? 2 : 1
    }
    return width
  },
  // ArrayBuffer转16进度字符串示例
  ab2hex(buffer) {
    const hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    })
    return hexArr.join(',')
  }
}

class Printer {
  constructor() {
    this.datas = Array.from(commands.HARDWARE.HW_INIT)
    this.width = 32
  }
  /**
   * 设置字体
   * @param  {string} family A/B/C
   */
  setFont(family) {
    let array = Array.from(commands.TEXT_FORMAT['TXT_FONT_' + family.toUpperCase()])
    this.addData(array)
    return this
  }
  /**
   * 设置对齐方式
   * @param {string} align 对齐方式 LT/CT/RT
   */
  setAlign(align) {
    let array = Array.from(commands.TEXT_FORMAT['TXT_ALIGN_' + align.toUpperCase()])
    this.addData(array)
    return this
  }
  /**
   * 设定字体尺寸
   * @param  {number} width 字体宽度 1~2
   * @param  {number} height 字体高度 1~2
   */
  setSizeType(type = 'normal') {
    let array = Array.from(commands.TEXT_FORMAT['TXT_'] + type.toUpperCase())
    this.addData(array)
    return this
  }
  /**
   * 设定字体尺寸
   * @param  {number} width 字体宽度 1~2
   * @param  {number} height 字体高度 1~2
   */
  setSize(width = 1, height = 1) {
    width = width < 1 ? 1 : width > 1 ? 2 : 1
    height = height < 1 ? 1 : height > 1 ? 2 : 1
    let array = Array.from(commands.TEXT_FORMAT['TXT_CUSTOM_SIZE'](width, height))
    this.addData(array)
    return this
  }
  /**
   * 设定字体是否加粗
   * @param  {boolean} bold
   */
  setBold(bold) {
    if (typeof bold !== 'boolean') {
      bold = true
    }
    this.addData(bold ? commands.TEXT_FORMAT.TXT_BOLD_ON : commands.TEXT_FORMAT.TXT_BOLD_OFF)
    return this
  }
  /**
   *  设置字体颜色，需要打印机支持
   *  @param  {number} color - 0 默认颜色黑色 1 红色
   */
  setColor(color) {
    this.addData(commands.COLOR[color === 1 ? 1 : 0])
    return this
  }
  /**
   * 设定是否开启下划线
   * @param  {boolean} underline
   */
  setUnderline(underline) {
    if (typeof underline !== 'boolean') {
      underline = true
    }
    this.addData(underline ? commands.TEXT_FORMAT.TXT_UNDERL_ON : commands.TEXT_FORMAT.TXT_UNDERL_OFF)
    return this
  }
  /**
   * 设置行间距为 n 点行,默认值行间距是 30 点
   * @param {number} n 0≤n≤255
   */
  setLineSpacing(n) {
    if (n === undefined || n === null) {
      this.addData(commands.LINE_SPACING.LS_DEFAULT)
    } else {
      this.addData(commands.LINE_SPACING.LS_SET)
      this.addData([n])
    }
    return this
  }
  /**
   * 设置段前空格
   * @param {number} n 0≤n≤width
   */
  printTabSpace(n = 0) {
    this.print(new Array(n).fill(' ').join(''), true)
    return this
  }
  /**
   *
   * @param {*} text
   * @param {*} nowrap 为true不换行，默认false换行打印
   * @returns
   */
  print(text, nowrap = false) {
    let encoded = Array.from(gbk.encode(text))
    this.addData(encoded)
    if (!nowrap) {
      this.addData(commands.LF)
    }
    return this
  }
  /**
   * 打印空行
   * @param {*} n
   * @returns
   */
  println = function (n = 1) {
    return this.print(new Array(n).fill(commands.EOL).join(''))
  }
  /**
   * 用字符填充一整行
   * @param {string} fillWith 填充字符
   * @param {number} fontWidth 字符宽度 1/2
   */
  printFill(fillWith = '-', fontWidth = 1) {
    const lineWidth = this.width / fontWidth
    this.print(new Array(lineWidth).fill(fillWith.charAt(0)).join(''))
    return this
  }
  /**
   * 文字内容居中，左右用字符填充
   * @param {string} str 文字内容
   * @param {number} fontWidth 字符宽度 1/2
   * @param {string} fillWith text1 str2之间的填充字符
   */
  printAround(str, fillWith = '-', fontWidth = 1) {
    const lineWidth = this.width / fontWidth
    let strWidth = utils.getStringWidth(str)
    // 内容已经超过一行了，没必要填充
    if (strWidth >= lineWidth) {
      return str
    }
    // 需要填充的字符数量
    let fillCount = lineWidth - strWidth
    // 左侧填充的字符数量
    let leftCount = Math.round(fillCount / 2)
    // 两侧的填充字符，需要考虑左边需要填充，右边不需要填充的情况
    let fillStr = new Array(leftCount).fill(fillWith.charAt(0)).join('')
    this.print(fillStr + str + fillStr.substr(0, fillCount - leftCount))
    return this
  }
  /**
   * 同一行输出str1, str2，str1居左, str2居右
   * @param {string} text1 内容1
   * @param {string} text2 内容2
   * @param {number} fontWidth 字符宽度 1/2
   * @param {string} fillWith text1 str2之间的填充字符
   *
   */
  printLR(text1, text2, fillWith = ' ', fontWidth = 1) {
    const lineWidth = this.width / fontWidth
    // 需要填充的字符数量
    let fillCount = lineWidth - ((utils.getStringWidth(text1) + utils.getStringWidth(text2)) % lineWidth)
    let fillStr = new Array(fillCount).fill(fillWith.charAt(0)).join('')
    this.print(text1 + fillStr + text2)
    return this
  }
  printLCR(text1, text2, text3, fillWith = ' ', fontWidth = 1) {
    const lineWidth = this.width / fontWidth
    // 需要填充的字符数量
    let fillCount = lineWidth - ((utils.getStringWidth(text1) + utils.getStringWidth(text2) + utils.getStringWidth(text3)) % lineWidth)
    let fillStr = new Array(Math.floor(fillCount / 2)).fill(fillWith.charAt(0)).join('')
    this.print(text1 + fillStr + text2 + fillStr + text3)
    return this
  }
  /**
   * 清空任务
   */
  reset() {
    this.data = Array.from(commands.HARDWARE.HW_INIT)
    return this
  }
  /**
   * 增加打印数据
   * @param {*} list 数组
   */
  addData(list) {
    this.datas = [...this.datas, ...list]
    return this
  }
  /**
   * https://support.loyverse.com/hardware/printers/use-the-beeper-in-a-escpos-printers
   * 蜂鸣警报，需要打印机支持
   * @param  {number} n    蜂鸣次数,1-9
   * @param  {number} t 蜂鸣长短,1-9
   */
  beep(n, t) {
    this.addData(commands.BEEP)
    this.addData([n, t])
    return this
  }
  /**
   * 结束打印，返回buffer
   * @returns
   */
  end() {
    this.println()
    return new Uint8Array(this.datas).buffer
  }
  buffer() {
    return new Uint8Array(this.datas).buffer
  }
}

export { Printer, commands, utils }
