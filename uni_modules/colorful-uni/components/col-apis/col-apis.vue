<template>
  <view class="col-apis">
    <view
      v-for="(item, index) in list"
      :key="index"
      class="api-item"
      @click="onClick(item)"
      hover-class="api-item-hover"
    >
      <view class="api-item_title">{{ item.name }}</view>
      <view v-for="child in item.children" :key="child.id">{{ child.id }}：{{ child.value }}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    onClick(item) {
      let data = { name: item.name }
      item.children.forEach(v => {
        data[v.id] = v.value
      })
      this.$emit('select', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.col-apis {
  .api-item {
    border-bottom: #e3e3e3 1px solid;
    padding: 20rpx;
    font-size: 24rpx;
    color: #777777;

    &_title {
      font-size: 28rpx;
      color: #333333;
    }

    view {
      padding: 5rpx 0;
    }

    &.api-item-hover {
      background-color: #f1f1f1;
    }
  }
}
</style>
