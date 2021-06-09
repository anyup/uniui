<template>
  <view>
    <view class="au-tr" :class="{ 'au-tr-fixed': fixed }" @click="$emit('click')">
      <slot></slot>
    </view>
    <view v-if="fixed" :style="{ width: '100%', height: height }"></view>
  </view>
</template>

<script>
/**
 * tr 表格行标签
 * @description 表格组件一般用于展示大量结构化数据的场景（搭配<au-table>使用）
 * @tutorial https://www.uviewui.com/components/table.html
 * @example <au-tr></au-tr>
 */
export default {
  name: 'au-tr',
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

.au-tr {
  @include vue-flex;
	min-height: 80rpx;
}

.au-tr-fixed {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 991;
}
</style>
