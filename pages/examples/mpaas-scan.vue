<template>
  <app-layout>
    <config-demo title="说明" :tips="tips" v-model="value" :list="list">
      <au-button type="primary" @click="btnClick">扫码</au-button>
    </config-demo>
  </app-layout>
</template>

<script>
var mpaasScanModule = null
export default {
  data() {
    return {
      tips: 'mPaaS 扫码插件，仅支持 APP 平台',
      list: [
        {
          type: 'scanType',
          title: 'scanType',
          tips: '扫码识别类型',
          layout: 'radio',
          list: ['qrCode', 'barCode', 'qrCode,barCode']
        },
        {
          type: 'hideAlbum',
          title: 'hideAlbum',
          tips: '是否隐藏相册，默认false不隐藏',
          layout: 'radio',
          list: [false, true]
        }
      ],
      value: {
        scanType: 'qrCode,barCode',
        hideAlbum: false
      }
    }
  },
  onLoad() {
    mpaasScanModule = uni.requireNativePlugin('Mpaas-Scan-Module')
  },
  methods: {
    btnClick() {
      // #ifdef APP-PLUS
      console.log(this.value)
      console.log(mpaasScanModule)
      mpaasScanModule.mpaasScan(
        {
          // 扫码识别类型，参数可多选，qrCode、barCode，不设置，默认识别所有
          scanType: this.value.scanType.split(','),
          // 是否隐藏相册，默认false不隐藏
          hideAlbum: this.value.hideAlbum
        },
        ret => {
          console.log(ret)
          uni.showModal({
            title: '扫码结果',
            // 返回值中，resp_code 表示返回结果值，10：用户取消，11：其他错误，1000：成功
            // 返回值中，resp_message 表示返回结果信息
            // 返回值中，resp_result 表示扫码结果，只有成功才会有返回
            content: JSON.stringify(ret),
            showCancel: false,
            confirmText: '确定'
          })
        }
      )
      // #endif
      // #ifndef APP-PLUS
      uni.showModal({
        title: '提示',
        content: '当前非 APP 平台，无法调用',
        showCancel: false,
        confirmText: '确定'
      })
      // #endif
    }
  }
}
</script>

<style lang="scss"></style>
