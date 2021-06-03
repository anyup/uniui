<template>
  <view v-if="pageShow" class="au-layout" :style="[styles]" @click="clickWrapper">
    <slot></slot>
    <!-- loading -->
    <au-loading :visible="loading"></au-loading>
    <!--toast提示-->
    <au-toast ref="toast"></au-toast>
  </view>
</template>

<script>
export default {
  name: 'AuLayout',
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
    }
  },
  watch: {
    toast: {
      deep: true,
      handler: function (newValue) {
        if (newValue && newValue.title) {
          this.showToast(newValue.title, newValue.icon)
        }
      }
    }
  },
  methods: {
    // toast提示
    showToast(title, icon, options = {}) {
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
