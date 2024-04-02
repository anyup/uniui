<template>
  <app-layout>
    <!-- #ifdef MP-WEIXIN -->
    <view class="wx-official">
      <official-account @load="bindload" @error="binderror"></official-account>
    </view>
    <!-- #endif -->
    <grid-links v-model="list"></grid-links>
  </app-layout>
</template>

<script>
import datas from './data'

export default {
  data() {
    return {
      list: datas
    }
  },
  methods: {
    bindload(e) {
      console.log('bindload:', e)
    },
    binderror(e) {
      console.log('binderror:', e)
    }
  }
}
</script>

<style lang="scss" scoped></style>
