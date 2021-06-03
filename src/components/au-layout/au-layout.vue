<template>
  <view v-if="pageShow" class="au-layout" :style="[styles]" @click="clickWrapper">
    <slot></slot>
    <!-- loading -->
    <au-loading :visible="loading"></au-loading>
    <!--toast提示-->
    <au-toast ref="toast"></au-toast>
    <!-- update版本更新 -->
    <au-updater ref="updater" v-if="isConfig('updater')" :auto="autoUpdate"></au-updater>
  </view>
</template>

<script>
export default {
  name: 'AuLayout',
  components: {},
  props: {
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
    // 是否检测登录
    checkLogin: {
      type: Boolean,
      default: true
    },
    // 配置项 逗号分隔拼接字符串：networkbar,updater
    config: {
      type: String,
      default: ''
    },
    // 是否自动检测版本更新
    autoUpdate: {
      type: Boolean,
      default: false
    },
    // 点击次数
    clickTimes: {
      type: Number,
      default: 10
    },
    // loading
    loading: {
      type: Boolean,
      default: false
    },
    // toast
    toast: {
      type: Object,
      default() {
        return {}
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
    pageShow() {
      return !this.checkLogin || (this.checkLogin && this.g_token)
    }
  },
  watch: {
    toast: {
      deep: true,
      handler: function (newValue) {
        if (newValue && newValue.title) {
          this.toast(newValue.title, newValue.icon)
        }
      }
    }
  },
  methods: {
    // 是否有此配置项
    isConfig(key) {
      return this.config.indexOf(key) > -1
    },
    // 检测版本更新
    checkUpdate(showtip = false) {
      if (this.isConfig('updater')) {
        this.$refs.updater.checkUpdate(showtip)
      }
    },
    // toast提示
    toast(title, icon, options = {}) {
      let { content = '', duration = 2000 } = options
      this.$refs.toast.show({ title, icon, content, duration })
    },
    // 区域点击
    clickWrapper: (function () {
      let times = 0
      let timeId = 0
      return function (e) {
        times++
        timeId && clearTimeout(timeId)
        if (times === clickTimes) {
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
  overflow-y: auto;

  .pop-wrap {
    padding: 0 20rpx;
    text-align: left;
    position: relative;
  }

  .pop-title {
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
    font-weight: 500;
  }

  .icon-clear {
    position: absolute;
    left: 20rpx;
    top: 28rpx;
  }

  .log-item {
    color: #666;
    padding: 10rpx 0;
    border-bottom: 1px solid #eee;
    word-break: break-all;
  }
}
</style>
