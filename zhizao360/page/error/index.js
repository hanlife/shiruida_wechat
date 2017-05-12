// page/error/index.js
var appInstance = getApp(); //获取全局对象

Page({
  data: {},
  openAddress: function () {
    wx.openSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"] && res.authSetting["scope.userLocation"]) {
          wx.switchTab({
            url: '/page/ordinarylist/index',
          })
        }
        wx.getUserInfo({
          success: function (res) {
            var userInfo = res.userInfo
            var nickName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            appInstance.globalData.addLog.Nickname =userInfo.nickName;
            setStorage('nickName', nickName);
            setStorage('avatarUrl', avatarUrl);
          }
        })
        //获取当前的地理位置
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            appInstance.globalData.addLog.Latitude = res.latitude
            appInstance.globalData.addLog.Longitude = res.longitude
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
    // 页面显示
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