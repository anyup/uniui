<template>
  <view class="au-toast" :class="[visible ? 'au-toast-show' : '', content ? 'au-toast-padding' : '', isShowIcon() ? '' : 'au-unicon-padding']" :style="{ width: getWidth() }">
    <text v-if="isShowIcon()" class="au-toast-icon auicon-iconfont" :class="[icon ? `auicon-iconfont-${icon}-circle` : '']"></text>
    <view class="au-toast-text" :class="[isShowIcon() ? '' : 'au-unicon']">{{ title }}</view>
    <view class="au-toast-text au-content-ptop" v-if="content && isShowIcon()">{{ content }}</view>
  </view>
</template>

<script>
export default {
  name: 'auToast',
  props: {},
  data() {
    return {
      timer: null,
      //是否显示
      visible: false,
      //显示标题
      title: '操作成功',
      //显示内容
      content: '',
      //显示icon
      icon: 'none'
    }
  },
  watch: {
    g_toast: {
      deep: true,
      handler: function (newValue) {
        if (newValue && newValue.title) {
          this.show(newValue.title, newValue.icon)
          let { title, icon, content = '', duration = 2000 } = newValue
          this.show({ title, icon, content, duration })
        }
      }
    }
  },
  methods: {
    show: function (options) {
      let { duration = 2000, icon = 'none' } = options
      clearTimeout(this.timer)
      this.visible = true
      this.title = options.title || ''
      this.content = options.content || ''
      this.icon = icon
      this.timer = setTimeout(() => {
        this.visible = false
        clearTimeout(this.timer)
        this.timer = null
      }, duration)
    },
    getWidth() {
      let width = 'auto'
      if (this.isShowIcon()) {
        width = this.content ? '400rpx' : '360rpx'
      }
      return width
    },
    isShowIcon() {
      if (!this.icon) {
        return false
      }
      let icons = ['success', 'info', 'fail']
      return icons.findIndex(item => this.icon === item) >= 0
    }
  }
}
</script>

<style lang="scss">
@import '../../css/iconfont.css';

.au-toast {
  background: rgba(0, 0, 0, 0.75);
  border-radius: 10rpx;
  position: fixed;
  visibility: hidden;
  opacity: 0;
  left: 50%;
  top: 48%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  transition: 0.3s ease-in-out;
  transition-property: opacity, visibility;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 50rpx 20rpx 50rpx 20rpx;
  box-sizing: border-box;
}

.au-toast-padding {
  padding-top: 50rpx !important;
  padding-bottom: 50rpx !important;
}
.au-unicon-padding {
  padding: 24rpx 40rpx !important;
  word-break: break-all;
}

.au-toast-show {
  visibility: visible;
  opacity: 1;
}

.au-toast-icon {
  color: white;
  font-size: 100rpx;
  display: block;
  margin-bottom: 30rpx;
}

.au-toast-text {
  font-size: 30rpx;
  font-weight: 500;
  color: #fff;
  text-align: center;
}
.au-unicon {
  line-height: 40rpx !important;
  font-size: 32rpx !important;
}
.au-content-ptop {
  padding-top: 10rpx;
  font-size: 26rpx !important;
}
</style>
