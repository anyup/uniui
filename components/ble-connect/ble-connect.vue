<template>
  <view>
    <view v-if="!isQuick" class="has-pd-20">
      <view> 本蓝牙协议只支持低功耗蓝牙协议ble。如果想连接非ble蓝牙设备，请在社区搜索 Native.js 蓝牙。 </view>
      <view class="uni-btn-v">
        <button type="primary" :disabled="disabled[0]" @click="openBluetoothAdapter">初始化蓝牙模块</button>
        <view v-if="!adapterState.available">
          {{ '蓝牙适配器不可用,请初始化蓝牙模块' }}
        </view>
        <button type="primary" :loading="searchLoad" :disabled="disabled[1]" @click="startBluetoothDevicesDiscovery">开始搜索蓝牙设备</button>
        <button type="primary" :disabled="disabled[2]" @click="stopBluetoothDevicesDiscovery(false)">停止搜索蓝牙设备</button>
        <button type="primary" :disabled="disabled[3]" @click="queryDevices">选择设备</button>
        <view v-if="equipment.length > 0">
          {{ (connected ? '已连接设备' : '已选择设备') + ' : ' + equipment[0].name + ' (' + equipment[0].deviceId + ')' }}
        </view>
        <button type="primary" :disabled="disabled[4]" @click="createBLEConnection">连接蓝牙设备</button>
        <!-- 服务 -->
        <view>
          <button type="primary" :disabled="disabled[5]" @click="getBLEDeviceServices">选择设备服务</button>
          <view v-if="servicesData.length > 0">已选服务uuid：{{ servicesData[0].uuid }}</view>
        </view>
        <!-- 服务特征值 -->
        <view>
          <button type="primary" :disabled="disabled[6]" @click="getBLEDeviceCharacteristics">获取服务的特征值</button>
          <view v-if="characteristicsData.length > 0">
            <view class="uni-list_name">uuid:{{ characteristicsData[0].uuid }}</view>
            <view class="uni-list_item">是否支持 read 操作:{{ characteristicsData[0].properties.read }}</view>
            <view class="uni-list_item">是否支持 write 操作:{{ characteristicsData[0].properties.write }}</view>
            <view class="uni-list_item">是否支持 notify 操作:{{ characteristicsData[0].properties.notify }}</view>
            <view class="uni-list_item">是否支持 indicate 操作:{{ characteristicsData[0].properties.indicate }}</view>
          </view>
        </view>
        <button type="primary" :disabled="disabled[7]" @click="readBLECharacteristicValue">读取特征值数据</button>
        <view v-if="valueChangeData.serviceId">
          <view class="list-name">特征值最新的值:{{ bufValue(valueChangeData) || '还没有最新值' }}</view>
        </view>
        <!-- <button type="primary" :disabled="disabled[8]" @click="writeBLECharacteristicValue">写入特征值数据</button> -->
        <button type="primary" :disabled="disabled[9]" @click="closeBLEConnection">断开蓝牙设备</button>
        <button type="primary" :disabled="disabled[10]" @click="closeBluetoothAdapter">关闭蓝牙模块</button>
      </view>
    </view>
    <view v-else>
      <view v-if="equipment.length > 0">
          {{ (connected ? '已连接设备' : '已选择设备') + ' : ' + equipment[0].name + ' (' + equipment[0].deviceId + ')' }}
        </view>
      <button class="has-mglr-20 has-mgtb-20" type="primary" @click="quickInit">连接蓝牙设备</button>
      <button class="has-mglr-20 has-mgtb-20" type="primary" :disabled="!connected" @click="closeBLEConnection">断开蓝牙设备</button>
      <button class="has-mglr-20 has-mgtb-20" type="primary" :disabled="!(connected && !!characteristicId)" @click="$emit('print')">开始打印</button>
    </view>
    <!-- 遮罩 -->
    <view v-if="maskShow" class="uni-mask" @touchmove.stop.prevent="moveHandle" @click="maskShow = false">
      <scroll-view class="uni-scroll_box" scroll-y @touchmove.stop.prevent="moveHandle" @click.stop="moveHandle">
        <view class="uni-title">已经发现{{ list.length }}{{ showMaskType === 'device' ? '台设备' : '个服务' }}:</view>
        <view class="uni-list-box" v-for="(item, index) in list" :key="index" @click="tapQuery(item)">
          <view v-if="showMaskType === 'device'">
            <view class="uni-list_name">{{ item.name || item.localName }}</view>
            <view class="uni-list_item">信号强度:{{ item.RSSI }}dBm</view>
            <view class="uni-list_item">UUID:{{ item.deviceId }}</view>
            <view class="list-item" v-if="showMaskType === 'device'">Service数量:{{ item.advertisServiceUUIDs.length }}</view>
          </view>
          <view v-if="showMaskType === 'service'">
            <view class="uni-list_item" style="line-height: 2.2">
              UUID: {{ item.uuid }}
              <text v-if="showMaskType === 'service'">
                {{ item.isPrimary ? '（主服务）' : '' }}
              </text>
            </view>
          </view>
          <view v-if="showMaskType === 'characteristics'">
            <view class="uni-list_name">uuid:{{ item.uuid }}</view>
            <view class="uni-list_item">是否支持 read 操作:{{ item.properties.read }}</view>
            <view class="uni-list_item">是否支持 write 操作:{{ item.properties.write }}</view>
            <view class="uni-list_item">是否支持 notify 操作:{{ item.properties.notify }}</view>
            <view class="uni-list_item">是否支持 indicate 操作:{{ item.properties.indicate }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
import bleapi from '@/common/ble/api.js'

export default {
  props: {
    serviceId: {
      type: String,
      default: ''
    },
    characteristicId: {
      type: String,
      default: ''
    },
    isQuick: {
      type: [String, Boolean],
      default: false
    },
    filterName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 0.初始化蓝牙设备 1.开始搜索蓝牙设备 2.停止搜索蓝牙设备
      // 3.选择设备 4.连接蓝牙设备 5.选择设备服务 6.获取服务的特征值
      // 7.读取特征值数据 8.写入特征值数据 9.断开蓝牙设备 10.关闭蓝牙模块
      disabled: [false, true, true, true, true, true, true, true, true, true, true],
      searchLoad: false,
      maskShow: false,
      equipment: [],
      adapterState: {
        discovering: false,
        available: false
      },
      connected: false,
      showMaskType: 'device',
      servicesData: [],
      characteristicsData: [],
      valueChangeData: {},
      isStop: true,
      list: []
    }
  },
  created() {
    this.onBLEConnectionStateChange()
  },
  destroyed() {
    this.closeBLEConnection()
    this.closeBluetoothAdapter(true)
  },
  watch: {
    // 蓝牙设备
    equipment: {
      handler(newValue, oldValue) {
        let { deviceId } = this.getIds()
        this.$emit('deviceId', deviceId)
      },
      deep: true
    },
    // 服务
    servicesData: {
      handler(newValue, oldValue) {
        let { serviceId } = this.getIds()
        this.$emit('serviceId', serviceId)
      },
      deep: true
    },
    // 特征值
    characteristicsData: {
      handler(newValue, oldValue) {
        let { characteristicId } = this.getIds()
        this.$emit('characteristicId', characteristicId)
      },
      deep: true
    }
  },
  computed: {
    bufValue() {
      return function (v) {
        return v.value
      }
    }
  },
  methods: {
    moveHandle() {},
    // 蓝牙快速初始化
    async quickInit() {
      await this.openBluetoothAdapter() // 初始化蓝牙设备
      await this.startBluetoothDevicesDiscovery() // 开始搜索蓝牙设备
      this.queryDevices()
    },
    // 获取已连接设备的id
    getIds() {
      if (this.isQuick) {
        const deviceId = this.equipment.length ? this.equipment[0].deviceId : ''
        const { serviceId, characteristicId } = this
        return { deviceId, serviceId, characteristicId, notify: true }
      } else {
        const deviceId = this.equipment.length ? this.equipment[0].deviceId : ''
        const serviceId = this.servicesData.length ? this.servicesData[0].uuid : ''
        const characteristicId = this.characteristicsData.length ? this.characteristicsData[0].uuid : ''
        const notify = this.characteristicsData.length ? this.characteristicsData[0].properties.notify : false
        return { deviceId, serviceId, characteristicId, notify }
      }
    },
    // 选择蓝牙设备弹窗
    queryDevices() {
      this.showMaskType = 'device'
      this.maskShow = true
    },
    // 选择 设备、服务、特征值
    tapQuery(item) {
      if (this.showMaskType === 'device') {
        this.$set(this.disabled, 4, false)
        if (this.equipment.length > 0) {
          this.equipment[0] = item
        } else {
          this.equipment.push(item)
        }
        if (this.isQuick) this.createBLEConnection()
      }
      if (this.showMaskType === 'service') {
        this.$set(this.disabled, 6, false)
        if (this.servicesData.length > 0) {
          this.servicesData[0] = item
        } else {
          this.servicesData.push(item)
        }
      }
      if (this.showMaskType === 'characteristics') {
        this.$set(this.disabled, 7, false)
        this.$set(this.disabled, 8, false)
        if (this.characteristicsData.length > 0) {
          this.characteristicsData[0] = item
        } else {
          this.characteristicsData.push(item)
        }
      }
      this.maskShow = false
    },
    /**
     * 1. 初始化蓝牙设备
     */
    openBluetoothAdapter() {
      bleapi
        .openBluetoothAdapter()
        .then(res => {
          this.isStop = false
          this.$set(this.disabled, 0, true)
          this.$set(this.disabled, 1, false)
          this.$set(this.disabled, 10, false)
          this.getBluetoothAdapterState()
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode, e.errMsg)
          }
        })
    },
    /**
     * 2. 获取本机蓝牙适配器状态
     */
    getBluetoothAdapterState() {
      bleapi
        .getBluetoothAdapterState()
        .then(res => {
          this.adapterState = res
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 3. 开始搜索蓝牙设备
     */
    startBluetoothDevicesDiscovery() {
      bleapi
        .startBluetoothDevicesDiscovery()
        .then(res => {
          this.searchLoad = true
          this.$set(this.disabled, 1, true)
          this.$set(this.disabled, 2, false)
          this.$set(this.disabled, 3, false)
          this.onBluetoothDeviceFound()
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 4. 发现外围设备
     */
    onBluetoothDeviceFound() {
      uni.onBluetoothDeviceFound(res => {
        // console.log('发现外围设备成功', JSON.stringify(res))
        this.getBluetoothDevices()
      })
    },
    /**
     * 5. 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
     */
    getBluetoothDevices() {
      bleapi
        .getBluetoothDevices()
        .then(res => {
          this.list = res.filter(item => {
            if (this.filterName) {
              return item.name === this.filterName
            }
            return true
          })
        })
        .chatch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 6. 连接低功耗蓝牙
     */
    createBLEConnection() {
      let { deviceId } = this.getIds()
      uni.showToast({
        title: '连接蓝牙...',
        icon: 'loading',
        duration: 99999
      })

      bleapi
        .createBLEConnection({ deviceId })
        .then(res => {
          // 连接设备后断开搜索 并且不能搜索设备
          this.stopBluetoothDevicesDiscovery(true)
          uni.hideToast()
          uni.showToast({
            title: '连接成功',
            icon: 'success',
            duration: 2000
          })
          this.$set(this.disabled, 3, true)
          this.$set(this.disabled, 4, true)
          this.$set(this.disabled, 5, false)
          this.$set(this.disabled, 9, false)
          this.connected = true
          this.$emit('connected', deviceId)
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 7. 停止搜索蓝牙设备
     */
    stopBluetoothDevicesDiscovery(types) {
      bleapi
        .stopBluetoothDevicesDiscovery()
        .then(res => {
          if (types) {
            this.$set(this.disabled, 1, true)
          } else {
            this.$set(this.disabled, 1, false)
          }
          this.$set(this.disabled, 2, true)
          this.searchLoad = false
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 断开与低功耗蓝牙设备的连接
     */
    closeBLEConnection() {
      let { deviceId } = this.getIds()
      if (!deviceId) return
      bleapi
        .closeBLEConnection({ deviceId })
        .then(res => {
          this.$set(this.disabled, 1, false)
          this.$set(this.disabled, 3, true)
          this.$set(this.disabled, 4, true)
          this.$set(this.disabled, 5, true)
          this.$set(this.disabled, 6, true)
          this.$set(this.disabled, 7, true)
          this.$set(this.disabled, 8, true)
          this.$set(this.disabled, 9, true)
          this.equipment = []
          this.servicesData = []
          this.characteristicsData = []
          this.connected = false
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 获取所有服务
     */
    getBLEDeviceServices() {
      let { deviceId } = this.getIds()
      bleapi
        .getBLEDeviceServices({ deviceId })
        .then(res => {
          this.$set(this.disabled, 7, true)
          this.$set(this.disabled, 8, true)
          this.showMaskType = 'service'
          this.list = res.services
          this.characteristicsData = []
          if (this.list.length <= 0) {
            toast('获取服务失败，请重试!')
            return
          }
          this.maskShow = true
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 获取某个服务下的所有特征值
     */
    getBLEDeviceCharacteristics() {
      let { deviceId, serviceId } = this.getIds()
      bleapi
        .getBLEDeviceCharacteristics({ deviceId, serviceId })
        .then(res => {
          this.$set(this.disabled, 7, true)
          this.valueChangeData = {}
          this.showMaskType = 'characteristics'
          this.list = res.characteristics
          if (this.list.length <= 0) {
            toast('获取特征值失败，请重试!')
            return
          }
          this.maskShow = true
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
     */
    onBLEConnectionStateChange() {
      uni.onBLEConnectionStateChange(res => {
        console.log('监听蓝牙连接状态', JSON.stringify(res))
        if (!res.connected) {
          if (this.isStop) return
          console.log('断开低功耗蓝牙成功:')
          this.$set(this.disabled, 1, false)
          this.$set(this.disabled, 3, true)
          this.$set(this.disabled, 4, true)
          this.$set(this.disabled, 5, true)
          this.$set(this.disabled, 6, true)
          this.$set(this.disabled, 7, true)
          this.$set(this.disabled, 8, true)
          this.$set(this.disabled, 9, true)
          this.searchLoad = false
          this.equipment = []
          this.servicesData = []
          this.characteristicsData = []
          this.valueChangeData = {}
          toast('已经断开当前蓝牙连接')
        }
      })
    },
    /**
     * 读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持 read 才可以成功调用
     */
    readBLECharacteristicValue() {
      let { deviceId, serviceId, characteristicId } = this.getIds()
      this.onBLECharacteristicValueChange()
      bleapi
        .readBLECharacteristicValue({ deviceId, serviceId, characteristicId })
        .then(res => {
          this.notifyBLECharacteristicValueChange()
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 写入控制命令
     * writeCode 写入的控制命令
     */
    writeBLECharacteristicValue(buffer) {
      const { deviceId, serviceId, characteristicId } = this.getIds()
      this.onBLECharacteristicValueChange()
      return bleapi.writeBLECharacteristicValue({ deviceId, serviceId, characteristicId, buffer })
    },
    /**
     * 写入控制命令
     * writeCode 写入的控制命令
     */
    writeBLEValue(buffer) {
      const { deviceId, serviceId, characteristicId } = this.getIds()
      console.log({ deviceId, serviceId, characteristicId })
      this.onBLECharacteristicValueChange()
      return bleapi.writeBLEValue({ deviceId, serviceId, characteristicId, buffer })
    },
    /**
     * 写入控制命令
     * writeCode 写入的控制命令
     */
    writeBLEValueLoop(buffer) {
      console.log(buffer)
      const { deviceId, serviceId, characteristicId } = this.getIds()
      console.log({ deviceId, serviceId, characteristicId })
      this.onBLECharacteristicValueChange()
      return bleapi.writeBLEValueLoop({ deviceId, serviceId, characteristicId, buffer })
    },
    /**
     * 监听低功耗蓝牙设备的特征值变化事件。
     */
    onBLECharacteristicValueChange() {
      uni.onBLECharacteristicValueChange(res => {
        console.log('监听低功耗蓝牙设备的特征值变化事件成功')
        console.log(JSON.stringify(res))
        console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
        console.log(`16进制值 ${ab2hex(res.value)}`)
        this.valueChangeData = res
      })
    },
    /**
     * 订阅操作成功后需要设备主动更新特征值的 value，才会触发 uni.onBLECharacteristicValueChange 回调。
     */
    notifyBLECharacteristicValueChange() {
      let { deviceId, serviceId, characteristicId, notify } = this.getIds()
      bleapi.notifyBLECharacteristicValueChange(deviceId, serviceId, characteristicId, notify).then(res => {})
    },
    /**
     * 	断开蓝牙模块
     */
    closeBluetoothAdapter() {
      bleapi.closeBluetoothAdapter().then(res => {
        this.isStop = true
        this.$set(this.disabled, 0, false)
        this.$set(this.disabled, 1, true)
        this.$set(this.disabled, 2, true)
        this.$set(this.disabled, 3, true)
        this.$set(this.disabled, 4, true)
        this.$set(this.disabled, 5, true)
        this.$set(this.disabled, 6, true)
        this.$set(this.disabled, 7, true)
        this.$set(this.disabled, 8, true)
        this.$set(this.disabled, 9, true)
        this.$set(this.disabled, 10, true)
        this.equipment = []
        this.servicesData = []
        this.characteristicsData = []
        this.valueChangeData = {}
        this.adapterState = []
        this.searchLoad = false
        // toast('断开蓝牙模块')
      })
    }
  }
}

/**
 * 判断初始化蓝牙状态
 */
function initTypes(code, errMsg) {
  switch (code) {
    case 10000:
      toast('未初始化蓝牙适配器')
      break
    case 10001:
      toast('未检测到蓝牙，请打开蓝牙重试！')
      break
    case 10002:
      toast('没有找到指定设备')
      break
    case 10003:
      toast('连接失败')
      break
    case 10004:
      toast('没有找到指定服务')
      break
    case 10005:
      toast('没有找到指定特征值')
      break
    case 10006:
      toast('当前连接已断开')
      break
    case 10007:
      toast('当前特征值不支持此操作')
      break
    case 10008:
      toast('其余所有系统上报的异常')
      break
    case 10009:
      toast('Android 系统特有，系统版本低于 4.3 不支持 BLE')
      break
    default:
      toast(errMsg)
  }
}

/**
 * 弹出框封装
 */
function toast(content, showCancel = false) {
  uni.showModal({
    title: '提示',
    content,
    showCancel
  })
}
// arraybuffer转16进制
function ab2hex(buffer) {
  let hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
    return ('00' + bit.toString(16)).slice(-2)
  })
  return hexArr.join('')
}
</script>

<style>
button {
  margin-top: 30rpx;
}

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
</style>
