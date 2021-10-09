<template>
  <view @touchmove.stop.prevent>
    <view v-if="show" class="au-loading-init" :class="[direction]">
      <view class="au-loading-center"></view>
      <view v-if="text" class="au-loading-tips">{{ text }}</view>
    </view>
    <view class="au-loading-mask" :class="[show ? 'au-mask-show' : '']" @click="maskClick"></view>
  </view>
</template>

<script>
export default {
  name: 'au-loading',
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
      now: 0
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
    loading() {
      clearTimeout(this.timer)
      this.now = new Date().getTime()
      if (this.duration) {
        this.timer = setTimeout(() => {
          this.loaded()
        }, this.duration)
      }
    },
    loaded() {
      clearTimeout(this.timer)
      this.timer = null
      this.$tips && this.$tips.loaded()
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
.au-loading-mask {
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

.au-mask-show {
  visibility: visible;
  opacity: 1;
}

.au-loading-init {
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
  &.horizontal {
    flex-direction: row;
    align-items: center;
    justify-content: left;
    width: 600rpx;
    max-width: 600rpx;
    min-height: 150rpx;
    padding-left: 40rpx;
    .au-loading-center {
      width: 70rpx;
      height: 70rpx;
    }
    .au-loading-tips {
      margin-top: 0;
      margin-left: 20rpx;
      font-size: 32rpx;
    }
  }
}

.au-loading-center {
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

.au-loading-tips {
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
