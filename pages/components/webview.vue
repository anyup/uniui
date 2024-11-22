<template>
  <col-webview :src="src" />
</template>

<script>
export default {
  data() {
    return {
      src: ''
    }
  },
  onLoad(options) {
    if (options.src) {
      this.src = options.src
    } else {
      // #ifdef H5
      this.src = 'https://www.anyup.cn/site/index.html'
      // #endif
      // #ifdef MP-WEIXIN
      this.src = 'https://mp.weixin.qq.com/s/bgkhC02WPlEHmGnCbSmDcg'
      // #endif
    }
  }
}
</script>
