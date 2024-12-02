<template>
  <app-layout>
    <config-demo :list="[]" tips="快速连接蓝牙打印机，实现打印，支持低功耗热敏打印机，部分型号打印指令可能有偏差">
      <view class="is-flex is-align-center is-mgtb-10 is-text-left">
        <view class="is-flex-1"> 连接打印机：{{ connectedDevice && connectedDevice.name ? connectedDevice.name : '未连接' }} </view>
        <col-button v-if="connectedDevice" type="error" size="mini" @click="closeBLEConnection()">断开连接</col-button>
        <col-button v-else type="primary" size="mini" :custom-style="{ 'margin-left': '20rpx' }" @click="checkAndRequestPermissions()"> 快速连接 </col-button>
      </view>
      <view class="is-mgt-20">
        <view>
          <u-button :loading="loading" shape="circle" @click="getReadWriteBLEValue()" :disabled="!connectedDevice"> 寻找读写特性 </u-button>
          <view v-if="connectedDevice && connectedDevice.serviceId && connectedDevice.characteristicId">
            <view> 服务ID:{{ connectedDevice.serviceId }} </view>
            <view> 特征值ID:{{ connectedDevice.characteristicId }} </view>
            <view> 是否支持 read 操作:{{ connectedDevice.characteristic.properties.read }} </view>
            <view> 是否支持 write 操作:{{ connectedDevice.characteristic.properties.write }} </view>
            <view> 是否支持 notify 操作:{{ connectedDevice.characteristic.properties.notify }} </view>
            <view> 是否支持 indicate 操作:{{ connectedDevice.characteristic.properties.indicate }} </view>
          </view>
        </view>
        <view class="is-mgt-20">
          <u-button :loading="loading" type="primary" shape="circle" @click="print()" :disabled="!connectedDevice"> 测试打印 </u-button>
        </view>
      </view>
    </config-demo>
    <!-- 遮罩 -->
    <view v-if="maskShow" class="uni-mask" @touchmove.stop.prevent="() => {}" @click="maskShow = false">
      <scroll-view class="uni-scroll_box" scroll-y @touchmove.stop.prevent="() => {}" @click.stop="() => {}">
        <view class="uni-title"> 已经发现{{ deviceList.length }}{{ showMaskType === 'device' ? '台设备' : '个服务' }}: </view>
        <view class="uni-list-box" v-for="(item, index) in deviceList" :key="index" @click="tapQuery(item)">
          <view v-if="showMaskType === 'device'">
            <view class="uni-list_name">{{ item.name || item.localName }}</view>
            <view class="uni-list_item">信号强度:{{ item.RSSI }}dBm</view>
            <view class="uni-list_item">UUID:{{ item.deviceId }}</view>
            <view class="list-item" v-if="showMaskType === 'device'"> Service数量:{{ item.advertisServiceUUIDs.length }} </view>
            <view class="link-text">连接</view>
          </view>
        </view>
      </scroll-view>
    </view>
  </app-layout>
</template>

<script>
import { formatDate } from '@/common/utils'
import { Printer } from '@/common/ble/Printer'
import { Bluetooth, sleep } from '@/common/ble/Bluetooth'

export default {
  data() {
    return {
      loading: false,
      list: [],
      bluetooth: new Bluetooth(),
      filterName: '',
      maskShow: false,
      showMaskType: 'device',
      deviceList: [],
      connectedDevice: null
    }
  },
  onLoad(options) {
    this.options = options
  },
  beforeDestroy() {
    this.bluetooth.closeBLEConnection()
    setTimeout(() => {
      this.bluetooth.closeBluetoothAdapter()
    }, 500)
  },
  methods: {
  // 检验是否有蓝牙权限
  checkAndRequestPermissions() {
      this.$tips.loading()
      const permissions = ['scope.bluetooth']
      // 检查权限
      uni.getSetting({
        success: res => {
          let authResult = true
          permissions.forEach(permission => {
            if (!res.authSetting[permission]) {
              authResult = false
              return
            }
          })

          if (!authResult) {
            setTimeout(() => {
              this.$tips.loaded()
            }, 1500)
            // 请求权限
            this.requestPermissions()
          } else {
            // 已经有权限，可以进行蓝牙操作
            this.quickInit()
          }
        },
        fail: err => {
          this.$tips.loaded()
        }
      })
    },
    // 申请蓝牙权限
    requestPermissions() {
      const permissions = ['scope.bluetooth']

      permissions.forEach(permission => {
        uni.authorize({
          scope: permission,
          success: () => {
            console.log(`权限 ${permission} 请求成功`)
            // 已经有权限，可以进行蓝牙操作
            this.quickInit()
          },
          fail: err => {
            console.error(`权限 ${permission} 请求失败`, err)
            uni.showModal({
              title: '提示',
              content: '请在设置中开启蓝牙和位置权限',
              showCancel: false
            })
          }
        })
      })
    },
    // 快速初始化蓝牙
    async quickInit() {
      try {
        if (!this.bluetooth.adapterState.available) {
          await this.bluetooth.openBluetoothAdapter() // 初始化蓝牙适配器
        }
        await this.bluetooth.getBluetoothAdapterState() // 获取本机蓝牙适配器状态
        this.$tips.loaded()
        if (this.bluetooth.adapterState.available) {
          this.maskShow = true
          await this.bluetooth.startBluetoothDevicesDiscovery() // 开始搜索蓝牙设备
          this.bluetooth.onBluetoothDeviceFound(res => {
            this.deviceList = res.filter(item => {
              if (this.filterName) {
                return item.name === this.filterName
              }
              return true
            })
          })
        } else {
          this.toast('蓝牙适配器不可用，请确认开启蓝牙和位置权限')
        }
      } catch (e) {
        this.$tips.loaded()
        console.error('蓝牙连接失败', e)
        this.initTypes(e.errCode || -1, e.errMsg || '出现未知错误')
      }
    },
    initTypes(code, errMsg) {
      switch (code) {
        case 10000:
          this.toast('未初始化蓝牙适配器')
          break
        case 10001:
          this.toast('未检测到蓝牙，请打开蓝牙重试！')
          break
        case 10002:
          this.toast('没有找到指定设备')
          break
        case 10003:
          this.toast('连接失败')
          break
        case 10004:
          this.toast('没有找到指定服务')
          break
        case 10005:
          this.toast('没有找到指定特征值')
          break
        case 10006:
          this.toast('当前连接已断开')
          break
        case 10007:
          this.toast('当前特征值不支持此操作')
          break
        case 10008:
          this.toast('其余所有系统上报的异常')
          break
        case 10009:
          this.toast('Android 系统特有，系统版本低于 4.3 不支持 BLE')
          break
        case 10012:
          this.toast('连接超时，请重试')
          break
        default:
          this.toast(errMsg)
      }
    },
    toast(errMsg) {
      this.$tips.confirm(errMsg, { showCancel: false })
    },
    // 断开蓝牙连接
    closeBLEConnection() {
      this.bluetooth.closeBLEConnection().then(res => {
        this.$tips.confirm('已断开蓝牙连接', { showCancel: false })
        this.deviceList = []
        this.connectedDevice = null
      })
    },
     // 选择 设备、服务、特征值
     async tapQuery(item) {
      this.maskShow = false
      this.$tips.loading('蓝牙连接中...')
      try {
        await this.bluetooth.createBLEConnection(item)
        this.connectedDevice = this.bluetooth.device
        console.log('蓝牙连接成功的设备', JSON.stringify(this.bluetooth.device))
        sleep(2000)
        this.$tips.loaded()
        this.$tips.confirm('蓝牙连接成功', { showCancel: false }).then(() => {
          this.bluetooth
            .getReadWriteBLEValue()
            .then(res => {
              this.connectedDevice = this.bluetooth.device
              console.log('getReadWriteBLEValue then', JSON.stringify(res))
              this.$tips.toast('初始化设备成功')
            })
            .catch(err => {
              console.log('getReadWriteBLEValue catch', JSON.stringify(err))
              this.$tips.toast('初始化设备失败')
            })
        })
      } catch (error) {
        console.log('蓝牙连接失败', error)
        this.$tips.confirm('蓝牙连接失败', { showCancel: false })
      }
    },
    // 打印
    async print() {
      this.$tips.loading('打印中...')
      const buffer = new Printer()
        .setAlign('ct')
        .setSize(1, 2)
        .print('居中标题')
        .setAlign('lt')
        .setSize(1, 1)
        .printFill()
        .printLR('左侧文字', '右侧文字')
        .printLCR('左侧文字', '中间文字', '右侧文字')
        .setSize(2, 1)
        .print('宽度放大文字')
        .setSize(1, 2)
        .print('高度放大文字')
        .setSize(2, 2)
        .print('等比放大文字')
        .setSize(1, 1)
        .printFill()
        .print('打印时间：' + this.$_u.formatTime(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss'))
        .println()
        .end()

      this.bluetooth.writeBLEValueLoop(buffer).then(res => {
        setTimeout(() => {
          this.$tips.loaded()
        }, 1000)
      })
    },
    // 获取该蓝牙打印支持读写的特性值
    getReadWriteBLEValue() {
      this.bluetooth
        .getReadWriteBLEValue()
        .then(res => {
          this.connectedDevice = this.bluetooth.device
          console.log('getReadWriteBLEValue then', JSON.stringify(res))
        })
        .catch(err => {
          console.log('getReadWriteBLEValue catch', JSON.stringify(err))
        })
    }
  }
}
</script>
<style lang="scss">
.uni-title {
  text-align: center;
}

.uni-mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
  padding: 0 30rpx;
  box-sizing: border-box;
  z-index: 999;
}

.uni-scroll_box {
  height: 70%;
  background: #fff;
  border-radius: 20rpx;
}

.uni-list-box {
  margin: 0 20rpx;
  padding: 15rpx 0;
  border-bottom: 1px #f5f5f5 solid;
  box-sizing: border-box;
  position: relative;
}

.uni-list:last-child {
  border: none;
}

.uni-list_name {
  font-size: 30rpx;
  color: #333;
}

.uni-list_item {
  font-size: 24rpx;
  color: #555;
  line-height: 1.5;
}

.uni-success_box {
  position: absolute;
  left: 0;
  bottom: 0;
  min-height: 100rpx;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  border-top: 1px #eee solid;
}

.uni-success_sub {
  /* width: 100%%; */
  height: 100rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30rpx;
}

.uni-close_button {
  padding: 0 20rpx;
  height: 60rpx;
  line-height: 60rpx;
  background: #ce3c39;
  color: #ffffff;
  border-radius: 10rpx;
}

.uni-success_content {
  height: 600rpx;
  margin: 30rpx;
  margin-top: 0;
  border: 1px #eee solid;
  padding: 30rpx;
}

.uni-content_list {
  padding-bottom: 10rpx;
  border-bottom: 1px #f5f5f5 solid;
}

.uni-tips {
  text-align: center;
  font-size: 24rpx;
  color: #666;
}
.link-text {
  color: #2979ff;
  position: absolute;
  right: 40rpx;
  top: 70rpx;
}
</style>
