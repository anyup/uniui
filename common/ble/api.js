module.exports = {
  /**
   * 初始化蓝牙设备
   */
  openBluetoothAdapter() {
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
  },
  /**
   * 开始搜索蓝牙设备
   */
  startBluetoothDevicesDiscovery() {
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
  },
  /**
   * 停止搜索蓝牙设备
   */
  stopBluetoothDevicesDiscovery(types) {
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
  },
  /**
   * 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
   */
  getBluetoothDevices() {
    return new Promise((resolve, reject) => {
      uni.getBluetoothDevices({
        success: res => {
          const list = res.devices.filter(v => v.localName)
          // console.log('获取蓝牙设备成功', JSON.stringify(list))
          resolve(list)
        },
        fail: e => {
          console.log('获取蓝牙设备失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  },
  /**
   * 获取本机蓝牙适配器状态
   */
  getBluetoothAdapterState() {
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
  },
  /**
   * 连接低功耗蓝牙
   */
  createBLEConnection({ deviceId }) {
    return new Promise((resolve, reject) => {
      uni.createBLEConnection({
        deviceId,
        success: res => {
          console.log('连接低功耗蓝牙成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('连接低功耗蓝牙失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  },
  /**
   * 断开与低功耗蓝牙设备的连接
   */
  closeBLEConnection({ deviceId }) {
    return new Promise((resolve, reject) => {
      uni.closeBLEConnection({
        deviceId,
        success: res => {
          console.log('断开低功耗蓝牙成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('断开低功耗蓝牙失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  },
  /**
   * 获取所有服务
   */
  getBLEDeviceServices({ deviceId }) {
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
  },

  /**
   * 获取某个服务下的所有特征值
   */
  getBLEDeviceCharacteristics({ deviceId, serviceId }) {
    return new Promise((resolve, reject) => {
      uni.getBLEDeviceCharacteristics({
        deviceId,
        serviceId,
        success: res => {
          console.log('获取特征值成功', JSON.stringify(res))
          resolve(res)
          // 批量notify 特征值
          for (let i in res.characteristics) {
            let item = res.characteristics[i]
            let characteristicId = item.uuid
            let notify = item.properties.notify
            module.exports.notifyBLECharacteristicValueChange({ deviceId, serviceId, characteristicId, notify })
          }
        },
        fail: e => {
          console.log('获取特征值失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  },
  /**
   * 订阅操作成功后需要设备主动更新特征值的 value，才会触发 uni.onBLECharacteristicValueChange 回调。
   */
  notifyBLECharacteristicValueChange({ deviceId, serviceId, characteristicId, notify }) {
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
  },

  /**
   * 	断开蓝牙模块
   */
  closeBluetoothAdapter() {
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
  },
  /**
   * 读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持 read 才可以成功调用
   */
  readBLECharacteristicValue({ deviceId, serviceId, characteristicId }) {
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
  },
  /**
   * 向低功耗蓝牙设备特征值中写入二进制数据
   * @param {*} param0
   */
  writeBLECharacteristicValue({ deviceId, serviceId, characteristicId, buffer }) {
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
  },
  /**
   * 获取分片数组
   */
  getSliceBufferList(buffer) {
    let pos = 0
    let bytes = buffer.byteLength
    let maxChunk = 20 // 每包控制大小
    let list = []
    while (bytes > 0) {
      let tmpBuffer
      if (bytes > maxChunk) {
        tmpBuffer = buffer.slice(pos, pos + maxChunk)
        pos += maxChunk
        bytes -= maxChunk
      } else {
        tmpBuffer = buffer.slice(pos, pos + bytes)
        pos += bytes
        bytes -= bytes
      }
      list.push(tmpBuffer)
    }
    return list
  },
  /**
   * 向低功耗蓝牙设备特征值中写入二进制数据
   */
  async writeBLEValueLoop({ deviceId, serviceId, characteristicId, buffer }) {
    const maxRetries = 3 // 最大重试次数

    let items = this.getSliceBufferList(buffer)
    for (const item of items) {
      let retries = 0
      while (retries <= maxRetries) {
        try {
          const response = await this.writeBLECharacteristicValue({ deviceId, serviceId, characteristicId, buffer: item })
          if (response) {
            console.log(`Successfully sent ${item}`)
            break // 请求成功后跳出while循环，进行下一项
          }
        } catch (error) {
          retries++
          console.error(`Failed to send ${item}, retrying... (${retries}/${maxRetries})`)
          if (retries > maxRetries) {
            console.error(`Max retries reached, failed to send ${item}.`)
            break // 达到最大重试次数后停止重试
          }
          // 可以根据需要添加延迟再重试
          await new Promise(resolve => setTimeout(resolve, 500 * retries)) // 指数退避
        }
      }
    }
    console.log('All items sent successfully.')
  },
  /**
   * 向低功耗蓝牙设备特征值中写入二进制数据
   */
  writeBLEValue({ deviceId, serviceId, characteristicId, buffer }) {
    let pos = 0
    let bytes = buffer.byteLength
    let maxChunk = 20 // 每包控制大小，数据切片

    while (bytes > 0) {
      let tmpBuffer
      sleep(90) // 90ms的频率打印，否则会丢包，打印失败
      if (bytes > maxChunk) {
        tmpBuffer = buffer.slice(pos, pos + maxChunk)
        pos += maxChunk
        bytes -= maxChunk
      } else {
        tmpBuffer = buffer.slice(pos, pos + bytes)
        pos += bytes
        bytes -= bytes
      }
      this.writeBLECharacteristicValue({ deviceId, serviceId, characteristicId, buffer: tmpBuffer })
    }
  }
}

function sleep(delay) {
  var start = new Date().getTime()
  while (new Date().getTime() - start < delay) {
    continue
  }
}
