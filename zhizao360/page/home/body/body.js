// page/home/body/body.js
var promisefy = require('../../../utils/promise.js');
var app = getApp();

Page({
  data: {
    imageUrl: {
      iconArrow: "/icon/icon_arrow.png"
    },
    nickName: "",           //微信名称
    avatarUrl: "",          //微信头像Url
    iphone: "",             //手机号 
    pickerArray: [],
    pickerIndex: 1,
    property:'',            //企业性质
    equipmentUrlFlag: true, //判断是否有添加设备信息  有则跳转设备信息页面  没则添砖添加设备页面
    checkStatusText: "",
    EnterpriseId: '',
    natureFlag: '',
    IsMainMember: ''
  },
  onLoad: function (options) {
    var that = this;
    var isImLogin = wx.getStorageSync('isImLogin');
    //没有登录跳转到绑定页面
    if (!isImLogin) {
      wx.redirectTo({ url: '/page/member/login' });
      return;
    }
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      mask: true,
      duration: 2000
    })
  
    app.getUserInfo(this.preOnLoad);
  },
  onShow: function () {
    promisefy.EnterprisePromise({   //企业认证
      url: 'GetCertificationInfo',
      method: 'POST'
    }).
      then(res => {
        if (!res.data.Status) {
          res.data.Status = "主账号不接受成为子账号"
        }
        this.setData({
          checkStatusText: res.data.Status,
          EnterpriseNatures: res.data.EnterpriseNatures
        })

        return promisefy.BaseDataPromise({   //企业性质
          url: 'GetNatures'
        })
      }).
      then(res => {
        var pickerIndex = 0;
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].Id == this.data.EnterpriseNatures) {
            pickerIndex = i
          }
        }
        this.setData({
          pickerArray: res.data,
          pickerIndex: pickerIndex,
          property: res.data[pickerIndex].Name
        })

      }).finally(() => {
        wx.hideToast();
        wx.stopPullDownRefresh();
      }).done();
  },
  onPullDownRefresh: function () {
    this.onLoad();
  },
  bindPickerChange: function (e) {
    var that = this;
    this.setData({
      pickerIndex: e.detail.value,
      property: that.data.pickerArray[e.detail.value].Name
    })
    //更新企业性质
    promisefy.EnterprisePromise({
      url: 'UpdateNature',
      method: 'POST',
      data: { natureId: that.data.pickerArray[e.detail.value].Id }
    })

  },
  toEquipment: function () {
    var equipmentUrl = null;
    if (this.data.equipmentUrlFlag) { //已有添加设备信息
      equipmentUrl = '/page/home/equipment/equipment';
    } else { //没有添加设备信息
      equipmentUrl = '/page/home/equipment/detail/detail';
    }
    wx.navigateTo({
      url: equipmentUrl,
    })
  },
  relieveBind: function () {
    wx.showModal({
      title: '提示',
      content: '是否确认解除绑定？',
      success: function (res) {
        if (res.confirm) {
          //解除绑定
          promisefy.UserPromise({
            url: 'Unbundled',
            method: 'POST'
          }).
            then(res => {
              setStorage("IsWxBind", res.data.Data.IsWxBind); //手机号是否绑定
              setStorage("IsWxLogin", res.data.Data.IsWxLogin); //code换session_key是否成功
              setStorage("isImLogin", res.data.Data.isImLogin); //平台是否登录成功
              wx.redirectTo({ url: '/page/member/login' })
            }).done();
        }
      }
    })
  },
  QRcodeTap: function () {
    wx.navigateTo({ url: '/page/home/qrcode/qrcode' });
  },
  toMyInfo: function () {
    wx.navigateTo({ url: '/page/home/myInformation/myInformation' });
  },
  ischild: function () {
    wx.showModal({
      title: '提示',
      content: '子账号没有操作权限',
      showCancel: false,
      confirmText: '知道了'
    })
  },
  preOnLoad: function () {
    var that = this;
    var nickName = wx.getStorageSync('nickName');
    var avatarUrl = wx.getStorageSync('avatarUrl');
    that.setData({
      nickName: nickName,
      avatarUrl: avatarUrl
    })

    promisefy.MemberInfoPromise({   //基础资料
      url: 'Index',
      method: 'POST'
    }).
      then(res => {
        var nickName = nickName;
        app.globalData.Id = res.data.Id;
        app.globalData.EnterpriseId = res.data.EnterpriseId;
        app.globalData.IsMainMember = res.data.IsMainMember
        that.setData({
          EnterpriseId: res.data.EnterpriseId,
          iphone: res.data.Mobile,
          natureFlag: !res.data.IsMainMember,
          IsMainMember: res.data.IsMainMember
        })
      }).done();


  }

})

function setStorage(key, val) {
  wx.setStorageSync(key, val)
}