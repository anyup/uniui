<template>
  <app-layout>
    <config-demo v-model="value" :list="list">
      <app-button :type="value.type" :size="value.size" :shape="value.shape" :plain="value.plain">
        按钮
      </app-button>
    </config-demo>
  </app-layout>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          type: 'type',
          title: '类型',
          tips: '支持自定义type，详细见文档',
          layout: 'radio',
          list: ['default', 'primary', 'warning', 'error', 'success', 'gold']
        },
        {
          type: 'size',
          title: '尺寸',
          layout: 'radio',
          list: ['default', 'medium', 'mini']
        },
        {
          type: 'shape',
          title: '形状',
          layout: 'radio',
          list: ['square', 'circle']
        },
        {
          type: 'plain',
          title: '镂空',
          layout: 'radio',
          list: [true, false]
        }
      ],
      value: {
        type: 'primary',
        size: 'default',
        shape: 'square',
        plain: false
      }
    }
  }
}
</script>
