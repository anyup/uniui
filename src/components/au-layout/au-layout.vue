<template>
  <view v-if="pageShow" class="au-layout" :style="[styles]" @click="clickWrapper">
    <slot></slot>
    <!-- loading -->
    <au-loading :visible="auLoading" :text="loadingText"></au-loading>
    <!--toast提示-->
    <au-toast ref="toast" :toast="auToast"></au-toast>
    <!-- #ifdef APP-PLUS -->
    <au-updater v-bind="$attrs" v-on="$listeners"> </au-updater>
    <!-- #endif -->
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
    },
    // 是否显示加载框
    loading: {
      typd: Boolean,
      default: false
    },
    // 是否显示toast
    toast: {
      type: Object,
      default() {
        return { title: '操作成功', icon: 'none', content: '', duration: 2000 }
      }
    },
    // updater 请求配置
    updaterReauest: {
      type: Object,
      default() {
        return { header: '', url: '', params: '', method: '' }
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    styles() {
      const bg = { 'background-color': this.bgColor }
      return { ...bg, ...this.customStyle }
    },
    auToast() {
      return typeof this.g_au_toast === 'undefined' ? this.toast : this.g_au_toast
    },
    auLoading() {
      return typeof this.g_au_loading === 'undefined' ? this.loading : this.g_au_loading
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
  min-height: 100%;
  box-sizing: border-box;
  color: $u-main-color;
}
</style>
