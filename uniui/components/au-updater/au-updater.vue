<template>
  <view @touchmove.stop.prevent>
    <view
      class="au-updater-modal-box"
      :class="[
        modalVisible ? 'au-updater-modal-normal' : 'au-updater-modal-scale',
        modalVisible ? 'au-updater-modal-show' : ''
      ]"
    >
      <image class="au-updater-modal-bg" src="../../static/images/updater/bg.png"></image>
      <view class="au-updater-modal-container">
        <scroll-view scroll-y :scroll-top="0" class="au-updater-modal-content">
          <view class="is-text-left">
            <text>{{ modalContent }}</text>
          </view>
        </scroll-view>
        <view v-if="$slots.btn" class="au-updater-modal-btn-box">
          <slot name="btn"></slot>
        </view>
        <view v-else class="au-updater-modal-btn-box">
          <view v-if="!isForce" class="is-mgr-10 is-flex-1">
            <au-button shape="circle" type="default" size="default" @click="closeModal">
              {{ cancelText }}
            </au-button>
          </view>
          <view class="is-flex-1">
            <au-button type="primary" shape="circle" size="default" @click="confirmModal">{{ confirmText }}</au-button>
          </view>
        </view>
      </view>
    </view>
    <view class="au-updater-modal-mask" :class="[modalVisible ? 'au-updater-mask-show' : '']" @click="maskClick"></view>
  </view>
</template>

<script>
import { Http } from '../../libs/core/class/Http'

export default {
  name: 'au-updater',
  components: {},
  props: {
    auto: {
      type: Boolean,
      default: false
    },
    request: {
      type: Object,
      default() {
        return {
          header: '',
          url: '',
          params: '',
          method: ''
        }
      }
    },
    isForce: {
      type: Boolean,
      default: false
    },
    isHot: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      type: Boolean,
      default: false
    },
    modalTitle: {
      type: String,
      default: '发现新版本'
    },
    confirmText: {
      type: String,
      default: '立即更新'
    },
    cancelText: {
      type: String,
      default: '以后再说'
    }
  },
  data() {
    return {
      modalVisible: false,
      modalContent: '',
      downloadUrl: '',
      versionCode: ''
    }
  },
  mounted() {
    this.http = new Http().setHeader(this.request.header)
    if (this.auto) {
      this.checkUpdate()
    }
  },
  methods: {
    // 遮层点击事件
    maskClick() {
      if (this.isForce) return
      if (!this.maskClosable) return
      this.closeModal()
    },
    // 显示弹窗
    showModal(downloadUrl, modalContent = '发现新版本') {
      this.downloadUrl = downloadUrl
      this.modalContent = modalContent
      this.modalVisible = true
    },
    // 隐藏更新弹窗
    closeModal() {
      this.modalVisible = false
    },
    // 确定更新App
    confirmModal() {
      this.$emit('confirm', { ref: this })
      /* #ifdef APP-PLUS */
      plus.runtime.openURL(this.downloadUrl)
      /* #endif */
    },
    // 检测更新
    checkUpdate() {
      this.http.request(this.request.url, this.request.params, { method: this.request.method }).then(res => {
        this.$emit('result', { data: res, ref: this })
      })
    },
    hotInstall(tempPath) {
      //热更新
      plus.runtime.install(
        tempPath,
        { force: false },
        function () {
          // 安装成功
          setTimeout(() => {
            plus.runtime.restart()
          }, 100)
        },
        function (e) {
          // 安装失败
        }
      )
    }
  }
}
</script>

<style lang="scss">
.au-updater-modal-box {
  position: fixed;
  left: 50%;
  top: 50%;
  margin: auto;
  // background: #fff;
  z-index: 9999998;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  width: 638rpx;
  height: 848rpx;
  border-radius: 24rpx;
  box-sizing: border-box;
  visibility: hidden;
}

.au-updater-modal-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
}

.au-updater-modal-container {
  width: 100%;
  bottom: 0;
  padding: 40rpx 60rpx 30rpx 60rpx;
  min-height: 58%;
  max-height: 100%;
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
}

.au-updater-modal-content {
  text-align: center;
  color: #999;
  font-size: 28rpx;
  margin: 30rpx 0;
  flex: 1;
  max-height: 300rpx;
  display: flex;
  align-items: center;

  text {
    letter-spacing: 1px;
    line-height: 50rpx;
    word-break: break-all;
  }
}

.au-updater-modal-btn-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.au-updater-modal-scale {
  transform: translate(-50%, -50%) scale(0);
}

.au-updater-modal-normal {
  transform: translate(-50%, -50%) scale(1);
}

.au-updater-modal-show {
  opacity: 1;
  visibility: visible;
}

.au-updater-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999996;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  visibility: hidden;
}

.au-updater-mask-show {
  visibility: visible;
  opacity: 1;
}

.is-text-left {
  text-align: left;
}
</style>
