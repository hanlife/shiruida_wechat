// page/bussines/bussinesDetail/index.js
var util = require('../../../utils/util.js');//公共JS
var promisefy = require('../../../utils/promise.js');
var Id = '';

var mainObj = {
  getLocation: {
    latitude: 0,
    longitude: 0
  },
  // 计算时间差
  timeDifference: function (endDate) {
    var nowDate = new Date();
    var date2 = nowDate.getTime();
    endDate = endDate.replace(/-/g, "/");
    var date1 = Date.parse(endDate);
    return Math.ceil((date1 - date2) / (24 * 60 * 60 * 1000));
  },
  // 收藏
  collectFn: (that) => {
    util.EnquiryRequest({
      url: "AddCollect?id=" + Id,
      method: 'get',
      callback: function (res) {
        if (res.data.Succeed) {
          wx.showToast({
            title: "收藏成功",
            icon: 'success',
            duration: 2000
          })
          that.setData({
            collect: '已收藏'
          })
        } else {
          wx.showToast({
            title: res.data.ErrorMessage,
            icon: 'loading'
          })
        }
      }
    })
  },
  // 取消收藏
  consoleCollectFn: (that) => {
    wx.showModal({
      title: '提示',
      content: '确认取消收藏？',
      success: function (res) {
        if (res.confirm) {
          // 取消收藏
          util.EnquiryRequest({
            url: "DelCollect?Ids=" + Id,
            method: 'get',
            callback: function (res) {
              if (res.data.Succeed) {
                wx.showToast({
                  title: "取消收藏",
                  icon: 'success',
                  duration: 2000
                })
                that.setData({
                  collect: '收藏'
                })
              } else {
                wx.showToast({
                  title: res.data.ErrorMessage,
                  icon: 'loading'
                })
              }
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  //获取询价单
  GetEnquiry: function (that) {
    var _t = this;
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    util.EnquiryRequest({
      url: "GetEenquiryDetail?Id=" + Id,
      method: 'get',
      callback: function (res) {
        if (!res.data.Succeed) {
          wx.showModal({
            title: '错误提示',
            content: "数据不存在，点击确认按钮返回询价列表",
            showCancel: false,
            success: function (res) {
              wx.switchTab({
                url: '/page/business/index',
              })
            }
          })
        } else {
          _t.EnquiryData(res, that);  //渲染
        }
        if (wx.getStorageSync('isImLogin')) {
          _t.GetIndex(that, res.data);   //判断底部状态
        }
      }
    })
  },
  //渲染询价单
  EnquiryData: function (res, that) {
    var _t = this;
    var Enquiry = res.data.Data;
    var ClosingTime = util.ChangeDateFormat(Enquiry.ClosingTime);//截止日期
    var EnquiryState = _t.CheckState(Enquiry.EnquiryState, Enquiry.ClosingTime);//状态
    if (Enquiry.DeliveryDate != '2050-01-01') {
      var DeliveryDataStr = Enquiry.DeliveryDate;
      var ResidueDay = _t.timeDifference(Enquiry.DeliveryDate);
      var DeliveryDataStr = ResidueDay > 0 ? DeliveryDataStr + "(剩余" + ResidueDay + "天)" : DeliveryDataStr;
    } else {
      var DeliveryDataStr = '--';
    }
    var getDistance = '--';
    // 计算距离
    if (_t.getLocation.latitude !== 0) {
      var getDistance = util.getFlatternDistance(Enquiry.Latitude, Enquiry.Longitude, _t.getLocation.latitude, _t.getLocation.longitude);
      getDistance = parseFloat(getDistance / 1000).toFixed(1) + "km";
      that.setData({
        Area: getDistance,
      })
    } else {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          _t.getLocation.latitude = res.latitude
          _t.getLocation.longitude = res.longitude
          var getDistance = util.getFlatternDistance(Enquiry.Latitude, Enquiry.Longitude, _t.getLocation.latitude, _t.getLocation.longitude);
          getDistance = parseFloat(getDistance / 1000).toFixed(1) + "km";
          that.setData({
            Area: getDistance,
          })
        }
      });
    }

    var TaxRate = Enquiry.TaxRate == 0 ? "" : "(" + Enquiry.TaxRate + "%)";
    var Remarks = Enquiry.Remarks === null ? "" : Enquiry.Remarks;

    that.setData({
      Nature: Enquiry.EnterpriseNature,
      EnterpriseId: Enquiry.EnterpriseId,
      EnterpriseTitle: Enquiry.Title,
      EnquiryNumber: Enquiry.EnquiryNumber,
      EnquiryState: EnquiryState,
      ProductQtyDes: Enquiry.ProductQtyDes,
      QuoteNumber: Enquiry.QuoteNumber,
      ProduceTypeName: Enquiry.ProduceTypeName,
      ClosingTime: ClosingTime,
      DeliveryDate: DeliveryDataStr,
      Remarks: Remarks,
      EnterpriseName: Enquiry.EnterpriseName,
      ReceiptShortAddress: Enquiry.ReceiptProvince + Enquiry.ReceiptCity + Enquiry.ReceiptCounty,
      ContactDes: Enquiry.Contact,
      SettlementName: Enquiry.SettlementName,
      PaymentTypeName: Enquiry.PaymentTypeName,
      InvoiceRequireDes: Enquiry.InvoiceRequireDes,
      TaxRate: TaxRate,
      IsDirect: Enquiry.IsDirect
    })
    wx.setNavigationBarTitle({
      title: Enquiry.Title
    })
    wx.hideToast();
  },
  //校验是否收藏
  CheckedCollect: (that) => {
    util.EnquiryRequest({
      url: "CheckCollect?id=" + Id,
      method: 'get',
      callback: function (res) {
        var collect = '';
        var IsOwnEnquiry = false;
        if (res.data.Sucess) {
          collect = "收藏";
        } else {
          if (res.data.Message == "不能收藏自己企业的询价单") {
            collect = "无法收藏";
            IsOwnEnquiry = true;
          }
          if (res.data.Message == "该询价单已经收藏") {
            collect = "已收藏";
          } else {
            collect = "无法收藏";
            IsOwnEnquiry = true;
          }
        }
        that.setData({
          collect: collect,
          IsOwnEnquiry: IsOwnEnquiry
        })
      }
    })
  },
  //判断询价单状态
  CheckState: function (state, closeTime) {
    if (state == 4 || state == 5) {
      return "已结束";
    }
    var day = 7 * 24 * 60 * 60; //7天
    var closeday = parseInt(closeTime.replace("/Date(", "").replace(")/", ""));
    var nowDay = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime();
    var tempDay = closeday - nowDay;
    if (tempDay < 0) {
      return "已结束";
    }
    var caleDays = Math.ceil(tempDay / (24 * 60 * 60 * 1000));
    caleDays++;
    if (caleDays > 7) {
      return "进行中"
    } else {
      return caleDays + "天后截止报价";
    }
  },
  //获取企业信息
  GetIndex: function (that, Enquiry) {
    var _t = this;
    promisefy.MemberInfoPromise({   //基础资料
      url: 'Index',
      method: 'POST'
    }).then(res => {
      //判断用户是否通过审核，否则隐藏
      //判断是否定向：是则判断是否是本企业，是则可以收藏可以报价，否则隐藏
      //不是定向  则 判断是否可以收藏
      var IsOwnEnquiry = false;
      var QuoteState = that.data.QuoteState;
      var collect = that.data.collect;

      if (res.data.Id == null || res.data.Id == '') {
        IsOwnEnquiry = true;
      } else {
        if (Enquiry.IsDirect && res.data.EnterpriseId != Enquiry.EnterpriseId) {
          collect = "无法收藏";
          QuoteState = "未授权";
        } else {
          //校验询价单是否已收藏
          _t.CheckedCollect(that);
        }
        if (Enquiry.IsQuote) {
          QuoteState = "已报价";
        }
      }
      that.setData({
        collect: collect,
        IsOwnEnquiry: IsOwnEnquiry,
        QuoteState: QuoteState
      })
    })
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: false,
    collect: '收藏',
    QuoteState: '请到电脑端报价',
    Nature: '',

    EnterpriseId: '',
    EnterpriseTitle: '',
    EnquiryNumber: "",
    EnquiryState: '',
    ProductQty: '',
    ProductSpeciesQty: '',
    QuoteNumber: '',
    Area: '--',
    ProduceTypeName: '',
    ClosingTime: '',
    DeliveryDate: '',
    residueDay: '',
    Remarks: '',
    EnterpriseName: '',
    ReceiptShortAddress: '',
    ContactDes: '',
    SettlementName: '',
    PaymentTypeName: '',
    InvoiceRequireDes: '',
    TaxRate: '',
    IsOwnEnquiry: false,
    IsDirect: false,
  },

  Eventcollect: function () {
    if (this.data.collect == "收藏") {
      // 收藏
      mainObj.collectFn(this);
    } else if (this.data.collect == "已收藏") {
      // 取消收藏
      mainObj.consoleCollectFn(this);
    } else {
      return;
    }
  },
  ToSupplier: function (e) {
    var EnterpriseId = e.currentTarget.dataset.id;
    if (this.data.Nature == "供应商") {
      wx.navigateTo({
        url: '/page/home/mybussine/mybussine?enterpriseId=' + EnterpriseId,
      })
    } else {
      return;
    }
  },
  ToLogin: function () {
    wx.redirectTo({
      url: '/page/member/login',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var login = wx.getStorageSync('isImLogin') ? true : false;//是否登录
    Id = options.id;
    this.setData({
      login: login
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    //获取询价单
    mainObj.GetEnquiry(this);

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var t = this;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.EnterpriseTitle,
      path: '/page/business/businessDetail/index?id=' + Id
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
})


