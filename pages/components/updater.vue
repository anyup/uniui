<template>
  <app-layout>
    <config-demo v-model="value" :list="list">
      <app-button type="primary" @click="testShow">检测版本更新（仅测试）</app-button>
    </config-demo>
    <au-updater
      ref="updater"
      :auto="false"
      :request="request"
      :is-force="value.isForce"
      :modal-title="value.modalTitle"
      @result="onResult"
      @confirm="onConfirm"
    />
  </app-layout>
</template>

<script>
export default {
  data() {
    return {
      request: {
        header: {},
        url: '',
        params: {},
        method: 'POST'
      },
      list: [
        {
          type: 'modalTitle',
          title: '弹出框title',
          layout: 'radio',
          list: ['发现新版本', '版本更新']
        },
        {
          type: 'isForce',
          title: '强制更新',
          tips: '是否强制更新，如果是，仅显示需隐藏tabbar，不允许关闭弹窗',
          layout: 'radio',
          list: [false, true]
        }
      ],
      value: {
        modalTitle: '发现新版本',
        isForce: false
      }
    }
  },
  methods: {
    testShow() {
      this.$refs.updater.showModal(
        'http://anyup.gitee.io/uniui-docs-web/',
        '检测到新版本：v3.0.0\n1.新增功能模块\n2.优化已知问题'
      )
    },
    // 接口请求成功回调
    onResult({ data, ref }) {
      /* #ifdef H5 */
      this.$tips.toast('请在真机环境下测试')
      /* #endif */
      /* #ifdef APP-PLUS */
      if (data.versionCode > this.$_u.plus.versionCode()) {
        if (data.isForce) uni.hideTabBar()
        ref.showModal(data.downloadUrl, data.updateNotes)
      }
      /* #endif */
    },
    onConfirm({ ref }) {
      /* #ifdef H5 */
      ref.closeModal()
      this.$tips.toast('请在真机环境下测试', 'info')
      /* #endif */
    }
  }
}
</script>
