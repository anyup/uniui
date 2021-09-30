<template>
  <app-layout>
    <config-demo v-model="value" :list="list" @change="change">
      <au-button type="primary" :throttle-time="0" @click="click">点击</au-button>
      <view class="is-pd-10">点击次数：{{ times }}</view>
    </config-demo>
  </app-layout>
</template>

<script>
import { Pager, Optimize } from '@/uniui/index.js'
export default {
  data() {
    return {
      list: [
        {
          type: 'type',
          title: '优化类型（防抖或节流）',
          tips: '防抖：一定时间内，最后一次操作过设置时间后执行\n节流：一定时间内，只能触发一次',
          layout: 'radio',
          list: ['debounce', 'throttle']
        },
        {
          type: 'timeout',
          title: '延迟时间',
          tips: '单位毫秒',
          layout: 'radio',
          list: [1, 1000, 2000]
        }
      ],
      value: {
        type: 'debounce',
        timeout: 1
      },
      times: 0,
      optimize: new Optimize.Builder(0)
    }
  },
  methods: {
    click() {
      this.optimize[this.value.type](() => {
        this.times++
      })
    },
    change() {
      this.optimize = new Optimize.Builder(this.value.timeout)
    }
  }
}
</script>

<style></style>
