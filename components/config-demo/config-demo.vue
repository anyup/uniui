<template>
  <view class="config-demo" :style="height ? `height: ${height};` : ''">
    <view v-if="tips || $slots.default" class="config-demo-item">
      <view class="title">{{ title }}</view>
      <text v-if="tips" class="tips">{{ tips }}</text>
      <view class="is-mgt-10" :style="{ height: contentHeight, 'text-align': align }">
        <slot />
      </view>
    </view>
    <view v-if="list.length > 0" class="is-mgtb-20">
      <u-divider half-width="100%">参数配置</u-divider>
    </view>
    <view class="config-demo-item" v-for="(item, index) in list" :key="index">
      <view class="title">{{ item.title }}</view>
      <text v-if="item.tips" class="tips">{{ item.tips }}</text>
      <u-radio-group v-if="item.layout === 'radio'" :value="item.list[0] | _yn" shape="square" size="40">
        <u-radio
          v-for="(item2, index2) in item.list"
          :key="index2"
          :name="item2 | _yn"
          active-color="#2979ff"
          @change="radioChange(item.type, item2)"
        >
          {{ item2 | _yn }}
        </u-radio>
      </u-radio-group>
      <view v-else-if="item.layout === 'button'">
        <au-button
          v-for="(item2, index2) in item.list"
          :key="index2"
          type="primary"
          @click="$emit('btn-click', { type: item.type, index: index2 })"
        >
          {{ item2 }}
        </au-button>
      </view>
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
    title: {
      type: String,
      default: '演示'
    },
    tips: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    height: {
      type: String,
      default: 'auto'
    },
    contentHeight: {
      type: String,
      default: ''
    },
    align: {
      type: String,
      default: 'center'
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
    border: 1px dashed #2979ff;
    padding: 30rpx 30rpx;
    margin-top: 30rpx;
    border-radius: 7px;

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
      display: block;
      color: $u-type-error;
      padding: 10rpx 0 20rpx 0;
      font-size: 24rpx;
    }
  }
}
</style>
