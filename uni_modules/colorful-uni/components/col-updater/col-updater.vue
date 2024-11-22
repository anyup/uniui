<template>
  <view @touchmove.stop.prevent>
    <view
      class="col-updater-modal-box"
      :class="[
        modalIcon ? '' : 'col-updater-hide-bg',
        modalVisible ? 'col-updater-modal-normal' : 'col-updater-modal-scale',
        modalVisible ? 'col-updater-modal-show' : ''
      ]"
    >
      <image class="col-updater-modal-bg" :src="bgImg"></image>
      <view class="col-updater-modal-title">
        <view>{{ modalTitle }}</view>
        <text v-if="modalExtra">{{ modalExtra }}</text>
      </view>
      <view class="col-updater-modal-container">
        <scroll-view scroll-y :scroll-top="0" class="col-updater-modal-content">
          <view v-if="flag !== 0" class="is-flex is-align-center is-justify-center">
            <col-circle-progress type="primary" :percent="percent">
              <view class="is-flex is-align-center is-justify-center">
                <text class="auicon-iconfont auicon-iconfont-dowanload-cloud"></text>
              </view>
            </col-circle-progress>
          </view>
          <view v-else class="is-text-left">
            <text>{{ modalContent }}</text>
          </view>
        </scroll-view>

        <view v-if="$slots.btn" class="col-updater-modal-btn-box">
          <slot name="btn"></slot>
        </view>
        <view v-else class="col-updater-modal-btn-box">
          <view v-if="!force" class="is-mgr-10 is-flex-1">
            <col-button shape="circle" type="default" size="default" @click="closeModal">
              {{ cancelText }}
            </col-button>
          </view>
          <view class="is-flex-1">
            <col-button :disabled="flag === 2" type="primary" shape="circle" size="default" @click="confirmModal">
              {{ confirmText }}
            </col-button>
          </view>
        </view>
      </view>
    </view>
    <view class="col-updater-modal-mask" :class="[modalVisible ? 'col-updater-mask-show' : '']" @click="maskClick"></view>
  </view>
</template>

<script>
import { Http } from '../../core/class/Http'
import { Downloader } from '../../core/class/Downloader'
import { Optimize } from '../../core/class/Optimize'
import auCircleProgress from '../col-circle-progress/col-circle-progress.vue'
import bgImg from './img'

const optimize = new Optimize.Builder(500)

function isPromise(d) {
  return d && d.then && d.catch
}

function isFunction(d) {
  return typeof d === 'function'
}

export default {
  name: 'col-updater',
  components: { auCircleProgress },
  props: {
    // 是否自动检测更新
    auto: {
      type: Boolean,
      default: false
    },
    // 请求配置 header, url, params, method
    request: {
      type: [Object, Function, Promise],
      default() {
        return undefined
      }
    },
    // 静默更新，仅热更新支持
    slient: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      type: Boolean,
      default: false
    },
    // 弹窗标题
    modalTitle: {
      type: String,
      default: '发现新版本'
    },
    // 弹窗背景是否展示
    modalIcon: {
      type: Boolean,
      default: false
    },
    // 弹窗确认文案
    confirmText: {
      type: String,
      default: '立即更新'
    },
    // 弹窗取消文案
    cancelText: {
      type: String,
      default: '以后再说'
    }
  },
  data() {
    return {
      bgImg,
      modalVisible: false,
      modalContent: '',
      downloadUrl: '',
      versionCode: '',
      modalExtra: '',
      force: false,
      hot: false,
      functions: [],
      percent: 0, // 下载百分比
      flag: 0 // -1.下载失败，1.下载完成，2.下载中
    }
  },
  computed: {
    getRequest() {
      if (isFunction(this.request)) {
        return this.request
      }
      if (isPromise(this.request)) {
        return () => this.request
      }
      if (this.request) {
        const { url, method, header, params } = this.request
        return () => new Http().setHeader(header).request(url, params, { method })
      }
      return () => {}
    }
  },
  watch: {
    request: {
      deep: true,
      handler: function (newValue, oldValue) {
        if (newValue && !oldValue && this.auto) {
          this.checkUpdate()
        }
      }
    },
    modalVisible(newValue) {
      if (newValue) {
        if (this.force) uni.hideTabBar()
      } else {
        uni.showTabBar()
      }
    }
  },
  methods: {
    // 遮层点击事件
    maskClick() {
      if (this.force) return
      if (!this.maskClosable) return
      this.closeModal()
    },
    // 显示弹窗
    showModal({ url, version, content, hot, force }) {
      this.downloadUrl = url
      this.modalExtra = version
      this.modalContent = content
      this.hot = hot
      this.force = force
      this.modalVisible = true
    },
    // 隐藏更新弹窗
    closeModal() {
      this.modalVisible = false
      this.$emit('modal-close')
    },
    // 确定更新App
    confirmModal() {
      this.$emit('modal-confirm', this.downloadUrl)
      if (this.hot) {
        this.hotUpdate(this.downloadUrl)
        return
      }
    },
    // 检测更新
    checkUpdate() {
      optimize.debounce(() => {
        this.getRequest()
          .then(data => {
            this.$emit('success', data)
          })
          .catch(error => {
            this.$emit('fail', error)
          })
      })
    },
    // 热更新
    hotUpdate(url) {
      this.download(url)
    },
    // 下载包
    download(url) {
      this.flag = 2
      try {
        new Downloader.Builder(url).start({
          success: filePath => {
            this.flag = 1
            this.percent = 100
            this.$emit('download-success')
            this.hotInstall(filePath)
          },
          fail: err => {
            this.flag = -1
            this.$emit('download-fail', err)
          },
          progress: p => {
            this.percent = p
            this.$emit('download-progress', p)
          }
        })
      } catch (error) {
        this.$emit('download-fail', error)
      }
    },
    // 热更新
    hotInstall(tempPath) {
      try {
        plus.runtime.install(
          tempPath,
          { force: true },
          function () {
            setTimeout(() => {
              plus.runtime.restart()
            }, 100)
          },
          function (error) {
            // 安装失败
            this.$emit('install-fail', error)
          }
        )
      } catch (error) {
        this.$emit('install-fail', error)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../css/iconfont.css';

.col-updater-modal-box {
  position: fixed;
  left: 50%;
  top: 50%;
  margin: auto;
  background: #fff;
  z-index: 9999998;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  width: 600rpx;
  border-radius: 17px 17px 12px 12px;
  box-sizing: border-box;
  visibility: hidden;
}

.col-updater-modal-bg {
  position: absolute;
  z-index: 8;
  width: 600rpx;
  height: 332rpx;
}

.col-updater-modal-title {
  position: absolute;
  z-index: 9;
  color: #fff;
  top: 60rpx;
  left: 30rpx;

  view {
    font-size: 50rpx;
  }
  text {
    display: block;
    font-size: 30rpx;
    padding: 20rpx 10rpx;
  }
}

.col-updater-modal-container {
  width: 100%;
}

.col-updater-modal-content {
  text-align: center;
  color: #999;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  margin-top: 360rpx;
  margin-bottom: 150rpx;
  min-height: 40rpx;
  max-height: 400rpx;
  padding: 0 30rpx;
  box-sizing: border-box;

  text {
    letter-spacing: 1px;
    line-height: 50rpx;
    word-break: break-all;
  }
}

.col-updater-modal-btn-box {
  position: absolute;
  z-index: 9;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 40rpx;
}

.auicon-iconfont-dowanload-cloud {
  font-size: 60rpx;
  color: $is-type-primary;
}

.col-updater-modal-scale {
  transform: translate(-50%, -50%) scale(0);
}

.col-updater-modal-normal {
  transform: translate(-50%, -50%) scale(1);
}

.col-updater-modal-show {
  opacity: 1;
  visibility: visible;
}

.col-updater-modal-mask {
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

.col-updater-mask-show {
  visibility: visible;
  opacity: 1;
}

.is-text-left {
  text-align: left;
}

.col-updater-hide-bg {
  .col-updater-modal-bg {
    display: none;
  }
  .col-updater-modal-title {
    color: #323232;
  }
  .col-updater-modal-content {
    margin-top: 220rpx;
  }
}
</style>
