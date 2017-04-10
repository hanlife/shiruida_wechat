// page/home/body/body.js
var utils = require("../../../utils/util.js");
var app = getApp();

Page({
  data: {
    imageUrl: {
      iconArrow: "/icon/icon_arrow.png"
    },
    nickName: "",           //微信名称
    avatarUrl: "",          //微信头像Url
    iphone: "",  //手机号 
    pickerArray: [],
    pickerIndex: 1,
    equipmentUrlFlag: true,   //判断是否有添加设备信息  有则跳转设备信息页面  没则添砖添加设备页面
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

    
    var nickName = wx.getStorageSync('nickName');
    var avatarUrl = wx.getStorageSync('avatarUrl');
    that.setData({
      nickName: nickName,
      avatarUrl: avatarUrl
    })

    //基础资料
    utils.MemberInfoRequest({
      url: 'Index',
      method: 'POST',
      callback: function (res) {
        var nickName = wx.getStorageSync('nickName');
        app.globalData.Id = res.data.Id;
        app.globalData.EnterpriseId = res.data.EnterpriseId;
        // res.data.IsMainMember = false;
        that.setData({
          EnterpriseId: res.data.EnterpriseId,
          iphone: res.data.Mobile,
          natureFlag: !res.data.IsMainMember,
          IsMainMember: res.data.IsMainMember
        })
        app.globalData.IsMainMember = res.data.IsMainMember
        //企业认证
        utils.EnterpriseRequest({
          url: 'GetCertificationInfo',
          method: 'POST',
          callback: function (res) {
            if(!res.data.Status){
              res.data.Status = "主账号不接受成为子账号"
            }
            that.setData({
              checkStatusText:  res.data.Status
            })
            var EnterpriseNatures = res.data.EnterpriseNatures;
            var pickerIndex = 0;
            //企业性质
            utils.BaseDataRequest({
              url: 'GetNatures',
              callback: function (res) {
                for (let i = 0; i < res.data.length; i++) {
                  if (res.data[i].Id == EnterpriseNatures) {
                    pickerIndex = i
                  }
                }
                that.setData({
                  pickerArray: res.data,
                  pickerIndex:  pickerIndex
                })
                wx.hideToast();
                wx.stopPullDownRefresh();
              }
            })

          }
        })

      }
    })



  },
  onPullDownRefresh: function () {
    app.getUserInfo(this.onLoad);
  },
  onReady: function () {
    // 页面渲染完成
    
  },
  bindPickerChange: function (e) {
    var that = this;
    this.setData({
      pickerIndex: e.detail.value
    })
    utils.EnterpriseRequest({
      url: 'UpdateNature',
      method: 'POST',
      data: { natureId: that.data.pickerArray[e.detail.value].Id },
      callback: function (res) {}
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
    utils.UserRequest({
      url: 'Unbundled',
      method: 'POST',
      callback: function (res) {
        setStorage("IsWxBind", res.data.Data.IsWxBind); //手机号是否绑定
        setStorage("IsWxLogin", res.data.Data.IsWxLogin); //code换session_key是否成功
        setStorage("isImLogin", res.data.Data.isImLogin); //平台是否登录成功
        wx.redirectTo({ url: '/page/member/login' })
      }
    })

    function setStorage(key, val) {
      wx.setStorage({
        key: key,
        data: val
      });
    }
  },
  QRcodeTap: function () {
    wx.navigateTo({ url: '/page/home/qrcode/qrcode' });
  },
  toMyInfo: function () {
    wx.navigateTo({ url: '/page/home/myInformation/myInformation' });
  },
  ischild: function(){
    wx.showModal({
      title: '提示',
      content: '子账号没有操作权限',
      showCancel: false,
      confirmText: '知道了'


    })
  }


})