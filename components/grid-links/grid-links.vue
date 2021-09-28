<template>
  <view class="container">
    <view class="page_hd">
      <view class="page_desc">
        uniapp demo
        <u-icon
          class="toggle_icon"
          :name="isGrid ? 'grid' : 'list'"
          color="#999999"
          size="50"
          @click="isGrid = !isGrid"
        ></u-icon>
      </view>
    </view>
    <view v-if="isGrid" class="page_bd page_bd_spacing">
      <view v-for="(item, index) in value" :key="index" class="kind-list_item">
        <view :id="item.icon" class="tui-flex kind-list_item-hd">
          <view class="tui-flex_item">{{ item.name }}</view>
        </view>
        <u-grid :col="2">
          <u-grid-item v-for="(page, index2) in item.children" :key="index2">
            <navigator :url="page.page" class="is-text-center" hover-class="none">
              <u-icon :name="oneIcon(index2)" :size="46" color="#999999"></u-icon>
              <view class="grid-text">{{ page.name }}</view>
            </navigator>
          </u-grid-item>
        </u-grid>
      </view>
    </view>
    <view v-else class="page_bd page_bd_spacing">
      <view class="kind-list">
        <block v-for="(item, index) in value" :key="index">
          <view class="kind-list_item">
            <view
              :id="item.icon"
              class="tui-flex kind-list_item-hd"
              :class="{ 'kind-list_item-hd_show': item.open }"
              @tap="kindToggle"
            >
              <view class="tui-flex_item">{{ item.name }}</view>
              <u-icon :name="item.icon" color="#999" size="50"></u-icon>
            </view>
            <view class="kind-list_item-bd" :class="{ 'kind-list_item-bd_show': item.open }">
              <view class="tui-cells" :class="{ 'tui-cells_show': item.open }">
                <block v-for="(page, index2) in item.children" :key="index2">
                  <navigator :url="page.page" class="tui-cell tui-cell_access">
                    <view class="tui-cell_bd">{{ page.name }}</view>
                    <view class="tui-cell_ft tui-cell_ft_in-access"></view>
                  </navigator>
                </block>
              </view>
            </view>
          </view>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
import icons from '@/common/icons'

export default {
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isGrid: true
    }
  },
  methods: {
    kindToggle: function (e) {
      let id = e.currentTarget.id
      let list = this.value
      for (var i = 0, len = list.length; i < len; ++i) {
        if (list[i].icon == id) {
          list[i].open = !list[i].open
        } else {
          list[i].open = false
        }
      }
      this.$emit('input', list)
    },
    oneIcon(i) {
      let min = i
      let max = icons.list.length - 1
      let index = Math.floor(Math.random() * (max - min + 1) + min)
      return icons.list[index].name
    }
  }
}
</script>

<style lang="scss">
.container {
  width: 100%;
  padding-bottom: 30rpx;
  height: 100%;
  overflow-y: auto;
}

.link {
  color: $u-type-primary;
}

.tui-cell {
  padding: 10px 15px;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.tui-cell:before {
  content: ' ';
  position: absolute;
  top: 0;
  right: 0;
  border-top: 1px solid #eaeef1;
  color: #eaeef1;
  left: 15px;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}

.tui-cell:first-child:before {
  display: none;
}

.tui-cell_active {
  background-color: #f7f7f9;
}

.tui-cell_bd {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}

.tui-cell_ft {
  text-align: right;
  color: #999;
}

.tui-cell_access {
  color: inherit;
}

.tui-cell_ft_in-access {
  padding-right: 13px;
  position: relative;
}

.tui-cell_ft_in-access:after {
  content: ' ';
  height: 11px;
  width: 11px;
  border-width: 2px 2px 0 0;
  border-color: #b2b2b2;
  border-style: solid;
  -webkit-transform: matrix(0.5, 0.5, -0.5, 0.5, 0, 0);
  transform: matrix(0.5, 0.5, -0.5, 0.5, 0, 0);
  position: absolute;
  top: 50%;
  margin-top: -7px;
  right: 2px;
}

.tui-form-preview_item {
  overflow: hidden;
}

.tui-flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}

.tui-flex_item {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}

.page_desc {
  color: #666;
  font-size: 28rpx;
  text-align: center;
  padding: 50rpx;
  position: relative;
}

.toggle_icon {
  position: absolute;
  top: 45rpx;
  right: 30rpx;
  font-weight: 700;
}

.tui-flex {
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.tui-cells {
  margin-top: 0;
  opacity: 0;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  -webkit-transition: 0.3s;
  transition: 0.3s;
}

.tui-cells:before,
.tui-cells:after {
  display: none;
}

.tui-cells_show {
  opacity: 1;
  -webkit-transform: translateY(0);
  transform: translateY(0);
}

.tui-cell:before {
  right: 15px;
}

.kind-list_item {
  margin: 10px 0;
  background-color: #fff;
  border-radius: 2px;
  overflow: hidden;
}

.kind-list_item:first-child {
  margin-top: 0;
}

.kind-list_img {
  width: 30px;
  height: 30px;
}

.tui-img-0,
.tui-img-1,
.tui-img-2 {
  width: 32px !important;
  height: 32px !important;
}

.tui-img-7 {
  width: 26px !important;
  height: 26px !important;
}

.kind-list_item-hd {
  padding: 10px 20px;
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}

.kind-list_item-hd_show {
  opacity: 0.4;
}

.kind-list_item-bd {
  height: 0;
  overflow: hidden;
}

.kind-list_item-bd_show {
  height: auto;
}

.tui-badge {
  position: absolute;
  width: 80rpx;
  height: 30rpx;
  border-radius: 30rpx 30rpx 30rpx 0;
  color: #fff;
  background: #eb0909;
  font-size: 25rpx;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0.8) translateX(100%);
  transform-origin: center center;
  top: -8rpx;
  right: 0;
}

.grid-text {
  font-size: 28rpx;
  margin-top: 20rpx;
  color: $u-type-info;
}
</style>
