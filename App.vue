<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onError(err) {
    console.log(err)
  }
}
</script>

<style lang="scss">
@import '@/uniui/index.scss';
@import 'uview-ui/index.scss';
@import 'assets/font/iconfont.css';
@import 'assets/style/index.scss';

page {
  height: 100%;
  background-color: #ffffff;
}
/* #ifdef H5 */
page {
  max-width: 500px !important;
  margin: 0 auto;
}
/* #endif */
</style>
