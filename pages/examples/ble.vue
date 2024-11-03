<template>
  <app-layout>
    <config-demo :list="list" tips="低功耗蓝牙打印机 API 演示">
      <ble-connect ref="ble" :is-quick="false" @print="print()"> </ble-connect>
    </config-demo>
    <config-demo :list="[]" tips="快速连接蓝牙实现打印">
      <view class="is-flex is-align-center is-mgtb-10 is-text-left">
        <view class="is-flex-1"> 连接打印机：{{ connectedDevice && connectedDevice.name ? connectedDevice.name : '未连接' }} </view>
        <au-button v-if="connectedDevice" type="error" size="mini" @click="closeConnection()">断开连接</au-button>
        <au-button v-else type="primary" size="mini" :custom-style="{ 'margin-left': '20rpx' }" @click="quickInit()"> 快速连接 </au-button>
      </view>
      <view class="is-flex is-mgt-20">
        <view class="is-flex-1">
          <u-button :loading="loading" shape="circle" @click="getValue()" :disabled="!connectedDevice"> 寻找读写特性 </u-button>
        </view>
        <view class="is-mgl-20 is-flex-1">
          <u-button :loading="loading" type="primary" shape="circle" @click="print2([])" :disabled="!connectedDevice"> 开始打印 </u-button>
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
      serviceId: 'E7810A71-73AE-499D-8C15-FAA9AEF0C3F2',
      characteristicId: 'BEF8D6C9-9C21-4C9E-B632-BD58C1009F9F',
      list: [],
      bluetooth: new Bluetooth(),
      filterName: '',
      maskShow: false,
      showMaskType: 'device',
      deviceList: [],
      connectedDevice: null
    }
  },
  methods: {
    // 快速初始化蓝牙
    async quickInit() {
      if (!this.bluetooth.adapterState.available) {
        // 初始化蓝牙设备
        await this.bluetooth.openAdapter().catch(e => {
          if (e.errno == 103 || e.errMsg.indexOf('authdeny') !== -1) {
            this.$tips.confirm('蓝牙授权被拒绝，请在设置中允许使用蓝牙', { showCancel: false })
          }
        })
      }
      await this.bluetooth.getAdapterState() // 获取本机蓝牙适配器状态
      if (this.bluetooth.adapterState.available) {
        this.maskShow = true
        await this.bluetooth.startDevicesDiscovery() // 开始搜索蓝牙设备
        this.bluetooth.onDeviceFound(res => {
          this.deviceList = res.filter(item => {
            if (this.filterName) {
              return item.name === this.filterName
            }
            return true
          })
        })
      } else {
        this.$tips.confirm('蓝牙适配器不可用，请确认是否已经打开系统蓝牙', { showCancel: false })
      }
    },
    // 断开蓝牙连接
    closeConnection() {
      this.bluetooth.closeConnection().then(res => {
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
        await this.bluetooth.createConnection(item)
        this.connectedDevice = this.bluetooth.device
        console.log('蓝牙连接成功的设备', JSON.stringify(this.bluetooth.device))
        sleep(2000)
        this.$tips.loaded()
        this.$tips.confirm('蓝牙连接成功', { showCancel: false }).then(() => {
          this.bluetooth
            .getReadWriteValue()
            .then(res => {
              console.log('getReadWriteValue then', JSON.stringify(res))
              this.$tips.toast('获取读写值成功')
            })
            .catch(err => {
              console.log('getReadWriteValue catch', JSON.stringify(err))
              this.$tips.toast('获取读写值失败')
            })
        })
      } catch (error) {
        console.log('蓝牙连接失败', error)
        this.$tips.confirm('蓝牙连接失败', { showCancel: false })
      }
    },
    print() {
      const buffer = new Printer()
        .setAlign('ct')
        .setSize(1, 2)
        .print('记录报告')
        .setAlign('lt')
        .setSize(1, 1)
        .printFill()
        .printLR('订单编号:', 'SF00000000001')
        .printLR('收货方:', '张三')
        .printLR('发货方:', '李四')
        .printLR('派送车辆:', '鲁B99999')
        .printLR('派送人员:', '王五')
        .printLR('接收人员:', '马六')
        .printLR('托运物品:', '疫苗转运箱')
        .printLR('开始时间:', '2024-11-21 12:00:00')
        .printLR('结束时间:', '2024-11-21 12:05:00')
        .print('过程温度:')
        .printFill()
        .print('时间', true)
        .printTabSpace(9)
        .print('路数', true)
        .printTabSpace(1)
        .print('数据')
        .printFill()
        .print('11-21 12:01  1路  20℃/20%')
        .print('11-21 12:01  2路  21℃/21%')
        .print('11-21 12:02  1路  22℃/22%')
        .print('11-21 12:02  2路  23℃/23%')
        .printFill()
        .print('打印时间：' + formatDate())
        .println()
        .setSize(1, 2)
        .print('签字：')
        .setSize(1, 1)
        .end()
      this.$refs.ble.writeBLEValueLoop(buffer)
    },
    // 打印
    async print2(dataList = []) {
      this.$tips.loading('打印中...')
      const printer = new Printer()
        .setAlign('ct')
        .setSize(1, 2)
        .print('记录报告')
        .setAlign('lt')
        .setSize(1, 1)
        // .printFill()
        // .printLR('订单编号:', this.form.orderNo)
        // .printLR('收货方:', this.form.receipt)
        // .printLR('发货方:', this.form.delivery)
        // .printLR('派送车辆:', this.form.deliveryCar)
        // .printLR('派送人员:', this.form.deliveryPerson)
        // .printLR('接收人员:', this.form.receiptPerson)
        // .printLR('托运物品:', this.form.goods)
        // .printLR('开始时间:', this.form.beginTime)
        // .printLR('结束时间:', this.form.endTime)
        // .printLR('过程数据:', `共${dataList.length}条数据`)
        .printFill()
        .printLR('时间         路数', '数据')
        .printFill()
      dataList.forEach(({ time, data, ways }) => {
        printer.printLR(`${time}  ${ways}路`, data)
      })
      printer
        .printFill()
        .print('打印时间：' + this.$_u.formatTime(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss'))
        .println()
        .setSize(1, 2)
        .print('签字：')
        .setSize(1, 1)
      this.bluetooth.writeValueLoop(printer.end()).then(res => {
        setTimeout(() => {
          this.$tips.loaded()
        }, 1000)
      })
    },
    getValue() {
      this.bluetooth
        .getReadWriteValue()
        .then(res => {
          console.log('getReadWriteValue then', JSON.stringify(res))
        })
        .catch(err => {
          console.log('getReadWriteValue catch', JSON.stringify(err))
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
