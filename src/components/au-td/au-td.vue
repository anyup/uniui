<template>
  <view class="au-td" :style="[tdStyle]" :class="{ 'au-td-ellipsis': ellipsis }">
    <view :class="{ 'au-td-ellipsis': ellipsis }"><slot></slot></view>
  </view>
</template>

<script>
/**
 * td td单元格
 * @description 表格组件一般用于展示大量结构化数据的场景（搭配au-table使用）
 * @tutorial https://www.uviewui.com/components/table.html#td-props
 * @property {String Number} width 单元格宽度百分比或者具体带单位的值，如30%， 200rpx等，一般使用百分比，单元格宽度默认为均分tr的长度（默认auto）
 * @example <au-td>二年级</au-td>
 */
export default {
  name: 'au-td',
  props: {
    // 宽度，百分比或者具体带单位的值，如30%， 200rpx等，一般使用百分比
    width: {
      type: [Number, String],
      default: 'auto'
    },
    ellipsis: {
      type: [Boolean, String],
      default: false
    }
  },
  data() {
    return {
      tdStyle: {}
    }
  },
  created() {
    this.parent = false
  },
  mounted() {
    this.parent = this.$u.$parent.call(this, 'au-table')
    if (this.parent) {
      // 将父组件的相关参数，合并到本组件
      let style = {}
      if (this.width != 'auto') style.flex = `0 0 ${this.width}`
      style.textAlign = this.parent.align
      style.fontSize = this.parent.fontSize + 'rpx'
      style.padding = this.parent.padding
      style.borderBottom = `solid 1px ${this.parent.borderColor}`
      style.borderRight = `solid 1px ${this.parent.borderColor}`
      style.color = this.parent.color
      Object.assign(style, this.parent.tdStyle)
      this.tdStyle = style
    }
  }
}
</script>

<style lang="scss" scoped>
// 定义混入指令，用于在非nvue环境下的flex定义，因为nvue没有display属性，会报错
@mixin vue-flex($direction: row) {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: $direction;
  /* #endif */
}

.au-td {
  @include vue-flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  font-size: 28rpx;
  color: $u-content-color;
  align-self: stretch;
  box-sizing: border-box;
  word-break: break-all;
  height: auto;
}
.au-td-ellipsis {
  overflow: hidden;
  white-space: nowrap !important;
  text-overflow: ellipsis;
}
</style>
