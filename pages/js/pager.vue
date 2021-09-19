<template>
  <app-layout>
    <config-demo v-model="value" :list="list">
      <u-empty v-if="pager.empty()"></u-empty>
    </config-demo>
  </app-layout>
</template>

<script>
import { Pager } from '@/uniui'
export default {
  data() {
    return {
      value: {},
      list: [],
      pager: new Pager()
    }
  },
  onLoad() {
    this.getList()
  },
  methods: {
    getList() {}
  }
}
</script>

<style></style>
