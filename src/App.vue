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
@import 'colorful-uni/dist/index.scss';
@import 'uview-ui/index.scss';
page {
  height: 100%;
  font-size: 28rpx;
  /* #ifdef H5 */
  max-width: 500px !important;
  margin: 0 auto !important;
  /* #endif */
}
</style>
