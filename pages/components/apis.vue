<template>
  <app-layout>
    <config-demo>
      <view class="is-pdb-10 is-border is-text-left">
        <col-apis :list="apiList" @select="setServer" />
      </view>
      <view v-if="value" class="is-pd-10 is-mgt-20 is-border is-text-left">
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
      { id: 'domain', value: 'https://api.production.com' },
      { id: 'port', value: '8080' }
    ]
  },
  {
    name: '开发环境',
    children: [
      { id: 'domain', value: 'https://api.development.com' },
      { id: 'port', value: '8080' }
    ]
  },
  {
    name: '测试环境',
    children: [
      { id: 'domain', value: 'https://api.test.com' },
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
