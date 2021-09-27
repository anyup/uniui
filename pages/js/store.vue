<template>
  <app-layout>
    <config-demo v-model="value" :list="list" content-height="200rpx">
      <view>姓名：{{ g_userinfo.name }}</view>
      <view>简介：{{ g_userinfo.intro }}</view>
      <view>手机号：{{ g_userinfo.phone }}</view>
    </config-demo>
    <view class="is-pd-20">
      <u-form :model="form" ref="uForm" :label-width="115">
        <u-form-item label="姓名"><u-input v-model="form.name" placeholder="请输入姓名" /></u-form-item>
        <u-form-item label="简介"><u-input v-model="form.intro" placeholder="请输入简介" /></u-form-item>
        <u-form-item label="手机号"><u-input v-model="form.phone" placeholder="请输入手机号" /></u-form-item>
      </u-form>
      <view class="is-mgtb-20 is-flex">
        <view class="is-flex-1">
          <app-button type="default" @click="reset">重置</app-button>
        </view>
        <view style="width: 100rpx"></view>
        <view class="is-flex-1">
          <app-button type="primary" @click="submit">提交</app-button>
        </view>
      </view>
    </view>
  </app-layout>
</template>

<script>
import { Store } from '@/uniui/index'

export default {
  data() {
    return {
      form: {
        name: '',
        intro: '',
        phone: ''
      },
      list: [],
      value: {}
    }
  },
  onLoad() {
    this.form = Object.assign({}, this.g_userinfo || {})
  },
  methods: {
    submit() {
      new Store().set('userinfo', this.form, 'user/commit')
      new Store().set('token', '123')
    },
    reset() {
      new Store().reset(['user'])
    }
  }
}
</script>

<style></style>
