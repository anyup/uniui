<template>
  <app-layout>
    <config-demo v-model="value" :list="list" tips="为保证演示的正确性，请在真机环境下测试，本模块仅为演示更新效果">
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
      <app-button type="primary" @click="checkUpdate">检测版本更新</app-button>
      <view class="is-text-center is-font-12">请求接口仅作为测试展示效果</view>
    </config-demo>
    <au-updater ref="updater" :auto="false" :request="request" :modalTitle="value.modalTitle" :modalIcon="value.modalIcon" @success="onResult" @modal-confirm="onConfirm" />
  </app-layout>
</template>

<script>
import { Http } from '@/uniui'

export default {
  data() {
    return {
      list: [
        {
          type: 'modalTitle',
          title: '弹出框标题: modalTitle',
          layout: 'radio',
          list: ['发现新版本', '版本更新提示']
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
          tips: '检测到有新版本，自动下载更新资源并主动更新应用',
          layout: 'radio',
          list: [false, true]
        },
        {
          type: 'slient',
          title: '静默更新: slient（仅在热更新模式下有效）',
          tips: '静默更新无需用户操作，检测到有新版本资源后，自动下载安装',
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
      http: new Http(),
      // request 为promise
      request: null
    }
  },
  onLoad(options) {
    this.getAppInfo()
    this.setRequest()
  },
  methods: {
    // 设置请求 promise
    setRequest() {
      let url = '/static/json/app-version.json'
      // #ifdef H5
      url = '/h5/static/json/app-version.json'
      // #endif
      const header = { 'Content-Type': 'application/json' }
      // versionCode 为获取的当前版本号
      const params = { versionCode: 1 }
      this.request = () => new Http().setHeader(header).get(url, params)
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
    // 检查更新
    checkUpdate() {
      // #ifdef MP-WEIXIN || APP-PLUS
      this.showModal({
        versionName: '3.6.0',
        versionContent: '1.新增功能模块\n2.优化已知问题优化\n3.提升应用性能',
        versionDownloadUrl: 'https://mp.weixin.qq.com/s/bgkhC02WPlEHmGnCbSmDcg'
      })
      return
      // #endif
      // #ifndef MP-WEIXIN
      this.$tips.loading()
      this.$refs.updater.checkUpdate()
      // #endif
    },
    // 请求接口
    doRequest() {
      // #ifdef MP-WEIXIN || APP-PLUS
      this.onResult({
        data: {
          versionCode: 6,
          versionName: '3.6.0',
          versionContent: '1.新增功能模块\n2.优化已知问题优化\n3.提升应用性能',
          versionDownloadUrl: 'https://mp.weixin.qq.com/s/bgkhC02WPlEHmGnCbSmDcg'
        }
      })
      return
      // #endif
      let url = '/static/json/app-version.json'
      // #ifdef H5
      url = '/h5/static/json/app-version.json'
      // #endif
      const header = { 'Content-Type': 'application/json' }
      // versionCode 为获取的当前版本号
      const params = { versionCode: 1 }
      this.http
        .setHeader(header)
        .get(url, params)
        .then(res => {
          this.onResult(res)
        })
        .catch(err => {
          this.$tips.loaded()
          this.$tips.toast(JSON.stringify(err))
        })
    },
    // 接口请求成功回调
    onResult(response) {
      const data = response.data
      // #ifdef APP-PLUS
      if (this.value.hot && this.value.slient) {
        this.$refs.updater.hotUpdate(data.versionDownloadUrl)
        return
      }
      // #endif
      this.$tips.loaded()
      this.showModal(data)
    },
    // 显示更新弹窗提示
    showModal({ versionDownloadUrl, versionContent, versionName }) {
      this.$refs.updater.showModal({
        url: versionDownloadUrl,
        version: versionName,
        content: versionContent.replace(/<zh>(.*?)<\/zh>/g, '$1').replace(/\|/g, '\n'),
        force: this.value.force
      })
    },
    // 弹窗确认事件
    onConfirm(url) {
      // #ifdef APP-PLUS
      if (this.value.hot) {
        // 是否热更新
        this.$refs.updater.hotUpdate(url)
      } else {
        plus.runtime.openURL(url)
      }
      // #endif
      // #ifdef H5
      window.open(url)
      // #endif
      // #ifdef MP-WEIXIN
      this.$u.route(`/pages/components/webview?src=${url}`)
      // #endif
    }
  }
}
</script>
