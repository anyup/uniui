<template>
  <app-layout>
    <grid-links v-model="list"></grid-links>
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

<style lang="scss" scoped></style>
