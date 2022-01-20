export function os() {
  return uni.getSystemInfoSync().platform
}

export function sys() {
  return uni.getSystemInfoSync()
}

export function isAndroid() {
  return uni.getSystemInfoSync().platform === 'android'
}

export function isIOS() {
  return uni.getSystemInfoSync().platform === 'ios'
}
