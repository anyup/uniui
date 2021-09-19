<template>
  <app-layout>
    <config-demo v-model="value" :list="list">
      <app-button type="primary" @click="toast = value">显示</app-button>
    </config-demo>
    <au-toast ref="toast" :toast="toast" :duration="value.duration" @cancel="toast = {}"></au-toast>
  </app-layout>
</template>

<script>
export default {
  data() {
    return {
      toast: { title: '操作成功', icon: 'none', content: '', duration: 2000 },
      list: [
        {
          type: 'title',
          title: '提示文案',
          layout: 'radio',
          list: ['操作成功', 'success']
        },
        {
          type: 'content',
          title: '二级文案',
          tips: '只有带图标toast支持',
          layout: 'radio',
          list: ['二级文案1', '二级文案2']
        },
        {
          type: 'icon',
          title: '提示图标',
          layout: 'radio',
          list: ['success', 'info', 'fail', 'none']
        },
        {
          type: 'duration',
          title: '提示时间',
          layout: 'radio',
          list: [3000, 5000]
        }
      ],
      value: {
        title: '成功',
        content: '',
        icon: 'none',
        duration: 2000
      }
    }
  },
  methods: {}
}
</script>
