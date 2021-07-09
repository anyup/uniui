<template>
  <web-view :webview-styles="styles" :src="src"></web-view>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    progressColor: {
      type: String,
      default: '#2979ff'
    },
    webviewStyles: {
      type: Object,
      default: {}
    }
  },
  computed: {
    styles() {
      let { progress } = this.webviewStyles
      if (progress && !progress.color) {
        progress.color = this.progressColor
      }
      return [...webviewStyles, ...{ progress }]
    }
  }
}
</script>

<style lang="scss"></style>
