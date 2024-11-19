<template>
  <au-layout
    class="app-layout"
    ref="AuLayout"
    :page-show="pageShow"
    :bg-color="bgColor"
    :padding="padding"
    :custom-style="customStyle"
    loading-text="加载中"
  >
    <slot></slot>
    <view v-if="loadmore" class="is-pd-10">
      <u-loadmore :status="loadmore" />
    </view>
    <view v-if="empty" class="is-pdtb-50">
      <u-empty v-if="empty" />
    </view>
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
      default: '#ffffff'
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
      default: true
    },
    // 是否自动检测版本更新
    autoUpdate: {
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
    },
    padding: {
      type: String,
      default: '20rpx'
    }
  },
  data() {
    return {
      isForce: false
    }
  },
  computed: {
    request() {
      return {
        header: {},
        url: '',
        params: {},
        method: 'POST'
      }
    },
    pageShow() {
      // if (this.checkLogin) {
      //   return !!this.getter_base.token
      // }
      return true
    }
  },
  created() {
    // if (this.checkLogin && !this.getter_base.token) {
    //   setTimeout(() => {
    //     uni.reLaunch({ url: '/pages/login/login'})
    //   }, 100)
    // }
  },
  methods: {}
}
</script>

<style></style>
