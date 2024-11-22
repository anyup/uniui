<template>
  <view @touchmove.stop.prevent>
    <view v-if="show" class="col-loading-init" :class="[direction]">
      <view class="col-loading-center"></view>
      <view v-if="text" class="col-loading-tips">{{ text }}</view>
      <!-- <text v-if="closeShow" class="col-icon-close auicon-iconfont auicon-iconfont-fail-circle" @click="loaded()"></text> -->
    </view>
    <view class="col-loading-mask" :class="[show ? 'col-mask-show' : '']" @click="maskClick"></view>
  </view>
</template>

<script>
export default {
  name: 'col-loading',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: 'vertical' // vertical horizontal
    },
    duration: {
      type: Number,
      default: 0
    },
    cancelTime: {
      type: Number,
      default: 10000
    }
  },
  data() {
    return {
      timer: null,
      now: 0,
      closeShow: false
    }
  },
  watch: {
    show: {
      deep: true,
      handler: function (newValue) {
        if (newValue) {
          this.loading()
        }
      }
    }
  },
  methods: {
    startTime() {
      setTimeout(() => {
        this.closeShow = true
      }, this.cancelTime)
    },
    loading() {
      this.startTime()
      clearTimeout(this.timer)
      this.now = new Date().getTime()
      if (this.duration) {
        this.timer = setTimeout(() => {
          this.loaded()
        }, this.duration)
      }
    },
    loaded() {
      this.closeShow = false
      clearTimeout(this.timer)
      this.timer = null
      this.$_u.tips && this.$_u.tips.loaded()
      this.$emit('cancel')
    },
    maskClick() {
      if (new Date().getTime() - this.now > this.cancelTime) {
        this.loaded()
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../css/iconfont.css';

.col-loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 9999996;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  visibility: hidden;
}

.col-mask-show {
  visibility: visible;
  opacity: 1;
}

.col-loading-init {
  position: relative;
  min-width: 200rpx;
  min-height: 200rpx;
  max-width: 500rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  font-size: 30rpx;
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 7px;
  .col-icon-close {
    position: absolute;
    top: 4rpx;
    right: 2rpx;
    color: #ffffff;
    opacity: 0.8;
  }
  &.horizontal {
    flex-direction: row;
    align-items: center;
    justify-content: left;
    width: 600rpx;
    max-width: 600rpx;
    min-height: 150rpx;
    padding-left: 40rpx;
    .col-loading-center {
      width: 70rpx;
      height: 70rpx;
    }
    .col-loading-tips {
      margin-top: 0;
      margin-left: 20rpx;
      font-size: 32rpx;
    }
  }
}

.col-loading-center {
  width: 60rpx;
  height: 60rpx;
  border: 3px solid #fff;
  border-color: #8f8d8e #8f8d8e #8f8d8e #ffffff;
  border-radius: 50%;
  margin: 0 6px;
  display: inline-block;
  vertical-align: middle;
  /* clip-path: polygon(0% 0%, 100% 0%, 100% 60%, 0% 60%); */
  animation: rotate 1s linear infinite;
}

.col-loading-tips {
  text-align: center;
  padding: 0 20rpx;
  box-sizing: border-box;
  margin-top: 36rpx;
}

@-webkit-keyframes rotate {
  from {
    transform: rotatez(0deg);
  }

  to {
    transform: rotatez(360deg);
  }
}

@keyframes rotate {
  from {
    transform: rotatez(0deg);
  }

  to {
    transform: rotatez(360deg);
  }
}
</style>
