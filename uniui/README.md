<p align="center">
    <img alt="logo" src="https://static.anyup.cn/anyup/images/logo.png" width="120" style="margin-bottom: 10px;">
</p>

<h1 align="center">anyup design</h1>

<p align="center">简洁、高效的前端工程化框架库</p>

<p align="center">
  🔥 <a href="https://uniapp.anyup.cn/">文档网站（国内）</a>
  &nbsp;
  🔥 <a href="https://www.anyup.cn/">文档网站（国外源）</a>
</p>

### 介绍

anyup uniui，是uni-app项目的最佳实践框架，包含最佳的组件实现和便捷的工具类封装。

## 特性

- 🚀 简洁至上，低代码开发的标准设计，开箱即用，自定义可扩展性
- 🚀 不断积累多个项目开发经验，迭代优化代码及引用资源，形成最佳实践并逐渐成为标准

## 安装

```bash
// 安装
npm install @anyup/uniui -S

// 更新
npm update @anyup/uniui
```

## 快速上手

```js
// 项目中最好使用Vuex Store，因为部分功能依赖
import store from './store'
Vue.prototype.$store = store

// 必须在绑定prototype之后注册uniui
import uniUI from '@anyup/uniui'
Vue.use(uniUI)
```

anyup 支持按需引用、单独引用等方式，详细说明见 [快速上手](https://anyup.gitee.io/zh/guide/quickstart.html).

## 贡献代码

使用过程中发现任何问题都可以提 [Issue](https://github.com/anyup/uniui/issues) 给我们，当然，我们也非常欢迎你给我们发 [PR](https://github.com/anyup/uniui/pulls)。

## 浏览器支持

支持现代浏览器以及 Android >= 4.0、iOS >= 8.0。

## 手机预览

可以手机扫码以下二维码访问手机端 demo：

<img src="https://static.anyup.cn/anyup/images/qr_wx.png" width="220" height="220" >

<img src="https://static.anyup.cn/anyup/images/qr_h5.png" width="220" height="220" >

<img src="https://static.anyup.cn/anyup/images/qr_android.png" width="220" height="220" >

## 开源协议

本项目基于 MIT 协议，请自由地享受和参与开源。
