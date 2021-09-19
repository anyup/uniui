<template>
  <app-layout>
    <config-demo :list="list">
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
    </config-demo>
  </app-layout>
</template>

<script>
import { checker } from '@/uniui'

export default {
  data() {
    return {
      form: {
        name: '',
        intro: '',
        phone: ''
      },
      list: []
    }
  },
  methods: {
    reset() {
      this.form = {
        name: '',
        intro: '',
        phone: ''
      }
    },
    submit() {
      let rules = [
        {
          name: 'name',
          rule: ['required'],
          msg: ['请输入姓名']
        },
        {
          name: 'intro',
          rule: ['required'],
          msg: ['请输入简介']
        },
        {
          name: 'phone',
          rule: ['required', '!isMobile'],
          msg: ['请输入手机号', '请输入正确手机号']
        }
      ]
      let checkRes = checker.validation(this.form, rules)
      if (checkRes) {
        this.$tips.toast(checkRes, 'info')
        return
      }
      this.$tips.toast('校验成功', 'success')
    }
  }
}
</script>
