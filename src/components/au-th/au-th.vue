<template>
  <view class="au-th" :style="[thStyle]" @click="$emit('click')">
    <slot></slot>
    <text v-if="sort !== 'none'" class="au-sort" :class="sort"></text>
  </view>
</template>

<script>
/**
 * th th单元格
 * @description 表格组件一般用于展示大量结构化数据的场景（搭配u-table使用）
 * @tutorial https://www.uviewui.com/components/table.html#td-props
 * @property {String Number} width 标题单元格宽度百分比或者具体带单位的值，如30%，200rpx等，一般使用百分比，单元格宽度默认为均分tr的长度
 * @example 暂无示例
 */
export default {
  name: 'au-th',
  props: {
    // 宽度，百分比或者具体带单位的值，如30%， 200rpx等，一般使用百分比
    width: {
      type: [Number, String],
      default: ''
    },
    // 是否显示排序 desc:倒序,asc:正序
    sort: {
      type: String,
      default: 'none'
    }
  },
  data() {
    return {
      thStyle: {}
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
      if (this.width) style.flex = `0 0 ${this.width}`
      style.textAlign = this.parent.align
      style.padding = this.parent.padding
      style.borderBottom = `solid 1px ${this.parent.borderColor}`
      style.borderRight = `solid 1px ${this.parent.borderColor}`
      Object.assign(style, this.parent.thStyle)
      this.thStyle = style
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

.au-th {
  @include vue-flex;
  position: relative;
  flex-direction: row;
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: $u-main-color;
  font-weight: bold;
  background-color: rgb(245, 246, 248);
  word-break: break-all;
}

.au-sort {
  margin-left: 5px;
}

.au-sort::before {
  display: block;
  content: '';
  border-width: 5px 5px 5px 5px;
  border-style: solid;
  border-color: transparent transparent #adadad transparent;
}

.au-sort::after {
  display: block;
  content: '';
  border-width: 5px 5px 5px 5px;
  border-style: solid;
  border-color: #adadad transparent transparent transparent;
  margin-top: 3px;
}
.au-sort.asc::before {
  border-color: transparent transparent #666666 transparent;
}
.au-sort.desc::after {
  border-color: #666666 transparent transparent transparent;
}
</style>
