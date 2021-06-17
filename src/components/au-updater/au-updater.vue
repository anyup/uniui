<template>
  <view @touchmove.stop.prevent>
    <view class="au-updater-modal-box" :class="[modalVisible ? 'au-updater-modal-normal' : 'au-updater-modal-scale', modalVisible ? 'au-updater-modal-show' : '']">
      <view>
        <view class="au-updater-modal-title">{{ modalTitle }}</view>
        <view class="au-updater-modal-content">
          <view class="is-text-left">
            <view v-for="(item, index) in modalContent" :key="index" class="is-mgt-5">{{ item }}</view>
          </view>
        </view>
        <view class="au-updater-modalBtn-box">
          <view class="au-updater-modal-btn default" @click="closeModal">下次更新</view>
          <view class="au-updater-modal-btn primary" @click="confirmModal">立即更新</view>
        </view>
      </view>
    </view>
    <view class="au-updater-modal-mask" :class="[modalVisible ? 'au-updater-mask-show' : '']" @click="maskClick"></view>
  </view>
</template>

<script>
import { Http } from '../../../index'

export default {
  name: 'au-updater',
  components: {},
  props: {
    auto: {
      type: Boolean,
      default: false
    },
    reqUrl: {
      type: String,
      default: ''
    },
    reqParam: {
      type: Object,
      default() {
        return {}
      }
    },
    reqMethod: {
      type: String,
      default: 'POST'
    },
    reqHeader: {
      type: Object,
      default() {
        return {}
      }
    },
    isForce: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      type: Boolean,
      default: false
    },
    modalTitle: {
      type: String,
      default: '版本更新'
    }
  },
  data() {
    return {
      modalVisible: false,
      modalContent: [],
      downloadUrl: '',
      versionCode: ''
    }
  },
  mounted() {
    this.http = new Http().setHeader(this.reqHeader)
    if (this.auto) {
      this.checkUpdate()
    }
  },
  methods: {
    // 遮层点击事件
    maskClick() {
      if (!this.maskClosable) return
      this.closeModal()
    },
    // 显示弹窗
    showModal(downloadUrl, modalContent = ['发现新版本']) {
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
      plus.runtime.openURL(this.downloadUrl)
    },
    // 检测更新
    checkUpdate() {
      this.http.request(this.reqUrl, this.reqParam, { method: this.reqMethod }).then(res => {
        this.$emit('result', { data: res, ref: this })
      })
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
  background: #fff;
  z-index: 9999998;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  width: 84%;
  padding: 40rpx 64rpx;
  border-radius: 24rpx;
  box-sizing: border-box;
  visibility: hidden;
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

.au-updater-modal-title {
  text-align: center;
  font-size: 34rpx;
  color: #333;
  padding: 10rpx 0;
  font-weight: bold;
}

.au-updater-modal-content {
  text-align: center;
  color: #999;
  font-size: 28rpx;
  padding-top: 20rpx;
  padding-bottom: 40rpx;
}

.au-updater-modalBtn-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.au-updater-modal-btn {
  position: relative;
  border: 0;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 24rpx 28rpx;
  z-index: 1;
  box-sizing: border-box;
  -webkit-transition: all 0.15s;
  transition: all 0.15s;
  font-size: 28rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -webkit-appearance: none;
  border-radius: 5px;
  width: 40%;
}

.au-updater-modal-btn.default {
  border: 1px solid $is-border-color;
  color: $is-main-color;
  border-color: $is-border-color;
  background-color: #fff;
}

.au-updater-modal-btn.primary {
  border-color: $is-type-primary;
  background-color: $is-type-primary;
  color: #fff;
}

.au-updater-modal-btn:hover {
  opacity: 0.7;
}
</style>
