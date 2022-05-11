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
      <view class="au-updater-modal-title">
        <view>{{ modalTitle }}</view>
        <text v-if="versionName">{{ versionName }}</text>
      </view>
      <view class="au-updater-modal-container">
        <scroll-view scroll-y :scroll-top="0" class="au-updater-modal-content">
          <view v-if="flag !== 0" class="is-flex is-align-center is-justify-center">
            <au-circle-progress type="primary" :percent="percent">
              <view class="is-flex is-align-center is-justify-center">
                <text class="auicon-iconfont auicon-iconfont-dowanload-cloud"></text>
              </view>
            </au-circle-progress>
          </view>
          <view v-else class="is-text-left">
            <text>{{ modalContent }}</text>
          </view>
        </scroll-view>

        <view v-if="$slots.btn" class="au-updater-modal-btn-box">
          <slot name="btn"></slot>
        </view>
        <view v-else class="au-updater-modal-btn-box">
          <view v-if="!force" class="is-mgr-10 is-flex-1">
            <au-button shape="circle" type="default" size="default" @click="closeModal">
              {{ cancelText }}
            </au-button>
          </view>
          <view class="is-flex-1">
            <au-button :disabled="flag === 2" type="primary" shape="circle" size="default" @click="confirmModal">
              {{ confirmText }}
            </au-button>
          </view>
        </view>
      </view>
    </view>
    <view class="au-updater-modal-mask" :class="[modalVisible ? 'au-updater-mask-show' : '']" @click="maskClick"></view>
  </view>
</template>

<script>
import { Http } from '../../libs/core/class/Http'
import { Downloader } from '../../libs/core/class/Downloader'
import auCircleProgress from '../au-circle-progress/au-circle-progress.vue'

export default {
  name: 'au-updater',
  components: { auCircleProgress },
  props: {
    auto: {
      type: Boolean,
      default: false
    },
    request: {
      type: [Object, Array],
      default() {
        return {
          header: '',
          url: '',
          params: '',
          method: ''
        }
      }
    },
    force: {
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
      versionCode: '',
      versionName: '',
      isHot: false,
      http: [],
      percent: 0, // 下载百分比
      flag: 0 // -1.下载失败，1.下载完成，2.下载中
    }
  },
  computed: {
    requests() {
      return Array.isArray(this.request) ? this.request : [this.request]
    }
  },
  watch: {
    modalVisible(newValue, oldValue) {
      if (newValue) {
        if (this.force) uni.hideTabBar()
      } else {
        uni.showTabBar()
      }
    }
  },
  mounted() {
    this.requests.forEach(r => {
      this.http.push(new Http().setHeader(r.header))
    })
    if (this.auto) {
      this.checkUpdate()
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
    showModal({ url, content, isHot, versionName }) {
      this.downloadUrl = url
      this.modalContent = content
      this.isHot = isHot
      this.versionName = versionName
      this.modalVisible = true
    },
    // 隐藏更新弹窗
    closeModal() {
      this.modalVisible = false
    },
    // 确定更新App
    confirmModal() {
      this.$emit('confirm', { url: this.downloadUrl, ref: this })
      if (this.isHot) {
        this.hotUpdate(this.downloadUrl)
        return
      }
    },
    // 检测更新
    checkUpdate() {
      let promises = []
      this.requests.forEach((r, i) => {
        const { url, params, method } = r
        promises.push(this.http[i].request(url, params, { method }))
      })
      Promise.all(promises).then(values => {
        const data = Array.isArray(this.request) ? values : values[0]
        this.$emit('result', { data, ref: this })
      })
    },
    // 热更新
    hotUpdate(url) {
      this.download(url)
    },
    // 下载包
    download(url) {
      this.flag = 2
      new Downloader.Builder(url).start({
        success: filePath => {
          this.flag = 1
          this.percent = 100
          this.hotInstall(filePath)
        },
        fail: err => {
          this.flag = -1
          this.$emit('error', err)
        },
        progress: p => {
          this.percent = p
        }
      })
    },
    //热更新
    hotInstall(tempPath) {
      plus.runtime.install(
        tempPath,
        { force: true },
        function () {
          setTimeout(() => {
            plus.runtime.restart()
          }, 100)
        },
        function (e) {
          // 安装失败
          this.$emit('error', e)
        }
      )
    }
  }
}
</script>

<style lang="scss">
@import '../../libs/css/iconfont.css';

.au-updater-modal-box {
  position: fixed;
  left: 50%;
  top: 50%;
  margin: auto;
  background: #fff;
  z-index: 9999998;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  width: 600rpx;
  border-radius: 12px;
  box-sizing: border-box;
  visibility: hidden;
}

.au-updater-modal-bg {
  width: 600rpx;
  height: 332rpx;
  border-radius: 12px;
  position: absolute;
}

.au-updater-modal-title {
  position: absolute;
  color: #fff;
  top: 60rpx;
  left: 40rpx;

  view {
    font-size: 50rpx;
  }
  text {
    display: block;
    font-size: 30rpx;
    padding: 20rpx 10rpx;
  }
}

.au-updater-modal-container {
  width: 100%;
}

.au-updater-modal-content {
  text-align: center;
  color: #999;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  margin-top: 340rpx;
  margin-bottom: 130rpx;
  min-height: 280rpx;
  max-height: 400rpx;
  padding: 0 30rpx;
  box-sizing: border-box;

  text {
    letter-spacing: 1px;
    line-height: 50rpx;
    word-break: break-all;
  }
}

.au-updater-modal-btn-box {
  position: absolute;
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
