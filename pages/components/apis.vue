<template>
  <app-layout>
    <config-demo>
      <view class="is-pdb-10 is-border">
        <au-apis :list="apiList" @select="setServer" />
      </view>
      <view v-if="value" class="is-pd-10 is-mgt-20 is-border">
        <view>名称：{{ value.name }}</view>
        <view>地址：{{ value.domain }}</view>
        <view>端口：{{ value.port }}</view>
      </view>
    </config-demo>
  </app-layout>
</template>

<script>
const apiList = [
  {
    name: '生产环境',
    children: [
      { id: 'domain', value: 'https://api.prod.com' },
      { id: 'port', value: '8080' }
    ]
  },
  {
    name: 'Test',
    children: [
      { id: 'domain', value: 'https://api.test.com' },
      { id: 'port', value: '8080' }
    ]
  },
  {
    name: 'Test1',
    children: [
      { id: 'domain', value: 'https://api.test1.com' },
      { id: 'port', value: '8080' }
    ]
  }
]
export default {
  data() {
    return {
      value: null,
      apiList
    }
  },
  methods: {
    setServer(item) {
      this.value = item
    }
  }
}
</script>

<style lang="scss"></style>
