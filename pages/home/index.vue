<template name="components">
  <view>
    <u-navbar :is-back="false" title="Colorful Uni 示例项目" title-width="350" :background="background" title-color="#fff"></u-navbar>
    <u-gap></u-gap>
    <view class="group-title">
      <view>公告栏</view>
      <view class="nav-title is-mgl-10">Advs</view>
    </view>
    <u-notice-bar type="error" mode="vertical" :more-icon="true" :list="noticeList" @click="noticeClick"></u-notice-bar>
    <u-gap></u-gap>
    <view class="group-title">
      <view>示例项目</view>
      <view class="nav-title is-mgl-10">Project</view>
    </view>
    <view class="is-pdlr-10">
      <u-swiper :list="swiperList" :effect3d="false" :title="false" :interval="5000" :height="320" img-mode="aspectFit" @click="swiperClick"></u-swiper>
    </view>
    <u-gap></u-gap>
    <view v-for="(menu, mIndex) in menuList" :key="mIndex">
      <view class="group-title">
        <view>{{ menu.title }}</view>
        <view class="nav-title is-mgl-10">{{ menu.name }}</view>
      </view>
      <view class="nav-list">
        <navigator
          hover-class="none"
          :url="item.path"
          class="nav-li"
          navigateTo
          :class="'bg-' + randomColor(item.color)"
          :style="[{ animation: 'show ' + ((index + 1) * 0.2 + 1) + 's 1' }]"
          v-for="(item, index) in menu.children"
          :key="index"
        >
          <view class="nav-title">{{ item.title }}</view>
          <view class="nav-name">{{ item.name }}</view>
          <!-- <text :class="'cuIcon-' + item.icon"></text> -->
        </navigator>
      </view>
    </view>
  </view>
</template>

<script>
const menuList = [
  {
    title: '基础组件',
    name: 'Basic',
    children: [
      { title: '基础布局', name: 'Layout', color: 'orange', icon: '', path: '/pages/components/layout' },
      { title: '按钮', name: 'Button', color: 'pink', icon: '', path: '/pages/components/button' },
      { title: '图标', name: 'Icon', color: 'olive', icon: '', path: '/pages/components/icons' },
      { title: '加载框', name: 'Loading', color: 'blue', icon: '', path: '/pages/components/loading' },
      { title: '加载图标', name: 'Loader', color: 'brown', icon: '', path: '/pages/components/loader' },
      { title: '表格', name: 'Table', color: 'purple', icon: '', path: '/pages/components/table' },
      { title: '提示', name: 'Tips', color: 'yellow', icon: '', path: '/pages/components/toast' },
      { title: '网页视图', name: 'Webview', color: 'cyan', icon: '', path: '/pages/components/webview' },
      { title: '应用更新', name: 'Updater', color: 'blue', icon: '', path: '/pages/components/updater' },
      { title: '服务器切换', name: 'Apis', color: 'brown', icon: '', path: '/pages/components/apis' }
    ]
  },
  {
    title: '表单校验',
    name: 'Form',
    children: [{ title: '表单校验', name: 'Form', color: 'grey', icon: '', path: '/pages/js/checker' }]
  },
  {
    title: '工具类',
    name: 'Library',
    children: [
      { title: '网路请求', name: 'Http', color: 'orange', icon: '', path: '/pages/js/http' },
      { title: '优化类', name: 'Optimize', color: 'red', icon: '', path: '/pages/js/optimize' },
      { title: '分页', name: 'Pager', color: 'brown', icon: '', path: '/pages/js/pager' },
      { title: '状态管理', name: 'Store', color: 'olive', icon: '', path: '/pages/js/store' },
      { title: '提示类', name: 'Tips', color: 'yellow', icon: '', path: '/pages/js/tips' }
    ]
  },
  {
    title: '解决方案示例',
    name: 'Demos',
    children: [
      { title: 'mPaaS扫码', name: 'mPaaS Scan', color: 'orange', icon: '', path: '/pages/examples/mpaas-scan' },
      { title: 'BLE蓝牙连接', name: 'Bluetooth', color: 'pink', icon: '', path: '/pages/examples/ble' },
      { title: 'BLE蓝牙打印', name: 'Bluetooth', color: 'olive', icon: '', path: '/pages/examples/ble-print' }
    ]
  }
]
export default {
  data() {
    return {
      background: {
        backgroundColor: '#2979ff',
        // 渐变色
        backgroundImage: 'linear-gradient(90deg, #2979ff, #1cbbb4)'
      },
      noticeList: ['软考刷题工具上线啦，关注公众号可获取', '软考刷题工具上线啦，关注公众号可获取'],
      swiperList: [
        {
          image: 'https://mmbiz.qpic.cn/mmbiz_png/XTwjYITHToB1JhibXHhPGFeW2a6aRTmkDnxc25p3FXs8jTHNOTrLXkyibR2SKdfI1uJJibUvGAFaE9iaSo3CM001Ew/640',
          title: '欢迎关注公众号',
          url: 'https://mp.weixin.qq.com/s/kHQ9Db0QUvpxDh1nhJEP2g'
        }
      ],
      menuList,
      colors: ['red', 'orange', 'yellow', 'olive', 'green', 'cyan', 'blue', 'purple', 'mauve', 'pink', 'brown', 'grey'],
      colorsgradual: ['gradual-red', 'gradual-orange', 'gradual-green', 'gradual-blue', 'gradual-purple', 'gradual-pink']
    }
  },
  onLoad() {},
  methods: {
    // 随机颜色
    randomColor(color) {
      if (color) return color
      let min = 0
      let max = this.colors.length - 1
      let index = Math.floor(Math.random() * (max - min + 1) + min)
      return this.colors[index]
    },
    // 广告栏点击事件
    noticeClick(index) {
      const url = 'https://mp.weixin.qq.com/s/kHQ9Db0QUvpxDh1nhJEP2g'
      // #ifdef H5
      window.open(url)
      // #endif
      // #ifndef H5
      this.$u.route(`/pages/components/webview?src=${url}`)
      // #endif
    },
    // 轮播图点击事件
    swiperClick(index) {
      const url = this.swiperList[index].url
      if (url) {
        // #ifdef H5
        window.open(url)
        // #endif
        // #ifndef H5
        this.$u.route(`/pages/components/webview?src=${url}`)
        // #endif
      }
    }
  }
}
</script>

<style>
.group-title {
  display: flex;
  align-items: end;
  justify-content: center;
  font-size: 36rpx;
  padding: 20rpx 0 40rpx 0;
}
</style>
