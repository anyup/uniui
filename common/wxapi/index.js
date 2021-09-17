const wxapi = {
  login: (provider = 'weixin') => {
    return new Promise((resolve, reject) => {
      uni.login({
        provider: provider,
        success(res) {
          resolve(res)
        },
        fail(e) {
          reject(e)
        }
      })
    })
  },
  // 获取用户登录
  getUserInfo: (provider = 'weixin') => {
    return new Promise((resolve, reject) => {
      uni.getUserInfo({
        provider: provider,
        success(res) {
          resolve(res)
        },
        fail(e) {
          reject(e)
        }
      })
    })
  },
  // 判断是否授权
  getSetting: key => {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
          console.log(res.authSetting)
          // res.authSetting = {
          //   "scope.userInfo": true,
          //   "scope.userLocation": true
          // }
          if (!res.authSetting[key]) {
            wx.authorize({
              scope: key,
              success() {
                resolve(true)
              },
              fail(e) {
                resolve(false)
              }
            })
          } else {
            resolve(true)
          }
        }
      })
    })
  },
  // 授权
  authorize: key => {
    return new Promise((resolve, reject) => {
      wx.authorize({
        scope: key,
        success() {
          resolve(true)
        }
      })
    })
  },
  // 打开权限
  openSetting: (text, showCancel = true, title = '提示', payload = {}) => {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: title,
        content: text,
        showCancel: showCancel,
        success: res => {
          if (res.confirm) {
            wx.openSetting()
          } else if (res.cancel) {
            reject(payload)
          }
        },
        fail: () => {
          reject(payload)
        }
      })
    })
  },
  // 选择图片
  chooseImage: count => {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: count || 1, // 默认9
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          console.log(res)
          const src = res.tempFilePaths[0]
          // resolve(res.tempFilePaths)
          resolve(res.tempFiles)
        }
      })
    })
  },
  // 上传图片
  uploadFile: (url, path, formData = {}) => {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url,
        filePath: path,
        name: 'file',
        formData: formData,
        success(res) {
          resolve(res)
        },
        fail(e) {
          reject(e)
        }
      })
    })
  },
  // 图片放大
  previewImage: (current, urls) => {
    if (!urls) {
      urls = [current]
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  // 获取图片信息
  getImageInfo: url => {
    console.log(url)
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: url,
        success(res) {
          resolve(res)
        },
        fail(e) {
          reject(e)
        }
      })
    })
  },
  // 保存图片至相册
  saveImageToPhotosAlbum: path => {
    return new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success(res) {
          resolve(res)
        },
        fail(e) {
          reject(e)
        }
      })
    })
  },
  // 获取WiFi状态
  getConnectedWifi: () => {
    return new Promise((resolve, reject) => {
      wx.getConnectedWifi({
        success(res) {
          resolve(res)
        },
        fail(e) {
          reject(e)
        }
      })
    })
  },
  // 微信支付
  requestPayment: data => {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: `prepay_id=${data.prepay_id}`,
        signType: 'MD5',
        paySign: data.paySign,
        success(res) {
          resolve(res)
        },
        fail(e) {
          reject(e)
        }
      })
    })
  },
  // 获取定位信息
  getLocation: () => {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        success(res) {
          resolve(res)
        },
        fail(e) {
          reject(e)
        }
      })
    })
  },
  // 扫码
  scanCode: () => {
    return new Promise((resolve, reject) => {
      wx.scanCode({
        onlyFromCamera: true,
        scanType: ['barCode', 'qrCode'],
        success(res) {
          resolve(res.result)
        }
      })
    })
  },
  // 新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx。
  openDocument: url => {
    return new Promise((resolve, reject) => {
      uni.downloadFile({
        url,
        success(res) {
          var filePath = res.tempFilePath
          uni.openDocument({
            filePath: filePath,
            success(r) {
              resolve(r)
            },
            fail(e) {
              reject(e)
            }
          })
        },
        fail(e) {
          reject(e)
        }
      })
    })
  }
}

export default wxapi
