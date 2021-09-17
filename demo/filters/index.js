export default {
  // 性别
  _sex(value) {
    switch (value) {
      case 1:
        return '男'
      case 2:
        return '女'
      default:
        return ''
    }
  }
}
