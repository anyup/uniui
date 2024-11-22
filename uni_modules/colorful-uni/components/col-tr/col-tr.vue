<template>
  <view>
    <view class="col-tr" :class="{ 'col-tr-fixed': fixed }" @click="$emit('click')">
      <slot></slot>
    </view>
    <view v-if="fixed" :style="{ width: '100%', height: height }"></view>
  </view>
</template>

<script>
/**
 * tr 表格行标签
 * @description 表格组件一般用于展示大量结构化数据的场景（搭配<col-table>使用）
 * @example <col-tr></col-tr>
 */
export default {
  name: 'col-tr',
  props: {
    fixed: {
      type: [Boolean, String],
      default: false
    },
		height: {
			type: String,
      default: '80rpx'
		}
  }
}
</script>

<style lang="scss" scoped>
@import '../../css/mixin.scss';

.col-tr {
  @include vue-flex;
}

.col-tr-fixed {
  position: fixed;
  top: var(--window-top);
  left: 0;
  right: 0;
  z-index: 991;
}
</style>
