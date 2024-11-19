<template>
  <app-layout>
    <config-demo v-model="value" :list="list">
      <app-button type="primary" @click="requestDemo">发起请求</app-button>
      <app-button v-if="false" class="is-mgt-10" type="primary" @click="requestLogin">登录请求</app-button>

      <view class="is-text-left" v-if="showView">
        <view class="is-mgt-10">请求拦截：</view>
        <block v-for="(key, index) in Object.keys(view)" :key="index">
          <view v-if="!isFunction(view[key])" class="json-item" :class="key">{{ key }}：{{ view[key] }}</view>
        </block>
      </view>
    </config-demo>
    <view class="bottom"></view>
  </app-layout>
</template>

<script>
import { Http } from '@/uniui'
import userApi from '@/api/modules/user'

export default {
  data() {
    return {
      http: new Http(),
      view: {},
      value: {
        baseURL: 'https://api.demo.com',
        method: 'get',
        header: 'token1',
        url: '/user/login'
      },
      list: [
        {
          type: 'baseURL',
          title: 'baseURL',
          tips: '设置统一请求接口地址',
          layout: 'radio',
          list: ['https://api.demo.com', 'http://api.example.com']
        },
        {
          type: 'method',
          title: 'method',
          tips: '请求方式',
          layout: 'radio',
          list: ['get', 'post', 'put', 'patch', 'head', 'delete']
        },
        {
          type: 'url',
          title: 'url',
          tips: '接口地址',
          layout: 'radio',
          list: ['/user/login', '/user/logout']
        },
        {
          type: 'header',
          title: '请求header token',
          layout: 'radio',
          list: ['token1', 'token2']
        }
      ]
    }
  },
  onLoad() {
    this.setInterceptor()
  },
  computed: {
    showView() {
      return Object.keys(this.view).length > 0
    }
  },
  methods: {
    isFunction(func) {
      return typeof func === 'function'
    },
    async requestDemo() {
      const config = this.$u.deepClone(this.value)
      config.header = { token: config.header }
      const params = {
        data: { name: 'admin' },
        ...config
      }
      console.log(params)
      this.http.request(params)
    },

    async requestLogin() {
      await userApi.login({ name: 'admin' }, { method: 'get' })
    },

    setInterceptor() {
      // 请求前
      this.http.interceptors.request.use(
        request => {
          this.view = request
          return request
        },
        error => Promise.resolve(error)
      )
      // 请求后
      this.http.interceptors.response.use(
        response => {
          return Promise.resolve(response)
        },
        error => {
          return Promise.reject(error)
        },
        complete => {
          console.log('complete', complete)
        }
      )
    }
  }
}
</script>

<style lang="scss">
.json-item {
  word-break: break-all;
  padding: 10rpx;
  border: 1rpx solid #eee;
  margin-top: 15rpx;
  border-radius: 5px;
}
.baseURL {
  background-color: rgb(209, 171, 126);
  color: #fff;
}
.url {
  background-color: rgb(152, 183, 227);
  color: #fff;
}
.method {
  background-color: rgb(133, 187, 125);
  color: #fff;
}
.header {
  background-color: rgb(220, 163, 229);
  color: #fff;
}
.bottom {
  width: 100%;
  height: 130px;
}
</style>
