<template>
  <app-layout>
    <view class="is-flex is-flex-column is-align-center">
      <image class="logo" src="/static/logo.png"></image>
      <text>简洁高效的 uni-app 框架</text>
    </view>
    <view class="is-pd-10 is-relative">
      <view class="group-title">登录状态：{{ getter_user.token ? '已登录' : '未登录' }}</view>
      <view>用户名：{{ getter_user.userinfo.username }}</view>
      <view>密码：{{ getter_user.userinfo.password }}</view>
      <view>token：{{ getter_user.token }}</view>
      <view class="login-status">
        <u-tag v-if="getter_user.token" type="error" @click="logout" text="退出登录" />
        <u-tag v-else type="primary" @click="toLogin" text="去登录" />
      </view>
    </view>
    <view class="is-pd-10">
      <view class="group-title">文档链接</view>
      <u-link href="https://www.anyup.cn/" :under-line="true">官网文档</u-link><br /><br />
      <u-link href="https://ext.dcloud.net.cn/plugin?id=7144" :under-line="true">uni-app 插件市场</u-link><br />
    </view>
    <view class="is-pd-10">
      <view class="group-title">博客链接</view>
      <u-link href="https://mp.weixin.qq.com/s/kHQ9Db0QUvpxDh1nhJEP2g" :under-line="true">微信公众号</u-link><br /><br />
      <u-link href="https://juejin.cn/user/4230576472589976/posts" :under-line="true">掘金</u-link><br /><br />
      <u-link href="https://blog.csdn.net/qq_24956515" :under-line="true">CSDN</u-link><br /><br />
      <u-link href="https://www.yuque.com/anyup" :under-line="true">语雀</u-link>
    </view>
  </app-layout>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello'
    }
  },
  onLoad() {},
  methods: {
    logout() {
      this.$_u.tips.confirm('是否退出登录').then(() => {
        // 如果有其他模块，也一并清除
        this.$_u.store.reset(['base', 'user'])
        this.$_u.tips.success('退出登录成功')
        //  跳转到登录页
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/user/login' })
        }, 1500)
      })
    },
    toLogin() {
      uni.reLaunch({ url: '/pages/user/login' })
    }
  }
}
</script>

<style>
.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 50rpx auto 50rpx auto;
}
.group-title {
  position: relative;
  padding-left: 30rpx;
  margin-bottom: 15rpx;
  font-size: 35rpx;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 30rpx 0;
  color: #19be6b;
  line-height: 50rpx;
}

.group-title:after {
  position: absolute;
  top: 0;
  width: 10rpx;
  height: 50rpx;
  /* #ifndef APP-NVUE */
  content: '';
  /* #endif */
  left: 0;
  border-radius: 10px;
  background-color: #19be6b;
}
.login-status {
  position: absolute;
  right: 30rpx;
  bottom: 70rpx;
}
</style>
