<template>
  <app-layout>
    <link-grid :list="list"></link-grid>
  </app-layout>
</template>

<script>
import datas from './data'

export default {
  data() {
    return {
      list: datas
    }
  }
}
</script>

<style lang="scss" scoped>
page {
  height: auto;
  min-height: 100%;
  background-color: #f8f8f8;
}
</style>
