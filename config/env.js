// 环境常量定义
const baseURL = {
  dev: 'https://api.dev',
  prod: 'https://api.prod'
}
const env = {
  isProd: true,
  baseURL: baseURL.dev
}

if (env.isProd) {
  env.baseURL = baseURL.prod
} else {
  env.baseURL = baseURL.dev
}

// #ifdef MP-WEIXIN
const wxConfig = __wxConfig
const accountInfo = wx.getAccountInfoSync()
console.log('小程序appId：', accountInfo.miniProgram.appId) // 小程序 appId
console.log('小程序版本：', accountInfo.miniProgram.envVersion) // 小程序版本
console.log('线上小程序版本号：', accountInfo.miniProgram.version) // 线上小程序版本号

switch (accountInfo.miniProgram.envVersion) {
  case 'develop': // 开发版小程序
    console.log('开发版小程序')
    break
  case 'trial': // 体验版小程序
    console.log('体验版小程序')
    break
  case 'release': // 线上小程序
    console.log('线上小程序')
    break
  default:
    console.log('判读出错')
    break
}

// 在微信小程序环境下，根据微信环境变量，根据不同的版本设置不同的域名
switch (accountInfo.miniProgram.envVersion) {
  case 'develop': // 开发版小程序
    env.isProd = false
    env.baseURL = baseURL.dev
    break
  case 'trial': // 体验版小程序
    env.isProd = false
    env.baseURL = baseURL.dev
    break
  case 'release': // 线上小程序
    env.isProd = true
    env.baseURL = baseURL.prod
    break
  default:
    env.isProd = true
    env.baseURL = baseURL.prod
    break
}
// #endif

console.log(env)

export { baseURL }

export default env
