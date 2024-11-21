<template>
  <au-layout class="app-layout" ref="AuLayout" :page-show="pageShow" :bg-color="bgColor" :custom-style="customStyle" loading-text="加载中...">
    <slot></slot>
    <view v-if="loadmore" class="is-pd-10"> <u-loadmore :status="loadmore" /> </view>
    <view v-if="empty" class="is-pdtb-50"> <u-empty text="无数据" mode="history" /> </view>
  </au-layout>
</template>

<script>
export default {
  name: 'AppLayout',
  components: {},
  props: {
    // 背景色值
    bgColor: {
      type: String,
      default: '#f8f8f8'
    },
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    // 是否检测登录
    checkLogin: {
      type: Boolean,
      default: false
    },
    // 加载更多状态
    loadmore: {
      type: String,
      default: '' // loadmore, loading, nomore
    },
    // 是否展示空布局
    empty: {
      type: [String, Boolean],
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    pageShow() {
      if (this.checkLogin) {
        return !!this.getter_user.token
      }
      return true
    }
  },
  mounted() {
    if (this.checkLogin && !this.getter_user.token) {
      this.$_u.tips.fail('请先登录')
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/user/login' })
      }, 1500)
    }
  }
}
</script>
