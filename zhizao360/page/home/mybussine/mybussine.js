// page/home/mybussine/mybussine.js
var utils = require("../../../utils/util.js");
var app = getApp();
var EnterpriseId = "";
Page({
  data: {
    rootUrl: app.globalData.rootUrl,
    companyInfo: {},
    companyIntroduce: {},
    swiperNavArray: [],
    pictrue: [],
    pictrueIndex: 0, //控制显示那个模块的图片
    titleNavArray: ["公司介绍", "设备清单", "联系我们"],
    titleShowIndex: 0,
    content1: false,
    content2: true,
    content3: true,
    //设备清单数据数组
    equipmentListArray: [],
    //联系我们数据数组
    contactArray: [],
    background: ['green', 'red', 'yellow'],
    doorArray: [], //厂房大门
    workArray: [], //办公场所
    equipmentArray: [], //常规设备
    productArray: [], //产品图片
    indicatorDots: false, //是否显示面板指示点
    vertical: false,      // 左右还是上下
    autoplay: false,
    interval: 3000,
    duration: 1000,
    currentNum: 0, //显示的是第几张图片
    totalNum: 0,  //图片的总数
    collectFlag: false,  //图片是否收藏
    PathList1: [],
    PathList2: [],
    PathList3: [],
    PathList4: [],
    PathList5: [],
    PathList6: [],
    currentNum1: 1,
    currentNum2: 1,
    currentNum3: 1,
    currentNum4: 1,
    currentNum5: 1,
    currentNum6: 1,
    type:""
    


  },
  switchNav: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var pictrue = [];
    var totalNum = 0;
    var currentNum = 0;
    if (type == 1) {
      pictrue = that.data.PathList1;
        totalNum = that.data.PathList1.length;
        currentNum = that.data.currentNum1;
    }
    if (type == 2) {
      pictrue = that.data.PathList2;
        totalNum = that.data.PathList2.length;
        currentNum = that.data.currentNum2;
    }
    if (type == 3) {
      pictrue = that.data.PathList3;
        totalNum = that.data.PathList3.length;
        currentNum = that.data.currentNum3;
    }
    if (type == 4) {
      pictrue = that.data.PathList4;
        totalNum = that.data.PathList4.length;
        currentNum = that.data.currentNum4;
    }
    if (type == 5) {
      pictrue = that.data.PathList5;
        totalNum = that.data.PathList5.length;
        currentNum = that.data.currentNum5;
    }
    if (type == 6) {
      pictrue = that.data.PathList6;
        totalNum = that.data.PathList6.length;
        currentNum = that.data.currentNum6;
    }
    that.setData({
      pictrueIndex: index,
      pictrue: pictrue,
      totalNum: totalNum,
      type: type,
      currentNum: currentNum,
    })

  },
  selectTitle: function (e) {
    var content1 = true,
      content2 = true,
      content3 = true,
      index = e.currentTarget.dataset.index;
    if (index == 0) {
      content1 = false
    } else if (index == 1) {
      content2 = false
    } else {
      content3 = false
    }

    this.setData({
      content1: content1,
      content2: content2,
      content3: content3,
      titleShowIndex: index
    })

  },
  BtnCollect: function () {
    var that = this;
    //收藏企业
    utils.EnterpriseRequest({
      url: 'CollectEnterprise',
      method: 'POST',
      data: { enterpriseId: EnterpriseId },
      callback: function (res) {
        var title = '';
        if (res.data.Succeed) {
          that.setData({
            collectFlag: !that.data.collectFlag
          })
          if (that.data.collectFlag) {
            title = "收藏成功"
          } else {
            title = "取消成功"
          }

          wx.showToast({
            title: title,
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showModal({
            title: "提示",
            content: res.data.ErrorMessage,
            showCancel: false,
            confirmText: '知道了'
          })
        }
      }
    });
  },
  //打开地图
  oppenMap: function (e) {
    var that = this;
    wx.openLocation({
      longitude: Number(e.currentTarget.dataset.longitude),
      latitude: Number(e.currentTarget.dataset.latitude),
      name: that.data.companyInfo.AddressDetail,
      address: that.data.companyInfo.Address
    })
  },
  makePhoneCall: function (e) {
    var Mobeli = e.currentTarget.dataset.phone;
    if (Mobeli != "") {
      wx.makePhoneCall({
        phoneNumber: Mobeli//仅为示例，并非真实的电话号码
      })
    }
  },
  swiperImg: function (e) {
    var that = this;
    var currentNum = ++e.detail.current;
    if( that.data.type == 1 ){ that.data.currentNum1 = currentNum  }
    if( that.data.type == 2 ){ that.data.currentNum2 = currentNum  }
    if( that.data.type == 3 ){ that.data.currentNum3 = currentNum  }
    if( that.data.type == 4 ){ that.data.currentNum4 = currentNum  }
    if( that.data.type == 5 ){ that.data.currentNum5 = currentNum  }
    if( that.data.type == 6 ){ that.data.currentNum6 = currentNum  }

    this.setData({
      currentNum: currentNum || 1,
      currentNum1: that.data.currentNum1,
      currentNum2: that.data.currentNum2 ,
      currentNum3: that.data.currentNum3,
      currentNum4: that.data.currentNum4,
      currentNum5: that.data.currentNum5,
      currentNum6: that.data.currentNum6,
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    EnterpriseId = options.enterpriseId;
    var that = this;
    //企业信息
    utils.EnterpriseRequest({
      url: 'GetEnterpriseInfo',
      method: 'POST',
      data: {
        input: {
          EnterpriseId: EnterpriseId,
          Longitude: app.globalData.addLog.Longitude,
          Latitude: app.globalData.addLog.Latitude
        }
      },
      callback: function (res) {
        var Address = res.data.Provin + res.data.City + res.data.County + res.data.Addr;
        var obj = {
          Name: res.data.Name,
          Address: Address,
          AddressDetail: res.data.Addr,
          Distance: parseFloat(res.data.Distance).toFixed(1),
          Longitude: res.data.Longitude,
          Latitude: res.data.Latitude,
          Collection: res.data.Collection
        }
        that.setData({
          companyIntroduce: res.data,
          companyInfo: obj,
          collectFlag: obj.Collection
        })

      }
    });

    //相册
    utils.EnterpriseImageRequest({
      url: 'GetImages',
      method: 'POST',
      data: { enterpriseId: EnterpriseId },
      callback: function (res) {
        var arr = [];
        res.data.PathList1 ? arr.push({ name: "封面图片", type:1 }) : arr;
        res.data.PathList2 ? arr.push( {name: "厂房大门", type:2}) : arr;
        res.data.PathList3 ? arr.push( {name: "加工设备", type:3}) : arr;
        res.data.PathList4 ? arr.push( {name: "检测设备", type:4}) : arr;
        res.data.PathList5 ? arr.push( {name: "办公区域", type:5}) : arr;
        res.data.PathList6 ? arr.push( {name: "产品图片", type:6}) : arr;
        that.setData({
          PathList1: res.data.PathList1 ? res.data.PathList1 : [],
          PathList2: res.data.PathList2 ? res.data.PathList2 : [],
          PathList3: res.data.PathList3 ? res.data.PathList3 : [],
          PathList4: res.data.PathList4 ? res.data.PathList4 : [],
          PathList5: res.data.PathList5 ? res.data.PathList5 : [],
          PathList6: res.data.PathList6 ? res.data.PathList6 : [],
          pictrue: res.data.PathList1 ? res.data.PathList1 : [],
          totalNum:  res.data.PathList1 ? res.data.PathList1.length : 0,
          currentNum: 1,
          swiperNavArray: arr
        })
      }
    });
  },
  onReady: function () {


    // 页面渲染完成
    var that = this;
    //获取企业设备清单
    utils.DeviceRequest({
      url: 'GetEnterpriseDevices',
      method: 'POST',
      data: { enterpriseId: EnterpriseId },
      callback: function (res) {
        that.setData({
          equipmentListArray: res.data
        })
      }
    });

    //获取联系人信息
    utils.MemberInfoRequest({
      url: 'GetMemberInfoByEnterpriseId',
      method: 'POST',
      data: { enterpriseId: EnterpriseId },
      callback: function (res) {
        that.setData({
          contactArray: res.data
        })
      }
    });
  },

  onShow: function () {
    // 页面显示
    utils.BaseDataRequest({
      url: 'GetShareConfig',
      callback: function (res) {
        var a = JSON.parse(res.data.Data.Value)
      }

    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onShareAppMessage: function () {

    return {
      title: app.globalData.shareTitle.mybussine.title,
      path: '/page/home/mybussine/mybussine?EnterpriseId=' + app.globalData.EnterpriseId,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})