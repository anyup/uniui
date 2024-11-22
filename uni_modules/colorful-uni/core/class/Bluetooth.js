function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() - start < delay) {
    continue;
  }
}

/**
 * 蓝牙工具类
 * @author anyup
 */
class Bluetooth {
  constructor() {
    this.device = { notify: true };
    this.adapterState = {
      discovering: false,
      available: false
    };
  }
  setDevice(value) {
    this.device = { ...this.device, ...value };
    return this;
  }
  reset() {
    this.device = { notify: true };
    this.adapterState = {
      discovering: false,
      available: false
    };
    return this;
  }
  /**
   * 初始化蓝牙设备
   */
  openBluetoothAdapter() {
    return new Promise((resolve, reject) => {
      uni.openBluetoothAdapter({
        success: (res) => {
          console.log("初始化蓝牙模块成功", JSON.stringify(res));
          resolve(res);
        },
        fail: (e) => {
          console.log("初始化蓝牙模块失败", JSON.stringify(e));
          reject(e);
        }
      });
    });
  }
  /**
   * 	断开蓝牙模块
   */
  closeBluetoothAdapter() {
    return new Promise((resolve, reject) => {
      uni.closeBluetoothAdapter({
        success: (res) => {
          console.log("断开蓝牙模块成功", JSON.stringify(res));
          resolve(res);
        },
        fail: (e) => {
          console.log("断开蓝牙模块失败", JSON.stringify(e));
          reject(e);
        }
      });
    });
  }
  /**
   * 开始搜索蓝牙设备
   */
  startBluetoothDevicesDiscovery() {
    return new Promise((resolve, reject) => {
      uni.startBluetoothDevicesDiscovery({
        success: (res) => {
          console.log("开始搜索蓝牙设备成功", JSON.stringify(res));
          resolve(res);
        },
        fail: (e) => {
          console.log("开始搜索蓝牙设备失败", JSON.stringify(e));
          reject(e);
        }
      });
    });
  }
  /**
   * 停止搜索蓝牙设备
   */
  stopBluetoothDevicesDiscovery() {
    return new Promise((resolve, reject) => {
      uni.stopBluetoothDevicesDiscovery({
        success: (res) => {
          console.log("停止搜索蓝牙设备成功", JSON.stringify(res));
          resolve(res);
        },
        fail: (e) => {
          console.log("停止搜索蓝牙设备失败", JSON.stringify(e));
          reject(e);
        }
      });
    });
  }
  onBluetoothDeviceFound(callback) {
    uni.onBluetoothDeviceFound(() => {
      // 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
      this.getBluetoothDevices().then((res) => {
        callback && callback(res);
      });
    });
  }

  /**
   * 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
   */
  getBluetoothDevices() {
    return new Promise((resolve, reject) => {
      uni.getBluetoothDevices({
        success: (res) => {
          const list = res.devices.filter((v) => v.localName);
          console.log("获取蓝牙设备成功", JSON.stringify(list));
          resolve(list);
        },
        fail: (e) => {
          console.log("获取蓝牙设备失败", JSON.stringify(e));
          reject(e);
        }
      });
    });
  }
  /**
   * 获取本机蓝牙适配器状态
   */
  getBluetoothAdapterState() {
    return new Promise((resolve, reject) => {
      uni.getBluetoothAdapterState({
        success: (res) => {
          this.adapterState = res;
          console.log("获取本机蓝牙适配器状态成功", JSON.stringify(res));
          resolve(res);
        },
        fail: (e) => {
          console.log("获取本机蓝牙适配器状态失败", JSON.stringify(e));
          reject(e);
        }
      });
    });
  }
  // TODO 低功耗蓝牙API ********************************************************************
  /**
   * 连接低功耗蓝牙
   */
  createBLEConnection(device) {
    return new Promise((resolve, reject) => {
      uni.createBLEConnection({
        deviceId: device.deviceId,
        success: (res) => {
          this.setDevice(device);
          this.stopBluetoothDevicesDiscovery(); // 连接蓝牙成功后 停止搜索蓝牙设备
          console.log("连接低功耗蓝牙成功", JSON.stringify(res));
          resolve(res);
        },
        fail: (e) => {
          console.log("连接低功耗蓝牙失败", JSON.stringify(e));
          reject(e);
        }
      });
    });
  }
  /**
   * 断开与低功耗蓝牙设备的连接
   */
  closeBLEConnection() {
    const { deviceId } = this.device;
    return new Promise((resolve, reject) => {
      if (deviceId) {
        uni.closeBLEConnection({
          deviceId,
          success: (res) => {
            this.reset();
            console.log("断开低功耗蓝牙成功", JSON.stringify(res));
            resolve(res);
          },
          fail: (e) => {
            console.log("断开低功耗蓝牙失败", JSON.stringify(e));
            reject(e);
          }
        });
      } else {
        reject({ msg: "未连接蓝牙设备，无需断开" });
      }
    });
  }
  /**
   * 获取所有服务
   */
  getBLEDeviceServices() {
    const { deviceId } = this.device;
    return new Promise((resolve, reject) => {
      uni.getBLEDeviceServices({
        // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
        deviceId,
        success: (res) => {
          console.log("获取设备服务成功", JSON.stringify(res));
          resolve(res);
        },
        fail: (e) => {
          console.log("获取设备服务失败", JSON.stringify(e));
          reject(e);
        }
      });
    });
  }

  /**
   * 获取某服务下的支持读写的特征值
   */
  async getReadWriteBLEValue() {
    return new Promise(async (resolve, reject) => {
      try {
        const { deviceId } = this.device;
        let res = await this.getBLEDeviceServices(); // 获取所有服务
        for (const service of res.services) {
          const serviceId = service.uuid;
          const characteristicsRes = await this.getBLEDeviceCharacteristicsById(
            {
              deviceId,
              serviceId
            }
          );
          if (characteristicsRes) {
            console.log(serviceId, characteristicsRes);
            // 过滤出可以读写的特征值
            const findList = characteristicsRes.characteristics.filter(
              (item) =>
                item.properties.read &&
                item.properties.write &&
                item.properties.notify &&
                item.properties.indicate
            );
            if (findList.length > 0) {
              this.setDevice({
                serviceId,
                characteristicId: findList[0].uuid,
                characteristic: findList[0]
              });
              console.log(`寻找到可以读写的特性`, serviceId, findList[0].uuid);
              return resolve({
                status: 1,
                msg: "成功找到可以读写的特征值",
                data: {
                  serviceId,
                  characteristicId: findList[0].uuid,
                  characteristic: findList[0]
                }
              });
            }
          }
        }
        return reject("未找到可以读写的特征值");
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * 根据deviceId, serviceId获取某个服务下的所有特征值
   */
  getBLEDeviceCharacteristicsById({ deviceId, serviceId }) {
    return new Promise((resolve, reject) => {
      uni.getBLEDeviceCharacteristics({
        deviceId,
        serviceId,
        success: (res) => {
          resolve(res);
        },
        fail: (e) => {
          reject(e);
        }
      });
    });
  }

  /**
   * 获取某个服务下的所有特征值
   */
  getBLEDeviceCharacteristics() {
    const { deviceId, serviceId } = this.device;
    return new Promise((resolve, reject) => {
      uni.getBLEDeviceCharacteristics({
        deviceId,
        serviceId,
        success: (res) => {
          this.setDevice({ deviceId, serviceId });
          console.log("获取特征值成功", JSON.stringify(res));
          resolve(res);
          // 批量notify 特征值
          for (let i in res.characteristics) {
            let item = res.characteristics[i];
            let characteristicId = item.uuid;
            let notify = item.properties.notify;
            this.setDevice({
              characteristicId,
              notify
            }).notifyBLECharacteristicValueChange();
            sleep(1);
          }
        },
        fail: (e) => {
          console.log("获取特征值失败", JSON.stringify(e));
          reject(e);
        }
      });
    });
  }
  /**
   * 订阅操作成功后需要设备主动更新特征值的 value，才会触发 uni.onBLECharacteristicValueChange 回调。
   */
  notifyBLECharacteristicValueChange() {
    const { deviceId, serviceId, characteristicId, notify } = this.device;
    console.log({ deviceId, serviceId, characteristicId, notify });
    return new Promise((resolve, reject) => {
      if (!notify) {
        reject({ msg: "not support notify" });
      } else {
        uni.notifyBLECharacteristicValueChange({
          state: true,
          deviceId,
          serviceId,
          characteristicId,
          success: (res) => {
            console.log("启用蓝牙设备特征值notify成功", JSON.stringify(res));
            resolve(res);
          },
          fail: (e) => {
            console.log("启用蓝牙设备特征值notify失败", JSON.stringify(e));
            reject(e);
          }
        });
      }
    });
  }
  /**
   * 读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持 read 才可以成功调用
   */
  readBLECharacteristicValue() {
    const { deviceId, serviceId, characteristicId } = this.device;
    return new Promise((resolve, reject) => {
      uni.readBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId,
        success: (res) => {
          console.log("读取设备数据值成功", JSON.stringify(res));
          resolve(res);
        },
        fail: (e) => {
          console.log("读取设备数据值失败", JSON.stringify(res));
          reject(e);
        }
      });
    });
  }
  /**
   * 向低功耗蓝牙设备特征值中写入二进制数据
   * @param {*} param0
   */
  writeBLECharacteristicValue(buffer) {
    const { deviceId, serviceId, characteristicId } = this.device;
    return new Promise((resolve, reject) => {
      uni.writeBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId,
        value: buffer,
        success: (res) => {
          console.log("写入成功", JSON.stringify(res));
          resolve(res);
        },
        fail: (e) => {
          console.log("写入失败", JSON.stringify(e));
          reject(e);
        }
      });
    });
  }
  /**
   * 向低功耗蓝牙设备特征值中写入二进制数据
   */
  async writeBLEValueLoop(buffer) {
    return new Promise(async (resolve, reject) => {
      const maxRetries = 1; // 最大重试次数

      let items = this.getSliceBufferList(buffer);
      for (const item of items) {
        let retries = 0;
        while (retries <= maxRetries) {
          try {
            const response = await this.writeBLECharacteristicValue(item);
            if (response) {
              console.log(`Successfully sent ${item}`);
              break; // 请求成功后跳出while循环，进行下一项
            }
          } catch (error) {
            retries++;
            console.error(
              `Failed to send ${item}, retrying... (${retries}/${maxRetries})`
            );
            if (retries > maxRetries) {
              console.error(`Max retries reached, failed to send ${item}.`);
              break; // 达到最大重试次数后停止重试
            }
            // 可以根据需要添加延迟再重试
            await new Promise((resolve) => setTimeout(resolve, 500 * retries)); // 指数退避
          }
        }
      }
      console.log("All items sent successfully.");
      resolve({ status: 1, msg: "发送完成" });
    });
  }
  /**
   * 向低功耗蓝牙设备特征值中写入二进制数据
   */
  writeBLEValueDelay(buffer, delay = 50) {
    let items = this.getSliceBufferList(buffer);
    for (const item of items) {
      setTimeout(() => {
        this.writeBLECharacteristicValue(item);
      }, delay);
      delay += delay; // 每次延迟时间
    }
  }
  /**
   * 获取分片数组
   */
  getSliceBufferList(buffer) {
    let pos = 0;
    let bytes = buffer.byteLength;
    let maxChunk = 20; // 每包控制大小
    let list = [];
    while (bytes > 0) {
      let tmpBuffer;
      if (bytes > maxChunk) {
        tmpBuffer = buffer.slice(pos, pos + maxChunk);
        pos += maxChunk;
        bytes -= maxChunk;
      } else {
        tmpBuffer = buffer.slice(pos, pos + bytes);
        pos += bytes;
        bytes -= bytes;
      }
      list.push(tmpBuffer);
    }
    return list;
  }
}

export { Bluetooth, sleep };
