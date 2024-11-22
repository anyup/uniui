<template>
  <col-layout padding="20rpx" :toast-duration="3000" toast-position="center" loading-text="3秒后消失">
    <config-demo title="说明" :tips="tips" :list="list" @btn-click="btnClick"> </config-demo>
  </col-layout>
</template>

<script>
export default {
  data() {
    return {
      tips: '封装的tips提示工具类，已经挂载到全局prototype，可使用this.$tips或导入Tips对象使用',
      list: [
        {
          type: 'loading',
          title: 'loading',
          tips: '加载弹窗',
          layout: 'button',
          list: ['显示3秒']
        },
        {
          type: 'toast',
          title: 'toast',
          tips: '提示弹窗',
          layout: 'button',
          list: ['显示3秒']
        },
        {
          type: 'confirm',
          title: 'confirm',
          tips: '确认弹窗',
          layout: 'button',
          list: ['显示']
        }
      ]
    }
  },
  onLoad() {},
  methods: {
    btnClick({ type, index }) {
      console.log(type, index)
      switch (type) {
        case 'loading':
          this.$tips.loading()
          setTimeout(() => {
            this.$tips.loaded()
          }, 3000)
          break
        case 'toast':
          this.$tips.toast('3秒后消失', 'success')
          break
        case 'confirm':
          this.$tips
            .confirm('请点击确认或取消')
            .then(() => {
              this.$tips.toast('点击确认')
            })
            .catch(() => {
              this.$tips.toast('点击取消')
            })
          break

        default:
          break
      }
    }
  }
}
</script>

<style lang="scss"></style>
