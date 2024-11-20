<p align="center">
    <img alt="logo" src="https://www.anyup.cn/static/anyup/images/logo.png" width="120" style="margin-bottom: 10px;">
</p>

<h1 align="center">anyup design uniui</h1>

<p align="center">简洁、高效的前端工程化框架库</p>

<p align="center">
  🔥 <a href="https://www.anyup.cn/">在线文档网站</a>
</p>

### 介绍

anyup uniui，是 uni-app 项目的最佳实践框架，包含最佳的组件实现和便捷的工具类封装。

## 特性

- 🚀 简洁至上，低代码开发的标准设计，开箱即用，自定义可扩展性

- ✅ 不断积累多个项目开发经验，迭代优化代码及引用资源，形成最佳实践并逐渐成为标准

## 安装

```bash
npm install @anyup/uniui
```

## 快速上手

1. main.js

```js
// 项目中最好使用Vuex Store，因为部分功能依赖
import store from './store';
import uniUI from '@anyup/uniui';
Vue.use(uniUI, { store });
```

2. 在 uni.scss 自定义主题样式

如果你需要自定义主题样式，可引入 uni.scss 全局样式文件

```scss
// 主题颜色
$is-type-primary: #2979ff;
$is-type-primary-light: #ecf5ff;
$is-type-primary-disabled: #a0cfff;
$is-type-primary-dark: #2b85e4;

$is-type-warning: #ff9900;
$is-type-warning-disabled: #fcbd71;
$is-type-warning-dark: #f29100;
$is-type-warning-light: #fdf6ec;

$is-type-success: #19be6b;
$is-type-success-disabled: #71d5a1;
$is-type-success-dark: #18b566;
$is-type-success-light: #dbf1e1;

$is-type-error: #fa3534;
$is-type-error-disabled: #fab6b6;
$is-type-error-dark: #dd6161;
$is-type-error-light: #fef0f0;

$is-type-info: #909399;
$is-type-info-disabled: #c8c9cc;
$is-type-info-dark: #82848a;
$is-type-info-light: #f4f4f5;
// 其他颜色
$is-main-color: #303133;
$is-content-color: #606266;
$is-tips-color: #909399;
$is-light-color: #c0c4cc;
$is-border-color: #e4e7ed;
$is-bg-color: #f3f4f6;
$is-form-item-border-color: #dcdfe6;
$is-form-item-height: 70rpx;
```

3. 在 App.vue 中引入基础样式

```html
<style lang="scss">
@import '@anyup/uniui/dist/index.scss';
</style>

```

anyup-uniui 支持按需引用、单独引用等方式，详细说明见 [快速上手](https://www.anyup.cn/docs/zh/guide/quickstart.html).

## 开源项目

[Github：https://github.com/anyup/uniui](https://github.com/anyup/uniui)

[Gitee：https://gitee.com/anyup/uniui](https://gitee.com/anyup/uniui)


## 贡献代码

使用过程中发现任何问题都可以通过以下方式贡献代码：

Github 提 [Issue](https://github.com/anyup/uniui/issues) ，也非常欢迎您发 [PR](https://github.com/anyup/uniui/pulls)。

Gitee 提 [Issue](https://gitee.com/anyup/uniui/issues) ，也非常欢迎您发 [PR](https://gitee.com/anyup/uniui/pulls)。

## 浏览器支持

支持现代浏览器以及 Android >= 4.0、iOS >= 8.0。

## 手机预览

可以手机扫码以下二维码访问手机端 demo：

<table class="table">
    <tr>
        <td><img src="https://www.anyup.cn/static/anyup/images/qr_wx.png" width="150" height="150" ></td>
	    <td><img src="https://www.anyup.cn/static/anyup/images/qr_wx_youti.jpg" width="150" height="150" ></td>
	    <td><img src="https://www.anyup.cn/static/anyup/images/qr_h5.png" width="150" height="150" ></td>
	    <td><img src="https://www.anyup.cn/static/anyup/images/qr_android.png" width="150" height="150" ></td>
    </tr>
    <tr>
        <td align="center">微信小程序</td>
	    <td align="center">软考小程序</td>
	    <td align="center">H5</td>
	    <td align="center">Android</td>
    </tr>
</table>

## 开源协议

本项目基于 MIT 协议，请自由地享受和参与开源。
