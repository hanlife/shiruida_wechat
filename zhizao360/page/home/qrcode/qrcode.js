// page/home/qrcode/qrcode.js
var utils = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    qrcodeObj: {
      logo: '/icon/logo.png',
      title: '机械加工定制服务平台',
      qrcode: '',
      des: '微信【扫一扫】即可获得联系方式及公司详细信息'
    }
  },
  onLoad: function (options) {
    var that = this;

    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxa12924b3d5de635a&secret=1ef4b00561f570d0a0a74767f1e01679',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        utils.BaseDataRequest({
          url: 'GetQcCode',
          method: 'post',
          data: {
            path: "/page/home/mybussine/mybussine?EnterpriseId=" + app.globalData.EnterpriseId,
            width: 430,
            token: res.data.access_token,
            EnterpriseId: app.globalData.EnterpriseId
          },
          callback: function (res) {
            var imgurl = app.globalData.rootUrl + res.data.Data;
            that.setData({
              qrcodeObj: {
                logo: '/icon/logo.png',
                title: '机械加工定制服务平台',
                qrcode: imgurl,
                des: '微信【扫一扫】即可获得联系方式及公司详细信息'
              }
            })
          },
          fail: function () {
          },
          complete: function () {
          }
        })
      }

    })
  }
})