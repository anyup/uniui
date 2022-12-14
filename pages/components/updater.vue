<template>
  <app-layout>
    <config-demo v-model="value" :list="list">
      <!-- #ifdef APP-PLUS -->
      <view class="is-flex is-flex-column is-pd-10 is-mgtb-10 is-border is-radius-8 is-text-left">
        <view>App版本</view>
        <text>{{ appVersion }}</text>
      </view>
      <view class="is-flex is-flex-column is-pd-10 is-mgtb-10 is-border is-radius-8 is-text-left">
        <view>wgt应用资源版本</view>
        <text>{{ wgtVersion }}</text>
      </view>
      <!-- #endif -->
      <app-button type="primary" @click="checkUpdate">检测版本更新（仅测试）</app-button>
    </config-demo>
    <au-updater
      ref="updater"
      :auto="false"
      :request="request"
      :modalTitle="value.modalTitle"
      :modalIcon="value.modalIcon"
      @success="onResult"
      @modal-confirm="onConfirm"
    />
  </app-layout>
</template>

<script>
import { Http } from '@/uniui'

export default {
  data() {
    return {
      request: {
        header: { 'Content-Type': 'application/json' },
        url: '/api/appVersionInfo/getAppUpgradeInfo',
        params: { applicationCode: 'BiolinkApp', versionNum: 1, platformType: 0 },
        method: 'POST'
      },
      list: [
        {
          type: 'modalTitle',
          title: '弹出框标题: modalTitle',
          layout: 'radio',
          list: ['发现新版本', '版本更新']
        },
        {
          type: 'modalIcon',
          title: '是否显示弹出框背景: modalIcon',
          layout: 'radio',
          list: [false, true]
        },
        {
          type: 'force',
          title: '强制更新: force',
          tips: '是否强制更新（强制更新需隐藏tabbar，不允许关闭弹窗）',
          layout: 'radio',
          list: [false, true]
        },
        {
          type: 'hot',
          title: '是否热更新: hot',
          layout: 'radio',
          list: [false, true]
        },
        {
          type: 'slient',
          title: '静默更新: slient（仅在热更新模式下有效）',
          tips: '是否静默更新（静默更新无需用户操作）',
          layout: 'radio',
          list: [false, true]
        }
      ],
      value: {
        modalTitle: '发现新版本',
        modalIcon: false,
        force: false,
        hot: false,
        slient: false
      },
      appVersion: '',
      wgtVersion: '',
      request: undefined
    }
  },
  onLoad(options) {
    this.getAppInfo()
    this.setRequest()
  },
  methods: {
    setRequest() {
      const url = '/api/appVersionInfo/getAppUpgradeInfo'
      const header = { 'Content-Type': 'application/json' }
      const params = { applicationCode: 'BiolinkApp', versionNum: 1, platformType: 2 }
      this.request = () => new Http().setHeader(header).post(url, params)
    },
    // 获取应用信息
    getAppInfo() {
      // #ifdef APP-PLUS
      // App版本信息
      this.appVersion = `版本名称：${plus.runtime.version}\n版本号：${plus.runtime.versionCode}`
      // 热更新资源版本信息
      plus.runtime.getProperty(plus.runtime.appid, wgtinfo => {
        const { version, versionCode } = wgtinfo
        this.wgtVersion = `版本名称：${version}\n版本号：${versionCode}`
      })
      // #endif
    },
    checkUpdate() {
      // #ifdef H5
      this.$refs.updater.showModal({
        url: 'https://www.anyup.cn/docs/',
        content: '1.新增功能模块\n2.优化已知问题优化\n3.提升应用性能',
        versionName: '1.1.9'
      })
      // #endif
      // #ifdef APP-PLUS
      this.$refs.updater.checkUpdate()
      // #endif
    },
    // 接口请求成功回调
    onResult(response) {
      console.log(response)
      /* #ifdef H5 */
      this.$tips.toast('请在真机环境下测试')
      /* #endif */
      /* #ifdef APP-PLUS */
      const data = response.data
      if (this.value.hot && this.value.slient) {
        this.$refs.updater.hotUpdate(data.versionDownloadUrl)
        return
      }
      this.showModal(data)
      /* #endif */
    },
    // 显示更新弹窗提示
    showModal({ versionDownloadUrl, versionDesc, versionName }) {
      this.$refs.updater.showModal({
        url: versionDownloadUrl,
        version: versionName,
        content: versionDesc.replace(/<zh>(.*?)<\/zh>/g, '$1').replace(/\|/g, '\n'),
        force: this.value.force
      })
    },
    // 弹窗确认事件
    onConfirm(url) {
      // #ifdef H5
      this.$refs.updater.closeModal()
      this.$tips.toast('请在真机环境下测试', 'info')
      // #endif
      // #ifdef APP-PLUS
      if (this.value.hot) {
        this.$refs.updater.hotUpdate(url)
      } else {
        plus.runtime.openURL(url)
      }
      // #endif
    }
  }
}
</script>
