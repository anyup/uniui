<template>
  <app-layout>
    <config-demo v-model="value" :list="list">
      <app-button type="primary" @click="value.show = true">显示加载框</app-button>
    </config-demo>
    <au-loading
      :text="value.text"
      :show="value.show"
      :direction="value.direction"
      :duration="value.duration"
      :cancel-time="value.cancelTime"
      @cancel="value.show = false"
    />
  </app-layout>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          type: 'text',
          title: '文案',
          layout: 'radio',
          list: ['加载中', 'loading']
        },
        {
          type: 'direction',
          title: '方向',
          tips: '垂直方向或水平方向显示',
          layout: 'radio',
          list: ['veritical', 'horizontal']
        },
        {
          type: 'duration',
          title: '显示时间',
          tips: '单位毫秒，0为一直显示',
          layout: 'radio',
          list: [3000, 5000]
        },
        {
          type: 'cancelTime',
          title: '可取消时间',
          tips: '超过规定时间，点击遮罩可关闭弹窗，配合cancel事件使用，单位毫秒',
          layout: 'radio',
          list: [3000, 5000]
        }
      ],
      value: {
        show: false,
        direction: 'veritical',
        text: '加载中',
        duration: 3000,
        cancelTime: 3000
      }
    }
  }
}
</script>
