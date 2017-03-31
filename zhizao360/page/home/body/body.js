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
    iphone: "18819478660",  //手机号 
    pickerArray: ["采购商", "供应商"],
    pickerIndex: 0,
    equipmentUrlFlag: true,   //判断是否有添加设备信息  有则跳转设备信息页面  没则添砖添加设备页面
    checkStatusText: ""
  },
  onLoad: function (options) {
    utils.BaseDataRequest({
      url:'GetAboutUs',
      callback:function(res){
        console.log(res)
      }
    })



    // 页面初始化 options为页面跳转所带来的参数
    console.log(app);

    var that = this;
    var nickName = wx.getStorageSync('nickName');
    var avatarUrl = wx.getStorageSync('avatarUrl');
    var isImLogin = wx.getStorageSync('isImLogin');

    if (!isImLogin) {
      wx.showModal({
        title: '提示',
        content: '请您先登录账号',
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.redirectTo({ url: 'page/member/login'})
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }

      })
    }

    that.setData({
      nickName: nickName,
      avatarUrl: avatarUrl
    })

    utils.EnterpriseRequest({
      url: 'GetCertificationInfo',
      method: 'POST',
      callback: function (res) {
        that.setData({
          checkStatusText: res.data.Status
        })

        if (res.data.Status == "待提交") {
          // console.log("待提交")


        } else if (res.data.Status == "待审核") {
          // console.log("待审核")
          returnData(res.data, "提交审核", false);

        } else if (res.data.Status == "审核通过") {
          // console.log("审核通过")
          returnData(res.data, "审核通过", true);
        } else {
          //审核不同通过
          // console.log("审核不通过")
          returnData(res.data, "提交审核", false);
        }

        function returnData(data, buttonText, btnFlag) {
          var address = res.data.Province + " " + res.data.City + " " + res.data.County
          var industiyInforData = {
            companyName: res.data.Name,            //公司名称
            address: address,                      //地区
            addressDetail: res.data.Address,       //详细地址   
            photoArray: [app.globalData.rootUrl + res.data.LicenseImage],  //营业执照
            province: res.data.Province,
            city: res.data.City,
            county: res.data.County,
            longitude: res.data.Longitude,
            latitude: res.data.Latitude,
            status: res.data.Status,
            buttonText: buttonText,
            btnFlag: btnFlag
          }
          wx.removeStorageSync('industiyInforData');
          wx.setStorage({
            key: "industiyInforData",
            data: industiyInforData
          })
        }
      }
    })



  },
  onReady: function () {
    // 页面渲染完成
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      pickerIndex: e.detail.value
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
    console.log(111111)
    utils.UserRequest({
      url: 'Unbundled',
      method: 'POST',
      callback: function (res) {
        console.log(res)
        if (res.data.Succeed) {
          wx.redirectTo({ url: '/page/member/login' })
        }
      }
    })


  },
  QRcodeTap: function () {


    wx.navigateTo({
      url: '/page/home/qrcode/qrcode',
      success: function (res) {
        console.log("这是二维码")
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  toMyInfo: function () {
    wx.navigateTo({
      url: '/page/home/myInformation/myInformation',
      success: function (res) {
        console.log("这是基本资料")
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }


})