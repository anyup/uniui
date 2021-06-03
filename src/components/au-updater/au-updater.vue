<template>
  <view @touchmove.stop.prevent>
    <view class="au-updater-modal-box" :class="[modalVisible ? 'au-updater-modal-normal' : 'au-updater-modal-scale', modalVisible ? 'au-updater-modal-show' : '']">
      <view>
        <view class="au-updater-modal-title">{{ modalTitle }}</view>
        <view class="au-updater-modal-content">
          <view class="is-text-left">
            <view v-for="(item, index) in modalContent" :key="index">{{ item }}</view>
          </view>
        </view>
        <view class="au-updater-modalBtn-box">
          <button v-if="!isForce" class="au-updater-modal-btn au-updater-gray-outline" hover-class="au-updater-outline-hover" @click="closeModal">下次更新</button>
          <button class="au-updater-modal-btn au-updater-primary" hover-class="au-updater-primary-hover" @click="confirmModal">立即更新</button>
        </view>
      </view>
    </view>
    <view class="au-updater-modal-mask" :class="[modalVisible ? 'au-updater-mask-show' : '']" @click="maskClick"></view>
  </view>
</template>

<script>
import { Http } from '../../http'

export default {
  name: 'AuUpdater',
  components: {},
  props: {
    auto: {
      required: false,
      type: Boolean,
      default: false
    },
    reqUrl: {
      required: true,
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
    reqCodeKey: {
      type: String,
      default: 'currentVersion'
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
    this.http = new Http().setHeader(reqHeader)
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
      // #ifdef APP-PLUS
      let versionCode = plus.runtime.versionCode
      reqParam[reqCodeKey] = versionCode
      this.http.request(this.reqUrl, reqParam).then(res => {
        this.$emit('result', res)
      })
      // #endif
    }
  }
}
</script>

<style>
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

.au-updater-flex-column {
  flex-direction: column;
}

.au-updater-modal-btn {
  flex: 1;
  width: 46%;
  height: 76rpx;
  line-height: 76rpx;
  position: relative;
  border-radius: 10rpx;
  font-size: 28rpx;
  overflow: visible;
  margin-left: 0;
  margin-right: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.au-updater-modal-btn + .au-updater-modal-btn {
  margin-left: 30rpx;
}

.au-updater-modal-btn::after {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  left: 0;
  top: 0;
  border-radius: 20rpx;
}

.au-updater-primary {
  background: #16a98c;
  color: #fff;
}

.au-updater-primary-hover {
  background: rgba(22, 169, 140, 0.7);
  color: #e5e5e5;
}

.au-updater-primary-outline {
  color: #16a98c;
  background: none;
}

.au-updater-primary-outline::after {
  border: 1px solid #16a98c;
}

.au-updater-danger {
  background: #ed3f14;
  color: #fff;
}

.au-updater-danger-hover {
  background: #d53912;
  color: #e5e5e5;
}

.au-updater-danger-outline {
  color: #ed3f14;
  background: none;
}

.au-updater-danger-outline::after {
  border: 1px solid #ed3f14;
}

.au-updater-red {
  background: #e41f19;
  color: #fff;
}

.au-updater-red-hover {
  background: #c51a15;
  color: #e5e5e5;
}

.au-updater-red-outline {
  color: #e41f19;
  background: none;
}

.au-updater-red-outline::after {
  border: 1px solid #e41f19;
}

.au-updater-warning {
  background: #ff7900;
  color: #fff;
}

.au-updater-warning-hover {
  background: #e56d00;
  color: #e5e5e5;
}

.au-updater-warning-outline {
  color: #ff7900;
  background: none;
}

.au-updater-warning-outline::after {
  border: 1px solid #ff7900;
}

.au-updater-green {
  background: #19be6b;
  color: #fff;
}

.au-updater-green-hover {
  background: #16ab60;
  color: #e5e5e5;
}

.au-updater-green-outline {
  color: #19be6b;
  background: none;
}

.au-updater-green-outline::after {
  border: 1px solid #19be6b;
}

.au-updater-white {
  background: #fff;
  color: #333;
}

.au-updater-white-hover {
  background: #f7f7f9;
  color: #666;
}

.au-updater-white-outline {
  color: #333;
  background: none;
}

.au-updater-white-outline::after {
  border: 1px solid #333;
}

.au-updater-gray {
  background: #ededed;
  color: #999;
}

.au-updater-gray-hover {
  background: #d5d5d5;
  color: #898989;
}

.au-updater-gray-outline {
  color: #999;
  background: none;
}

.au-updater-gray-outline::after {
  border: 1px solid #999;
}

.au-updater-outline-hover {
  opacity: 0.6;
}

.au-updater-circle-btn {
  border-radius: 40rpx !important;
}

.au-updater-circle-btn::after {
  border-radius: 80rpx !important;
}
</style>
