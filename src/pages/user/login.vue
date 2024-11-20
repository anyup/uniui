<template>
  <app-layout>
    <view class="app-page-wrap">
      <view class="is-flex is-flex-column is-justiry-center">
        <image class="logo-img" mode="aspectFit" src="/static/logo.png"></image>
        <text class="logo-text">用户登录</text>
      </view>
      <form style="width: 80%">
        <view class="is-flex is-mgt-60 is-align-center">
          <u-icon class="is-mgr-10" name="account-fill" size="50" color="#004EA2"></u-icon>
          <u-input v-model="login.username" type="text" :border="true" placeholder="请输入用户名" />
        </view>
        <view class="is-flex is-align-center is-mgt-20">
          <u-icon class="is-mgr-10" name="lock-fill" size="50" color="#004EA2"></u-icon>
          <u-input v-model="login.password" type="password" :border="true" placeholder="请输入密码" />
        </view>
        <!-- 登录提交 -->
        <view class="is-mgt-50">
          <u-button type="primary" @click="handleLogin">模拟登录</u-button>
        </view>
      </form>
    </view>
  </app-layout>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      login: {
        username: uni.getStorageSync('username') || '',
        password: uni.getStorageSync('password') || ''
      }
    }
  },
  methods: {
    // 登录
    handleLogin() {
      uni.hideKeyboard()
      let rules = [
        {
          name: 'username',
          rule: ['required'],
          msg: ['请输入用户名']
        },
        {
          name: 'password',
          rule: ['required'],
          msg: ['请输入密码']
        }
      ]
      //进行表单检查
      const checkRes = this.$_u.checker.validation(this.login, rules)
      if (checkRes) {
        this.$_u.tips.info(checkRes)
        return
      }
      this.testLogin()
    },
    // 模拟登录
    testLogin() {
      let params = {
        username: this.login.username,
        password: this.login.password
      }
      this.$_u.tips.confirm(`用户名：${params.username}\n密码：${params.password}\n是否确认登录？`).then(() => {
        this.$_u.tips.loading('登录中...')
        setTimeout(() => {
          this.$_u.tips.loaded()
          this.$_u.tips.success('登录成功')
        }, 1500)
        setTimeout(() => {
          this.$_u.store.set('token', this.$_u.guid(16), 'user').set('userinfo', params, 'user')
          uni.reLaunch({ url: '/' })
        }, 3000)
      })
    },
    // 接口登录
    httpLogin() {
      let params = {
        username: this.login.username,
        password: this.login.password
      }
      // 如果是真实接口，调用登录接口
      this.$api.user
        .userLogin(params)
        .then(res => {
          if (res.status == 1) {
            this.$_u.tips.success(res.msg)
            this.$_u.store.set('token', res.data.token).set('user', res.data)
            setTimeout(() => {
              uni.reLaunch({ url: '/' })
            }, 2000)
          } else {
            this.$_u.tips.fail(res.msg)
          }
        })
        .catch(e => {
          e.errMsg && this.$_u.tips.fail(e.errMsg)
        })
    }
  }
}
</script>

<style lang="scss">
.app-page-wrap {
  display: flex;
  align-items: center;
  flex-direction: column;
  color: #333;
  text-align: center;
  margin-bottom: 100rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-img {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}
</style>
