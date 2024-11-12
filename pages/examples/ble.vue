<template>
  <app-layout>
    <config-demo :list="[]" tips="低功耗蓝牙连接 API 演示">
      <ble-connect ref="ble" :is-quick="false" @print="print()"> </ble-connect>
    </config-demo>
  </app-layout>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    // 打印
    async print() {
      this.$tips.loading('打印中...')
      const buffer = new Printer()
        .setAlign('ct')
        .setSize(1, 2)
        .print('居中标题')
        .setAlign('lt')
        .setSize(1, 1)
        .printFill()
        .printLR('左侧文字', '右侧文字')
        .printLCR('左侧文字', '中间文字', '右侧文字')
        .printFill()
        .print('打印时间：' + this.$_u.formatTime(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss'))
        .println()
        .setSize(2, 2)
        .print('二倍放大：')
        .setSize(1, 1)
        .end()

      if (this.$refs && this.$refs.ble) {
        await this.$refs.ble.writeBLEValueLoop(buffer)
      }
      setTimeout(() => {
        this.$tips.loaded()
      }, 1000)
    }
  }
}
</script>
<style lang="scss"></style>
