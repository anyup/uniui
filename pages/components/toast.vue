<template>
  <app-layout>
    <config-demo v-model="value" :list="list">
      <app-button type="primary" @click="toast = value">显示</app-button>
    </config-demo>
    <col-toast
      ref="toast"
      :toast="toast"
      :duration="value.duration"
      :position="value.position"
      @cancel="toast = {}"
    ></col-toast>
  </app-layout>
</template>

<script>
export default {
  data() {
    return {
      toast: { title: '操作成功', icon: 'none', content: '', duration: 2000 },
      list: [
        {
          type: 'icon',
          title: '提示图标: icon',
          layout: 'radio',
          list: ['none', 'success', 'info', 'fail']
        },
        {
          type: 'title',
          title: '提示文案: title',
          layout: 'radio',
          list: ['操作成功', 'success']
        },
        {
          type: 'content',
          title: '二级文案: content',
          tips: '只有带图标toast支持',
          layout: 'radio',
          list: ['二级文案1', '二级文案2']
        },
        {
          type: 'duration',
          title: '提示时间: duration',
          layout: 'radio',
          list: [2000, 5000]
        },
        {
          type: 'position',
          title: '弹窗位置: position',
          layout: 'radio',
          list: ['center', 'top', 'bottom']
        }
      ],
      value: {
        icon: 'none',
        title: '操作成功',
        content: '二级文案1',
        duration: 2000,
        position: 'center'
      }
    }
  },
  methods: {}
}
</script>
