<template>
  <view class="config-demo">
    <view v-if="$slots.demo" class="config-demo-item">
      <view class="title is-mgb-20">演示</view>
      <slot name="demo" />
    </view>
    <view v-if="list.length > 0" class="is-mgtb-20">
      <u-divider half-width="100%">参数配置</u-divider>
    </view>
    <view class="config-demo-item" v-for="(item, index) in list" :key="index">
      <view class="title">{{ item.title }}</view>
      <view v-if="item.tips" class="tips">{{ item.tips }}</view>
      <u-radio-group v-if="item.layout === 'radio'">
        <u-radio
          v-for="(item2, index2) in item.list"
          :key="index2"
          :name="item2 | _isno"
          @change="radioChange(item.type, item2)"
        >
          {{ item2 | _isno }}
        </u-radio>
      </u-radio-group>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default() {
        return
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    radioChange(key, value) {
      this.$emit('input', { ...this.value, ...{ [key]: value } })
      this.$emit('change', { key, value })
    }
  }
}
</script>

<style lang="scss">
.config-demo {
  .config-demo-item {
    border: 1px solid #f3f4f5;
    padding: 30rpx 20rpx;
    margin-top: 30rpx;

    .title {
      position: relative;
      padding-left: 30rpx;
      margin-bottom: 15rpx;
      font-size: 30rpx;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .title:after {
      position: absolute;
      top: 0;
      width: 10rpx;
      height: 40rpx;
      /* #ifndef APP-NVUE */
      content: '';
      /* #endif */
      left: 0;
      border-radius: 10px;
      background-color: $u-type-primary;
    }

    .tips {
      color: $u-type-error;
      padding: 10rpx 0;
      font-size: 24rpx;
    }
  }
}
</style>
