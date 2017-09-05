// page/home/qrcode/qrcode.js
// var utils = require('../../../utils/util.js');
var promisefy = require('../../../utils/promise.js');
var app = getApp();
Page({
  data: {
    qrcodeObj: {
      logo: '/icon/logo.png',
      title: '',
      qrcode: '',
      des: '微信【扫一扫】即可获得联系方式及公司详细信息'
    },
    title: ''
  },
  onLoad: function (options) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    // 获取企业信息
    promisefy.EnterprisePromise({
      url: 'GetEnterpriseInfo',
      method: 'POST',
      data: {
        input: {
          EnterpriseId: app.globalData.EnterpriseId,
          Longitude: app.globalData.addLog.Longitude,
          Latitude: app.globalData.addLog.Latitude
        }
      }
    }).then(res => {
      this.setData({ title: res.data.Name })

      //获取参数 access_token
      return promisefy.wxRequest({
        url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxa12924b3d5de635a&secret=1ef4b00561f570d0a0a74767f1e01679',
      })
    }).then(res => {
      //获取二维码
      return promisefy.BaseDataPromise({
        url: 'GetQcCode',
        method: 'post',
        data: {
          path: "/page/home/mybussine/mybussine?enterpriseId=" + app.globalData.EnterpriseId,
          width: 430,
          token: res.data.access_token,
          EnterpriseId: app.globalData.EnterpriseId
        },
      })
    }).then(res => {
      var imgurl = app.globalData.rootUrl + res.data.Data;
      that.setData({
        qrcodeObj: {
          logo: '/icon/logo.png',
          title: this.data.title,
          qrcode: imgurl,
          des: '微信【扫一扫】即可获得联系方式及公司详细信息'
        }
      })
    }).done();

  }
  // savePhoto: function () {
  //   wx.canIUse('saveImageToPhotosAlbum')
  //   wx.canIUse('openBluetoothAdapter')
  //   if (wx.openBluetoothAdapter) {
  //     wx.openBluetoothAdapter()
  //   } else {
  //     // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
  //     wx.showModal({
  //       title: '提示',
  //       content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
  //     })
  //   }

  //   let that = this
  //   wx.saveImageToPhotosAlbum({
  //     filePath: that.data.qrcodeObj.qrcode,
  //     success(res) {
  //     },
  //     fail: function (res) {
  //     },
  //     complete: function (res) {
  //     }
  //   })
  // }
})