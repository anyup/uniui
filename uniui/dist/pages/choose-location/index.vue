<template>
  <view class="location-wrapper">
    <view class="location-search">
      <input type="text" v-model="searchContent" @input="searchChange" placeholder="可输入检索位置" />
      <view class="clear" v-show="searchContent" @click="clearSearchChange">
        <image mode="widthFix" src="/static/choose-location/close-icon.png" />
      </view>
    </view>
    <scroll-view class="location-list" scroll-y @scrolltolower="scrolltolower">
      <view class="empty-data" v-if="searchPointList.legnth === 0">暂无检索结果</view>
      <view class="li" v-for="(item, index) in searchPointList" :key="index" @click="searchPointClick(index, item)">
        <view class="point">
          <view class="name">{{ item.name }}</view>
          <view class="address">{{ item.address }}</view>
        </view>
        <view class="tag" v-show="searchPointIndex === index"></view>
      </view>
    </scroll-view>
    <view class="loading-animation" v-show="loading">
      <image mode="widthFix" src="/static/choose-location/loading-icon.png" />检索中
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      systemInfo: uni.getSystemInfoSync(), // 设备信息
      StatusBar: null, // 状态栏
      Map: null, // 地图
      Marker: null, // 覆盖物
      MapCloseButton: null, // 关闭
      MapConfirmButton: null, // 确定
      MapCurrentButton: null, // 当前位置
      mapCurrentPoint: {}, // 地图当前点信息
      locationCurrent: {}, // 当前位置信息
      searchType: 1, // 检索类型 0代表全国，1代表当前范围
      searchContent: '', // 检索内容
      searchPointList: [], // 检索列表
      searchPointIndex: 0, // 检索列表索引
      pageCurrent: 1, // 分页列表
      loading: false
    }
  },
  onLoad() {
    let that = this
    // 获取当前位置
    plus.nativeUI.toast('当前地理位置读取中')
    uni.getLocation({
      type: 'gcj02',
      geocode: true,
      success(response) {
        // 获取当前窗口
        that.mapCurrentPoint = response
        const currentWebview = that.$mp.page.$getAppWebview()
        // 创建地图组件
        that.Map = plus.maps.create('map', {
          width: '100%',
          height: '50%',
          center: new plus.maps.Point(that.mapCurrentPoint.longitude, that.mapCurrentPoint.latitude),
          zoom: 14
        })
        // 向窗口添加地图组件
        currentWebview.append(that.Map)
        that.centerFunc()
        that.markerFunc()
        let address =
          that.mapCurrentPoint.address.province +
          that.mapCurrentPoint.address.city +
          that.mapCurrentPoint.address.district +
          that.mapCurrentPoint.address.street +
          that.mapCurrentPoint.address.streetNum
        that.locationCurrent = {
          point: {
            longitude: that.mapCurrentPoint.longitude,
            latitude: that.mapCurrentPoint.latitude
          },
          name: that.mapCurrentPoint.address.poiName,
          address: address + that.mapCurrentPoint.address.poiName
        }
        that.searchPointChange()

        // 地图点击事件
        that.Map.onclick = point => {
          that.mapCurrentPoint = point
          that.centerFunc()
          that.markerFunc()
          that.searchType = 1
          that.searchPointIndex = 0
          that.pageCurrent = 1
          // 反向地理编码 将坐标点转换为地理位置信息
          plus.maps.Map.reverseGeocode(
            that.mapCurrentPoint,
            {
              coordType: 'gcj02'
            },
            res => {
              that.locationCurrent = {
                point: res.coord,
                name: '当前位置',
                address: res.address
              }
              that.searchPointChange()
            },
            err => {
              plus.nativeUI.toast(JSON.stringify(err))
            }
          )
        }
      },
      fail(err) {
        plus.nativeUI.toast('读取当前地理位置失败')
      }
    })
    // view原生控件绘制按钮
    this.drawRectStatusBar()
    this.drawRectClose()
    this.drawRectConfirm()
    this.drawRectCurrent()
  },
  methods: {
    centerFunc() {
      // 设置地图中心点
      this.Map.setCenter(new plus.maps.Point(this.mapCurrentPoint.longitude, this.mapCurrentPoint.latitude))
    },
    markerFunc() {
      // 地图中心点覆盖物
      this.Map.removeOverlay(this.Marker)
      this.Marker = new plus.maps.Marker(
        new plus.maps.Point(this.mapCurrentPoint.longitude, this.mapCurrentPoint.latitude)
      )
      this.Marker.setIcon('/static/choose-location/marker-icon.png')
      this.Map.addOverlay(this.Marker)
    },
    searchChange() {
      // 检索内容 防抖/节流
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (this.searchContent) {
          this.locationCurrent = {}
          this.searchType = 0
          this.searchPointIndex = undefined
          this.pageCurrent = 1
          this.searchPointChange()
        } else {
          this.clearSearchChange()
        }
      }, 300)
    },
    clearSearchChange() {
      // 检索内容清空
      this.searchContent = ''
      this.locationCurrentFunc()
    },
    scrolltolower() {
      // 滚动加载
      this.pageCurrent++
      this.searchPointChange()
    },
    searchPointChange() {
      // 创建地图检索
      let search = new plus.maps.Search(this.Map)
      if (this.searchType === 0) {
        // 全国检索 输入内容检索时 (检索的关键字、检索范围的左下角坐标点、检索范围的右上角坐标点)
        search.poiSearchInbounds(
          this.searchContent,
          new plus.maps.Point(73.4, 3.52),
          new plus.maps.Point(135.2, 53.33),
          this.pageCurrent
        )
      } else {
        // 范围检索 (检索的关键字、检索的中心点坐标、检索的半径，单位为米)
        search.poiSearchNearBy(
          '',
          new plus.maps.Point(this.mapCurrentPoint.longitude, this.mapCurrentPoint.latitude),
          3000,
          this.pageCurrent
        )
      }
      this.loading = true
      search.onPoiSearchComplete = (status, result) => {
        // 判断是否是滚动加载
        if (this.pageCurrent === 1) {
          this.searchPointList = []
          if (Object.keys(this.locationCurrent).length > 0) {
            this.searchPointList.push(this.locationCurrent)
          }
        }
        if (status === 0) {
          let { poiList } = result
          if (poiList.length > 0) {
            // 循环地理编码 将地理位置信息转换为坐标点
            for (let item of poiList) {
              plus.maps.Map.geocode(
                item.address + item.name,
                {
                  city: item.city
                },
                res => {
                  let addressList = res.address.match(/.+?(省|市|区|自治区|自治州|县|乡|镇)/g)
                  let address = ''
                  for (let el of addressList) {
                    address += el
                  }
                  this.searchPointList.push({
                    point: item.point,
                    address: address + item.address + item.name,
                    name: item.name
                  })
                }
              )
            }
          } else {
            plus.nativeUI.toast('没有检索到结果')
          }
        } else {
          plus.nativeUI.toast('检索失败')
        }
        this.loading = false
      }
    },
    searchPointClick(index, item) {
      // 检索结果点击事件
      this.searchPointIndex = index
      this.mapCurrentPoint = item.point
      this.centerFunc()
      this.markerFunc()
    },
    drawRectStatusBar() {
      // 绘制状态栏
      let statusbar = new plus.nativeObj.View('statusbar', {
        height: `${this.systemInfo.statusBarHeight}px`,
        width: '100%'
      })
      statusbar.drawRect({
        color: 'rgba(0, 0, 0, .3)'
      })
      statusbar.show()
      this.StatusBar = statusbar
    },
    drawRectClose() {
      // 绘制关闭按钮
      let close = new plus.nativeObj.View('close', {
        top: `${this.systemInfo.statusBarHeight + 10}px`,
        left: '10px',
        height: '30px',
        width: '30px'
      })
      close.drawRect(
        {
          color: '#999',
          radius: '8px'
        },
        {
          width: '100%',
          height: '100%'
        }
      )
      close.drawBitmap(
        '/static/choose-location/close-icon.png',
        {},
        {
          top: '7.5px',
          left: '7.5px',
          width: '15px',
          height: '15px'
        }
      )
      close.show()
      this.MapCloseButton = close
      // 关闭按钮事件
      close.addEventListener(
        'click',
        () => {
          uni.navigateBack()
        },
        false
      )
    },
    drawRectConfirm() {
      // 绘制确定按钮
      let confirm = new plus.nativeObj.View('confirm', {
        top: `${this.systemInfo.statusBarHeight + 10}px`,
        left: `${this.systemInfo.screenWidth - 60}px`,
        height: '30px',
        width: '50px'
      })
      confirm.drawRect(
        {
          color: '#409eff',
          radius: '8px'
        },
        {
          width: '100%',
          height: '100%'
        }
      )
      confirm.drawText(
        '确定',
        {},
        {
          color: '#fff',
          size: '14px'
        }
      )
      confirm.show()
      this.MapConfirmButton = confirm
      // 确定按钮事件
      confirm.addEventListener(
        'click',
        () => {
          if (this.searchPointIndex || this.searchPointIndex === 0) {
            let object = this.searchPointList[this.searchPointIndex]
            delete object.name
            uni.$emit('location', object)
            uni.navigateBack()
          } else {
            plus.nativeUI.toast('请先选择地理位置')
          }
        },
        false
      )
    },
    drawRectCurrent() {
      // 绘制当前位置按钮
      let center = new plus.nativeObj.View('center', {
        top: '43%',
        left: `${this.systemInfo.screenWidth - 40}px`,
        height: '30px',
        width: '30px'
      })
      center.drawRect(
        {
          color: '#999',
          radius: '30px'
        },
        {
          width: '100%',
          height: '100%'
        }
      )
      center.drawBitmap(
        '/static/choose-location/center-icon.png',
        {},
        {
          top: '5px',
          left: '5px',
          width: '20px',
          height: '20px'
        }
      )
      center.show()
      this.MapCurrentButton = center
      // 当前位置按钮事件
      center.addEventListener(
        'click',
        () => {
          this.locationCurrentFunc()
        },
        false
      )
    },
    locationCurrentFunc() {
      let that = this
      uni.getLocation({
        type: 'gcj02',
        geocode: true,
        success(response) {
          that.mapCurrentPoint = response
          that.centerFunc()
          that.markerFunc()
          that.searchType = 1
          that.searchPointIndex = 0
          that.pageCurrent = 1
          let address =
            that.mapCurrentPoint.address.province +
            that.mapCurrentPoint.address.city +
            that.mapCurrentPoint.address.district +
            that.mapCurrentPoint.address.street +
            that.mapCurrentPoint.address.streetNum
          that.locationCurrent = {
            point: {
              longitude: that.mapCurrentPoint.longitude,
              latitude: that.mapCurrentPoint.latitude
            },
            name: that.mapCurrentPoint.address.poiName,
            address: address + that.mapCurrentPoint.address.poiName
          }
          that.searchPointChange()
        },
        fail(err) {
          plus.nativeUI.toast('读取当前地理位置失败')
        }
      })
    }
  },
  onUnload() {
    // 卸载页面释放原生控件资源
    this.StatusBar.close()
    this.MapCloseButton.close()
    this.MapConfirmButton.close()
    this.MapCurrentButton.close()
    this.Map.close()
  }
}
</script>

<style scoped>
.location-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 50vh;
}
.location-search {
  position: relative;
  flex-shrink: 0;
  padding: 20rpx;
}
.location-search input {
  padding: 15rpx 70rpx 15rpx 20rpx;
  background: #e5e5e5;
  border: 1rpx solid #e5e5e5;
  font-size: 28rpx;
  border-radius: 10rpx;
}
.location-search .clear {
  position: absolute;
  top: 50%;
  right: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30rpx;
  height: 30rpx;
  border: 2rpx solid #fff;
  text-align: center;
  border-radius: 50%;
  transform: translateY(-50%);
}
.location-search .clear image {
  width: 20rpx;
  height: 20rpx !important;
}
.location-list {
  overflow-y: auto;
  flex: 1;
}
.location-list .li {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-top: 1rpx solid #e5e5e5;
  line-height: 1.3;
}
.location-list .li .point {
  flex: 1;
}
.location-list .li .name {
  margin-bottom: 10rpx;
  font-size: 28rpx;
}
.location-list .li .address {
  color: #999;
  font-size: 24rpx;
}
.location-list .li .tag {
  flex-shrink: 0;
  width: 30rpx;
  height: 30rpx;
  margin-left: 30rpx;
  border: 10rpx solid #409eff;
  background: #fff;
  border-radius: 50%;
  box-sizing: border-box;
}
.empty-data {
  padding: 50rpx 0;
  color: #999;
  font-size: 28rpx;
  text-align: center;
}
.loading-animation {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #999;
  font-size: 28rpx;
  text-align: center;
}
.loading-animation image {
  width: 60rpx;
  height: 60rpx !important;
  margin-bottom: 10rpx;
  animation: turn 1s linear infinite;
}
@keyframes turn {
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
