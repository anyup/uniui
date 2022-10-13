<template>
  <app-layout>
    <config-demo v-model="value" :list="list">
      <app-button
        :type="value.type"
        :size="value.size"
        :shape="value.shape"
        :plain="value.plain"
        :hollow="value.hollow"
        :disabled="value.disabled"
      >
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
          title: '类型: type',
          tips: '支持自定义type，详细见文档',
          layout: 'radio',
          list: ['default', 'primary', 'warning', 'error', 'success', 'gold']
        },
        {
          type: 'size',
          title: '尺寸: size',
          layout: 'radio',
          list: ['default', 'medium', 'mini']
        },
        {
          type: 'shape',
          title: '形状: shape',
          layout: 'radio',
          list: ['square', 'circle']
        },
        {
          type: 'plain',
          title: '镂空: plain',
          layout: 'radio',
          list: [false, true]
        },
        {
          type: 'hollow',
          title: '完全镂空: hollow',
          tips: '完全镂空为显示底色，即background-color 设置为 transparent',
          layout: 'radio',
          list: [false, true]
        },
        {
          type: 'disabled',
          title: '禁用: disabled',
          layout: 'radio',
          list: [false, true]
        }
      ],
      value: {
        type: 'default',
        size: 'default',
        shape: 'square',
        plain: false,
        hollow: false,
        disabled: false
      }
    }
  }
}
</script>
