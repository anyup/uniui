<template>
  <view class="au-layout" :class="{ 'au-layout-clearfix': clearfix }" :style="[styles]" @click="clickWrapper">
    <slot v-if="pageShow"></slot>
    <!-- loading -->
    <au-loading :show="loadingConfig.show" :text="loadingConfig.text" @cancel="$emit('cancel-loading')" />
    <!--toast提示-->
    <au-toast ref="toast" :toast="toastConfig" :duration="toastDuration" :position="toastPosition" @cancel="$emit('cancel-toast')" />
  </view>
</template>

<script>
export default {
  name: 'au-layout',
  components: {},
  props: {
    clearfix: {
      type: Boolean,
      default: true
    },
    // 是否显示页面
    pageShow: {
      type: Boolean,
      default: true
    },
    // 背景色值
    bgColor: {
      type: String,
      default: '#ffffff'
    },
    // 内边距
    padding: {
      type: String,
      default: '0'
    },
    // 页面height
    height: {
      type: String,
      default: ''
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
    // 加载框loading配置
    loading: {
      type: Object,
      default() {
        return { show: false, text: '' }
      }
    },
    // toast配置
    toast: {
      type: Object,
      default() {
        return { title: '操作成功', icon: 'none', content: '' }
      }
    },
    toastDuration: {
      typd: Number,
      default: 2000
    },
    toastPosition: {
      typd: String,
      default: 'center'
    }
  },
  data() {
    return {}
  },
  computed: {
    styles() {
      let style = { 'background-color': this.bgColor, padding: this.padding }
      if (this.height) style.height = this.height
      return { ...style, ...this.customStyle }
    },
    toastConfig() {
      return typeof this.getter_base.toast === 'undefined' ? this.toast : this.getter_base.toast
    },
    loadingConfig() {
      return typeof this.getter_base.loading === 'undefined' ? this.loading : this.getter_base.loading
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
  color: $is-main-color;

  &.au-layout-clearfix:before,
  &.au-layout-clearfix:after {
    content: '';
    display: table;
    clear: both;
  }

  &.au-layout-clearfix {
    zoom: 1;
  }
}
</style>
