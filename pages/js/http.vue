<template>
  <app-layout>
    <config-demo v-model="value" :list="list">
      <app-button type="primary" @click="request">发起请求</app-button>
      <view class="json">{{view}}</view>
    </config-demo>
  </app-layout>
</template>

<script>
import { Http } from '@/uniui'

export default {
  data() {
    return {
      http: new Http(),
      view: '',
      value: {
        baseURL: 'http://api.demo.com',
        method: 'get',
        header: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
      },
      list: [
        {
          type: 'baseURL',
          title: 'baseURL',
          tips: '设置统一请求接口地址',
          layout: 'radio',
          list: ['http://api.demo.com']
        },
        {
          type: 'method',
          title: '请求方式',
          layout: 'radio',
          list: ['get', 'post', 'put', 'patch', 'head', 'delete']
        },
        {
          type: 'header',
          title: '请求header token',
          layout: 'radio',
          list: ['eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9']
        }
      ]
    }
  },
  onLoad() {
    this.setInterceptor()
  },
  methods: {
    request() {
      const config = this.$u.deepClone(this.value)
      config.header = { token: config.header }
      this.http.request('/test', {}, config)
    },
    setInterceptor() {
      // 请求前
      this.http.interceptors.request.use(
        request => {
          this.view = JSON.stringify(request)
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
        }
      )
    }
  }
}
</script>

<style lang="scss">
.json {
  word-break: break-all;
}
</style>
