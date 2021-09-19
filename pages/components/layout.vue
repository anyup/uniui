<template>
  <app-layout :empty="true">
    <config-demo :list="list"> </config-demo>
  </app-layout>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          title: '说明',
          tips: 'Layout为封装的主要页面父布局，可以添加公用组件，不必每个页面都引用，如下方空布局'
        }
      ]
    }
  }
}
</script>
