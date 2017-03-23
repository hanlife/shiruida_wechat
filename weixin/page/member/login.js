// page/member/login.js
Page({
  data: {
    register: false,
    companyName: false,
    array: ["采购商", "供应商"],
    index: 0,
    Mobile: '',
    Code: '',
    Name: '',
    Type: '0',
    codeTxt: '发送验证码',
    disabled_code: false,
    disabled_picker:false
  },
  Eventbinding: function (e) {
    //绑定按钮

    //已成功认证
    wx.showModal({
      title: '绑定成功',
      content: '贵公司已成功认证，可像公司主账号申请权限',
      showCancel: true,
      cancelText: "继续浏览",
      cancelColor: "#cccccc",
      confirmText: '立即申请',
      confirmColor: "#24699D",
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '/page/home/mybussine/mybussine'
          })
        } else {
          wx.switchTab({
            url: '/page/ordinarylist/index/index'
          })
        }
      },
      fail: function () {

      }
    })
    //未认证
     wx.showModal({
      title: '绑定成功',
      content: '贵公司未认证，完善资料后可提交认证',
      showCancel: true,
      cancelText: "继续浏览",
      cancelColor: "#cccccc",
      confirmText: '完善资料',
      confirmColor: "#24699D",
      success: function (res) {
        if (res.confirm) {
         wx.switchTab({
            url: 'page/home/body/body'
          })
        } else {
          wx.switchTab({
            url: '/page/ordinarylist/index/index'
          })
        }
      },
      fail: function () {

      }
    })
  },
  //手机号输入框
  bindMobile: function (e) {
    this.setData({
      Mobile: e.detail.value
    })
  },
  //验证码输入框
  bindCode: function (e) {
    var code = e.detail.value;
    var t = this;
    if (code.length == 4) {
      // wx.request({
      //   url: 'https://URL',
      //   data: {code:code},
      //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //   // header: {}, // 设置请求的 header
      //   success: function (res) {
      //    
      //   },
      //   fail: function () {
      //     // fail
      //   },
      //   complete: function () {
      //     // complete
      //   }
      // })
    }
  },
  //发送验证码
  EventCode: function (e) {
    var mobile = this.data.Mobile;
    var ismobile = /^1[3|4|5|7|8]\d{9}$/;
    if (!ismobile.test(mobile)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确手机号',
        success: function (res) {
          if (res.confirm) {

          }
        }
      })
      this.setData({
        Mobile: ''
      })
    } else {
      var countdown = 60;
      var t = this;
      this.setData({
        disabled_code: true
      })
      var Time = setInterval(Run, 1000);//计时器
      function Run() {
        countdown--;
        if (countdown == 0) {
          t.setData({
            disabled_code: false,
            codeTxt: '重新获取'
          })
          clearInterval(Time);
        } else {

          t.setData({
            codeTxt: '已发送' + countdown + 's'
          })
        }
      }

      // wx.request({
      //   url: 'https://api.getweapp.com/vendor/douban/coming_soon',
      //   data: { mobile: mobile },
      //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //   // header: {}, // 设置请求的 header
      //   success: function (res) {
      //     // success
      //   this.setData({
      //   register: true,
      //   companyName: true
      // })
      //   },
      //   fail: function () {
      //     // fail
      //   },
      //   complete: function () {
      //     // complete
      //   }
      // })
    }


  },
  accountType: function (e) {
    //账号类型
    this.setData({
      index: e.detail.value
    })
    return {
      Type: e.detail.value
    }
  },
  onShareAppMessage: function () {
    //分享
    return {
      title: '智造360绑定手机',
      path: '/page/member'
    }
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