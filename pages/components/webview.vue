<template>
  <au-webview :src="src" />
</template>

<script>
export default {
  data() {
    return {
      src: ''
    }
  },
  onLoad(options) {
    this.src = options.src || 'https://www.anyup.cn/site/index.html'
  }
}
</script>
