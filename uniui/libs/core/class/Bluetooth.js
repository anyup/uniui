import sleep from '../function/sleep'

/**
 * 蓝牙工具类
 * @author qiaomingxing
 */
class Bluetooth {
  constructor() {
    this.device = { notify: true }
  }
  setDevice(value) {
    this.device = { ...this.device, ...value }
    return this
  }
  resetDevice() {
    this.device = {}
    return this
  }
  /**
   * 初始化蓝牙设备
   */
  openAdapter() {
    return new Promise((resolve, reject) => {
      uni.openBluetoothAdapter({
        success: res => {
          console.log('初始化蓝牙设备成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('初始化蓝牙设备失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  }
  /**
   * 	断开蓝牙模块
   */
  closeAdapter() {
    return new Promise((resolve, reject) => {
      uni.closeBluetoothAdapter({
        success: res => {
          console.log('断开蓝牙模块成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('断开蓝牙模块失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  }
  /**
   * 开始搜索蓝牙设备
   */
  startDevicesDiscovery() {
    return new Promise((resolve, reject) => {
      uni.startBluetoothDevicesDiscovery({
        success: res => {
          console.log('开始搜索蓝牙设备成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('开始搜索蓝牙设备失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  }
  /**
   * 停止搜索蓝牙设备
   */
  stopDevicesDiscovery() {
    return new Promise((resolve, reject) => {
      uni.stopBluetoothDevicesDiscovery({
        success: res => {
          console.log('停止搜索蓝牙设备成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('停止搜索蓝牙设备失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  }
  /**
   * 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
   */
  getDevices() {
    return new Promise((resolve, reject) => {
      uni.getBluetoothDevices({
        success: res => {
          const list = res.devices.filter(v => v.localName)
          console.log('获取蓝牙设备成功', JSON.stringify(list))
          resolve(list)
        },
        fail: e => {
          console.log('获取蓝牙设备失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  }
  /**
   * 获取本机蓝牙适配器状态
   */
  getAdapterState() {
    return new Promise((resolve, reject) => {
      uni.getBluetoothAdapterState({
        success: res => {
          console.log('获取本机蓝牙适配器状态成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('获取本机蓝牙适配器状态失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  }
  // TODO 低功耗蓝牙API ********************************************************************
  /**
   * 连接低功耗蓝牙
   */
  createConnection(deviceId) {
    return new Promise((resolve, reject) => {
      uni.createBLEConnection({
        deviceId,
        success: res => {
          this.setDevice({ deviceId })
          this.stopDevicesDiscovery() // 连接蓝牙成功后 停止搜索蓝牙设备
          console.log('连接低功耗蓝牙成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('连接低功耗蓝牙失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  }
  /**
   * 断开与低功耗蓝牙设备的连接
   */
  closeConnection() {
    const { deviceId } = this.device
    return new Promise((resolve, reject) => {
      uni.closeBLEConnection({
        deviceId,
        success: res => {
          this.resetDevice()
          console.log('断开低功耗蓝牙成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('断开低功耗蓝牙失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  }
  /**
   * 获取所有服务
   */
  getServices() {
    const { deviceId } = this.device
    return new Promise((resolve, reject) => {
      uni.getBLEDeviceServices({
        // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
        deviceId,
        success: res => {
          console.log('获取设备服务成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('获取设备服务失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  }

  /**
   * 获取某个服务下的所有特征值
   */
  getCharacteristics() {
    const { deviceId, serviceId } = this.device
    return new Promise((resolve, reject) => {
      uni.getBLEDeviceCharacteristics({
        deviceId,
        serviceId,
        success: res => {
          this.setDevice({ deviceId, serviceId })
          console.log('获取特征值成功', JSON.stringify(res))
          resolve(res)
          // 批量notify 特征值
          for (let i in res.characteristics) {
            let item = res.characteristics[i]
            let characteristicId = item.uuid
            let notify = item.properties.notify
            this.setDevice({ characteristicId, notify }).notifyValueChange()
            sleep(1)
          }
        },
        fail: e => {
          console.log('获取特征值失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  }
  /**
   * 订阅操作成功后需要设备主动更新特征值的 value，才会触发 uni.onBLECharacteristicValueChange 回调。
   */
  notifyValueChange() {
    const { deviceId, serviceId, characteristicId, notify } = this.device
    console.log({ deviceId, serviceId, characteristicId, notify })
    return new Promise((resolve, reject) => {
      if (!notify) {
        reject({ msg: 'not support notify' })
      } else {
        uni.notifyBLECharacteristicValueChange({
          state: true,
          deviceId,
          serviceId,
          characteristicId,
          success: res => {
            console.log('启用蓝牙设备特征值notify成功', JSON.stringify(res))
            resolve(res)
          },
          fail: e => {
            console.log('启用蓝牙设备特征值notify失败', JSON.stringify(e))
            reject(e)
          }
        })
      }
    })
  }
  /**
   * 读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持 read 才可以成功调用
   */
  readValue() {
    const { deviceId, serviceId, characteristicId } = this.device
    return new Promise((resolve, reject) => {
      uni.readBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId,
        success: res => {
          console.log('读取设备数据值成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('读取设备数据值失败', JSON.stringify(res))
          reject(e)
        }
      })
    })
  }
  /**
   * 向低功耗蓝牙设备特征值中写入二进制数据
   * @param {*} param0
   */
  writeValue(buffer) {
    const { deviceId, serviceId, characteristicId } = this.device
    return new Promise((resolve, reject) => {
      uni.writeBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId,
        value: buffer,
        success: res => {
          console.log('写入成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('写入失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  }
  /**
   * 向低功耗蓝牙设备特征值中写入二进制数据
   */
  writeLoop(buffer, delay) {
    let pos = 0
    let bytes = buffer.byteLength
    let once = 20 // 每包控制大小

    while (bytes > 0) {
      let tmpBuffer
      sleep(delay)
      if (bytes > once) {
        tmpBuffer = buffer.slice(pos, pos + once)
        pos += once
        bytes -= once
        this.writeValue(tmpBuffer)
      } else {
        tmpBuffer = buffer.slice(pos, pos + bytes)
        pos += bytes
        bytes -= bytes
        this.writeValue(tmpBuffer)
      }
    }
  }
}

export { Bluetooth }
