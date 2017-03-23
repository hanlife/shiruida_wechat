//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    wx.showToast({
      title: '加载数据中',
      icon: 'loading',
      duration: 1000
    })
    var useData = {};
    //获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        useData.mobileInfo = {};
        useData.mobileInfo.model = res.model;
        useData.mobileInfo.pixelRatio = res.pixelRatio;
        useData.mobileInfo.windowWidth = res.windowWidth;
        useData.mobileInfo.windowHeight = res.windowHeight;
        useData.mobileInfo.language = res.language;
        useData.mobileInfo.version = res.version;
        useData.mobileInfo.platform = res.platform;
      }
    })
    //获取网络类型
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        useData.networkType = res.networkType;
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)

              useData.userInfo = res.userInfo
              useData.encryptedDatares.encryptedData
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
    //用户信息
  }
})