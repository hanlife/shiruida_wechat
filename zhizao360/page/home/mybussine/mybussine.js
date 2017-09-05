// page/home/mybussine/mybussine.js
// var utils = require("../../../utils/util.js");
var promisefy = require('../../../utils/promise.js');
var app = getApp();

Page({
  data: {
    isImLogin: false,
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
    type: 1,
    IsShowDefault: false,
    EnterpriseId: '',
    shareTitle: ''


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
  previewImage: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var src = e.currentTarget.dataset.src;
    var arr = [];
    if (type == "PathList1") {
      for (let i = 0; i < that.data.PathList1.length; i++) {
        arr.push(that.data.PathList1[i].Original)
      }
    }
    if (type == "PathList2") {
      for (let i = 0; i < that.data.PathList2.length; i++) {
        arr.push(that.data.PathList2[i].Original)
      }
    }
    if (type == "PathList3") {
      for (let i = 0; i < that.data.PathList3.length; i++) {
        arr.push(that.data.PathList3[i].Original)
      }
    }
    if (type == "PathList4") {
      for (let i = 0; i < that.data.PathList4.length; i++) {
        arr.push(that.data.PathList4[i].Original)
      }
    }
    if (type == "PathList5") {
      for (let i = 0; i < that.data.PathList5.length; i++) {
        arr.push(that.data.PathList5[i].Original)
      }
    }
    if (type == "PathList6") {
      for (let i = 0; i < that.data.PathList6.length; i++) {
        arr.push(that.data.PathList6[i].Original)
      }
    }
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
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
    promisefy.EnterprisePromise({
      url: 'CollectEnterprise',
      method: 'POST',
      data: { enterpriseId: this.data.EnterpriseId }
    }).then(res => {
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
    }).done();
  
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
    if (that.data.type == 1) { that.data.currentNum1 = currentNum }
    if (that.data.type == 2) { that.data.currentNum2 = currentNum }
    if (that.data.type == 3) { that.data.currentNum3 = currentNum }
    if (that.data.type == 4) { that.data.currentNum4 = currentNum }
    if (that.data.type == 5) { that.data.currentNum5 = currentNum }
    if (that.data.type == 6) { that.data.currentNum6 = currentNum }

    this.setData({
      currentNum: currentNum || 1,
      currentNum1: that.data.currentNum1,
      currentNum2: that.data.currentNum2,
      currentNum3: that.data.currentNum3,
      currentNum4: that.data.currentNum4,
      currentNum5: that.data.currentNum5,
      currentNum6: that.data.currentNum6,
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      EnterpriseId: options.enterpriseId
    })

    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        //企业信息
        promisefy.EnterprisePromise({
          url: 'GetEnterpriseInfo',
          method: 'POST',
          data: {
            input: {
              EnterpriseId: that.data.EnterpriseId,
              Longitude: longitude,
              Latitude: latitude
            }
          }
        }).then(res => {
          let Address = res.data.Provin + res.data.City + res.data.County + res.data.Addr;
          let obj = {
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
        }).done();

      
      }
    })



    //相册
    promisefy.EnterpriseImagePromise({
      url: 'GetImages',
      method: 'POST',
      data: { enterpriseId: that.data.EnterpriseId },
    }).then(res => {
      for (let i in res.data) {
        for (let j = 0; j < res.data[i].length; j++) {
          res.data[i][j].Original = app.globalData.rootUrl + res.data[i][j].Original
          res.data[i][j].type = i;
        }
      }
      let arr = [];
      if (res.data.PathList1) {
        arr.push({ name: "封面图片", type: 1 })
        that.setData({ type: 1 })
      }
      if (res.data.PathList2) {
        arr.push({ name: "厂房大门", type: 2 })
      }
      if (res.data.PathList3) {
        arr.push({ name: "加工设备", type: 3 })
      }
      if (res.data.PathList4) {
        arr.push({ name: "检测设备", type: 4 })
      }
      if (res.data.PathList5) {
        arr.push({ name: "办公区域", type: 5 })
      }
      if (res.data.PathList6) {
        arr.push({ name: "产品图片", type: 6 })
      }

      if (!res.data.PathList1 && !res.data.PathList2 && !res.data.PathList3 && !res.data.PathList4 && !res.data.PathList5 && !res.data.PathList6) {
        that.setData({
          IsShowDefault: true
        })
      }

      that.setData({
        PathList1: res.data.PathList1 ? res.data.PathList1 : [],
        PathList2: res.data.PathList2 ? res.data.PathList2 : [],
        PathList3: res.data.PathList3 ? res.data.PathList3 : [],
        PathList4: res.data.PathList4 ? res.data.PathList4 : [],
        PathList5: res.data.PathList5 ? res.data.PathList5 : [],
        PathList6: res.data.PathList6 ? res.data.PathList6 : [],
        pictrue: res.data.PathList1 ? res.data.PathList1 : [],
        totalNum: res.data.PathList1 ? res.data.PathList1.length : 0,
        currentNum: 1,
        swiperNavArray: arr
      })
    }).done();
   
    var isImLogin = wx.getStorageSync("isImLogin");
    that.setData({
      isImLogin: isImLogin
    })
  },
  onReady: function () {
    // 页面渲染完成
    var that = this;
    //获取企业设备清单
    promisefy.DevicePromise({
      url: 'GetEnterpriseDevices',
      method: 'POST',
      data: { enterpriseId: that.data.EnterpriseId }
    }).then(res => {
          for (let i in res.data) {
          res.data[i].CapacityQty ? res.data[i].CapacityQty : res.data[i].CapacityQty = 0;
          res.data[i].CapacityQty > 9999 ? res.data[i].CapacityQty = 9999 : res.data[i].CapacityQty;
          res.data[i].Amount ? res.data[i].Amount : res.data[i].Amount = 0;
          res.data[i].Amount > 9999 ? res.data[i].Amount = 9999 : res.data[i].Amount;
        }
        that.setData({ equipmentListArray: res.data })
    }).done();
    

    //获取联系人信息
    promisefy.MemberInfoPromise({
      url: 'GetMemberInfoByEnterpriseId',
      method: 'POST',
      data: { enterpriseId: that.data.EnterpriseId }
    }).then(res => {
      if(res.data.Succeed){
         that.setData({ contactArray: res.data.Data })
      }
    }).done();
   
  },

  onShow: function () {
    // 页面显示

    //公司主页分享的配置
    promisefy.BaseDataPromise({
      url: 'GetShareConfig',
    }).then(res => {
       var shareTitle = JSON.parse(res.data.Data.Value).mybussine.title
       this.setData({ shareTitle: shareTitle})
    }).done();
    
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.shareTitle,
      path: '/page/home/mybussine/mybussine?enterpriseId=' + that.data.EnterpriseId,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  clipboard: function (e) {
    let text = '';
    if (e.currentTarget.dataset.flag == 0) {
      text = "QQ复制成功"
    }
    if (e.currentTarget.dataset.flag == 1) {
      text = "微信复制成功"
    }
    wx.setClipboardData({
      data: e.currentTarget.dataset.val,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: text,
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    })
  }
})