// page/error/index.js
var appInstance = getApp(); //获取全局对象

Page({
  data: {
    show: false
  },
  openAddress: function () {
    var that = this;
    wx.openSetting({
      success: (res) => {
        var data = res;
        appInstance.getUserInfo();
        //获取当前的地理位置
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            appInstance.globalData.addLog.Latitude = res.latitude
            appInstance.globalData.addLog.Longitude = res.longitude
            if (data.authSetting["scope.userInfo"] && data.authSetting["scope.userLocation"]) {
              setStorage("guide", 'true');
              appInstance.globalData.errorPage = true;
              wx.switchTab({
                url: '/page/supplier/supplier',
              })
            }
          },
          fail: function () {
            that.setData({
              show: true
            })
          }
        })
        /*
         * res.authSetting = {
         *   "scope.userInfo": true,
         *   "scope.userLocation": true
         * }
         */
      }
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    var that = this;
    // 页面显示
    //获取当前的地理位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        appInstance.globalData.addLog.Latitude = res.latitude
        appInstance.globalData.addLog.Longitude = res.longitude
        wx.getSetting({
          success: (data) => {
            if (data.authSetting["scope.userInfo"] && data.authSetting["scope.userLocation"]) {
              setStorage("guide", 'true');
              appInstance.globalData.errorPage = true;
              wx.switchTab({
                url: '/page/supplier/supplier',
              })
            }
            /*
             * res.authSetting = {
             *   "scope.userInfo": true,
             *   "scope.userLocation": true
             * }
             */
          }
        })
      }
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})

function setStorage(key, val) {
  wx.setStorageSync(key, val);
}