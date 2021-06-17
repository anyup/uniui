<template>
  <view v-if="pageShow" class="au-layout" :style="[styles]" @click="clickWrapper">
    <slot></slot>
    <!-- loading -->
    <au-loading :visible="g_au_loading" :text="loadingText"></au-loading>
    <!--toast提示-->
    <au-toast ref="toast"></au-toast>
  </view>
</template>

<script>
export default {
  name: 'au-layout',
  components: {},
  props: {
    // 是否显示页面
    pageShow: {
      type: Boolean,
      default: true
    },
    // 背景色值
    bgColor: {
      type: String,
      default: '#f3f4f5'
    },
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    // 点击次数
    clickTimes: {
      type: Number,
      default: 10
    },
    // 加载文案
    loadingText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    styles() {
      const bg = { 'background-color': this.bgColor }
      return { ...bg, ...this.customStyle }
    }
  },
  methods: {
    // 区域点击
    clickWrapper: (function () {
      let times = 0
      let timeId = 0
      return function (e) {
        times++
        timeId && clearTimeout(timeId)
        if (times === this.clickTimes) {
          this.$emit('page-click')
        }
        timeId = setTimeout(() => {
          times = 0
        }, 100)
      }
    })()
  }
}
</script>

<style lang="scss">
.au-layout {
  position: relative;
  font-size: 28rpx;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  color: $u-main-color;
}
</style>
