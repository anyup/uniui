<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/*每个页面公共css */
@import '@anyup/uniui/dist/index.scss';
@import 'uview-ui/index.scss';
page {
  height: 100%;
  font-size: 28rpx;
}
</style>
