<template>
  <app-layout>
    <config-demo :list="list" @change="onChange">
      <app-button slot="demo" type="primary" @click="value.visible = true">显示加载框</app-button>
    </config-demo>
    <au-loading
      :text="value.text"
      :visible="value.visible"
      :direction="value.direction"
      :duration="value.duration"
      :cancel-time="value.cancelTime"
    />
  </app-layout>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          type: 'direction',
          title: '方向',
          layout: 'radio',
          list: ['veritical', 'horizontal']
        },
        {
          type: 'text',
          title: '文案',
          layout: 'radio',
          list: ['加载中', 'loading']
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
          layout: 'radio',
          list: [3000, 5000]
        }
      ],
      value: {
        visible: false,
        direction: 'veritical',
        text: '加载中',
        duration: 3000,
        cancelTime: 3000
      }
    }
  },
  methods: {
    onChange({ key, value }) {
      this.value[key] = value
    }
  }
}
</script>

<style lang="scss"></style>
