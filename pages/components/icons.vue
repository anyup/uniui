<template>
  <app-layout :empty="true">
    <config-demo :list="list">
      <u-grid :col="4">
        <u-grid-item v-for="(item, index) in icons.list" :key="index" @click="copyText(item)">
          <view class="is-text-center" hover-class="none">
            <u-icon :name="item.name" :size="46" color="#999999"></u-icon>
            <view class="grid-text is-mgt-5" style="font-size: 12px;height: 60rpx;">{{ item.name }}</view>
          </view>
        </u-grid-item>
      </u-grid>
    </config-demo>
  </app-layout>
</template>

<script>
import icons from '@/common/icons'

export default {
  data() {
    return {
      list: [
        {
          title: '说明',
          tips: '图标'
        }
      ],
      icons: icons
    }
  },
  methods: {
    oneIcon() {
      let min = 0
      let max = icons.list.length - 1
      let index = Math.floor(Math.random() * (max - min + 1) + min)
      return icons.list[index].name
    },
    copyText() {}
  }
}
</script>
