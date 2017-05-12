// page/member/login.js
var common = require('../../utils/common.js');
var utils = require('../../utils/util.js');
var app = getApp();

var loginData = {
  Mobile: '',
  Name: '',
  RegisterLocation: '',
  EnterpriseName: "",
  EnterpriseNatures: "",
  Authcode: ''
}

Page({
  data: {
    register: false,//未注册时显示
    array: [],
    index: 0,
    Mobile: '',
    Type: '0',
    codeTxt: '发送验证码',
    disabled_code: false,
    disabled_picker: false,
    isLogin: true,
    ASPXAUTH: '',
    NET_SessionId: '',
    authcode: '',
    cookie: "",
    BindText: '绑定',
    focus: false
  },
  Eventbinding: function (e) {
    var that = this;
    loginData.Mobile = this.data.Mobile;
    loginData.Name = app.globalData.addLog.Nickname;
    loginData.RegisterLocation = app.globalData.RegisterLocation;
    if (!this.data.isLogin) {
      //注册
      utils.UserRequest({
        url: 'Register',
        method: "post",
        data: {
          input: loginData
        },
        callback: function (res) {
          if (res.data.Succeed) {
            setStorage("IsWxBind", res.data.Data.IsWxBind); //手机号是否绑定
            setStorage("IsWxLogin", res.data.Data.IsWxLogin); //code换session_key是否成功
            setStorage("isImLogin", res.data.Data.isImLogin); //平台是否登录成功
            app.globalData.guideline = false;
            if (!res.data.Data.enterprieId) {
              //已认证   立即申请
              Certification();
            } else {
              //未认证  完善资料
              NoCertification();
            }
          } else {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.ErrorMessage,
              success: function (res) {
              }
            })
          }
        }
      })
    } else {
      //绑定
      var rd_session = wx.getStorageSync("rd_session");
      wx.login({
        success: function (res) {
          utils.UserRequest({
            url: 'Bind',
            method: 'POST',
            data: {
              authcode: that.data.authcode,
              mobile: that.data.Mobile
            },
            callback: function (res) {
              if (res.data.Succeed) {
                setStorage("IsWxBind", res.data.Data.IsWxBind); //手机号是否绑定
                setStorage("IsWxLogin", res.data.Data.IsWxLogin); //code换session_key是否成功
                setStorage("isImLogin", res.data.Data.isImLogin); //平台是否登录成功
                app.globalData.guideline = false;
                wx.switchTab({
                  url: '/page/ordinarylist/index'
                })
              } else {
                wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: res.data.ErrorMessage,
                  success: function (res) {
                  }
                })
              }
            }
          });
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    }
  },
  //手机号输入框
  bindMobile: function (e) {
    this.setData({
      Mobile: e.detail.value
    })
  },
  //验证码输入框
  bindCode: function (e) {
    this.setData({
      authcode: e.detail.value
    })
    loginData.Authcode = e.detail.value;
    var t = this;
  },
  //发送验证码
  EventCode: function (e) {
    var that = this
    //判断手机号
    var bool = CheckMobile(this);
    if (!bool) {
      return;
    }
    //判断是否注册
    utils.UserRequest({
      url: 'CheckMobile',
      data: {
        mobile: that.data.Mobile
      },
      callback: function (res) {
        if (res.data.Data.message == "手机号未注册") {
          that.setData({
            isLogin: false,
            register: true,
            BindText: "注册",
            focus: true
          })
        } else {
          that.setData({
            isLogin: true,
            register: false,
            BindText: "绑定",
            focus: true
          })
        }
        if (!res.data.Succeed) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.ErrorMessage,
            success: function (res) {
            }
          })
        }
      }
    })

    //发送验证码
    utils.UserRequest({
      url: 'SendAuthCode',
      data: {
        mobile: that.data.Mobile
      },
      callback: function (res) {

      }
    })
    countDown(that);
  },
  //企业名称
  bindName: function (e) {
    loginData.EnterpriseName = e.detail.value;
  },
  ToOrdinarylist: function () {
    wx.switchTab({
      url: '/page/ordinarylist/index'
    })
  },
  accountType: function (e) {
    //企业性质
    this.setData({
      index: e.detail.value
    })
    loginData.EnterpriseNatures = this.data.array[e.detail.value].Id;
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
    var that = this;
    utils.BaseDataRequest({
      url: 'GetNatures',
      callback: function (res) {
        that.setData({
          array: res.data
        })
        loginData.EnterpriseNatures = res.data[0].Id;
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
    wx.getStorage({
      key: 'code',
      success: function (res) {
      }
    })
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
//验证手机号
function CheckMobile(that) {
  var mobile = that.data.Mobile;
  var ismobile = /^1[3|4|5|7|8]\d{9}$/;
  var bool = true;
  if (!ismobile.test(mobile)) {
    bool = false;
    wx.showModal({
      title: '提示',
      content: '请输入正确手机号',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          that.setData({
            Mobile: ''
          })
        }
      }
    })
  }
  return bool;
}
//倒计时
function countDown(that) {
  var countdown = 60;
  that.setData({
    disabled_code: true
  })
  var Time = setInterval(Run, 1000);//计时器
  function Run() {
    countdown--;
    if (countdown == 0) {
      that.setData({
        disabled_code: false,
        codeTxt: '重新获取'
      })
      clearInterval(Time);
    } else {
      that.setData({
        codeTxt: '已发送' + countdown + 's'
      })
    }
  }
}

//缓存
function setStorage(key, val) {
  wx.setStorageSync(key, val)
}

function Certification() {
  //已成功认证
  wx.showModal({
    title: '绑定成功',
    content: '贵公司已成功认证，可向公司主账号申请权限',
    showCancel: true,
    cancelText: "继续浏览",
    cancelColor: "#cccccc",
    confirmText: '立即申请',
    confirmColor: "#24699D",
    success: function (res) {
      if (res.confirm) {
        wx.redirectTo({
          url: '/page/home/myInformation/myInformation'
        })
      } else {
        wx.switchTab({
          url: '/page/ordinarylist/index'
        })
      }
    },
    fail: function () {

    }
  })
}

function NoCertification() {
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
          url: '/page/home/body/body'
        })
      } else {
        wx.switchTab({
          url: '/page/ordinarylist/index'
        })
      }
    },
    fail: function () {

    }
  })
}