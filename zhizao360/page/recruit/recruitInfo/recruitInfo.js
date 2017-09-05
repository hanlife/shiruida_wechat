// page/recruit/recruitInfo/recruitInfo.js
var promisefy = require('../../../utils/promise.js');
var util = require('../../../utils/util.js');//公共JS
var app = getApp();

var Info = {
  Id: '',   //职位ID
  getLocation: {
    latitude: 0,
    longitude: 0
  },
  GetIndex: function (that) {
    promisefy.MemberInfoPromise({   //基础资料
      url: 'Index',
      method: 'POST'
    }).then(res => {

    })
  },
  //检查手机号
  CheckMoblie: function (that, data) {
    var _t = this;
    promisefy.EnterpriseJobPromise({
      url: 'CheckJobMobile',
      method: 'Get'
    }).then(res => {
      var ontherRecruit = res.data.Data;
      var mobile = data.ContactMobile;
      if (ontherRecruit) {
        _t.GetOtherJobs(that, data);
      } else {
        var dataList = [];
        mobile = mobile.replace(mobile.slice(3, 7), "****");
      }
      var Nature = data.EnterpriseNature == "供应商" ? true : false;
      that.setData({
        ontherRecruit: ontherRecruit,
        JobName: data.JobName,
        SalaryRange: data.SalaryRange,
        HiringQty: data.HiringQty,
        City: data.City,
        County: data.County,
        LastUpdateTimeDes: data.LastUpdateTimeDes,
        EnterpriseName: data.EnterpriseName,
        WorkAddress: data.Provin + data.City + data.County + data.Address,
        JobRequire: data.JobRequire,
        ContactName: data.ContactName,
        ContactMobile: mobile,
        EnterpriseId: data.EnterpriseId,
        Nature: Nature,
        Latitude: data.Latitude,
        Longitude: data.Longitude
      })
      wx.hideLoading();
    })
  },
  //获取该公司其他职位
  GetOtherJobs: function (that, data) {
    var _t = this;
    promisefy.EnterpriseJobPromise({
      url: 'GetOtherJobs',
      method: 'POST',
      data: { input: { EnterpriseId: data.EnterpriseId, JobId: parseInt(_t.Id) } }
    }).then(o_res => {
      var dataList = o_res.data.Data;
      if (dataList.length > 0) {
        // 计算距离
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            _t.getLocation.latitude = res.latitude;
            _t.getLocation.longitude = res.longitude;
            for (var i = 0; i < dataList.length; i++) {
              var getDistance = util.getFlatternDistance(dataList[i].Latitude, dataList[i].Longitude, _t.getLocation.latitude, _t.getLocation.longitude);
              getDistance = getDistance == 0 ? "0" : parseFloat(getDistance / 1000).toFixed(1);
              dataList[i].Distance = getDistance;
            };
            that.setData({
              otherArry: dataList
            });
          }
        });

      } else {
        that.setData({
          otherList: true
        });
      }
    })
  },
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    ontherRecruit: false,
    otherList: false,
    IconContact: false,
    JobName: '',
    SalaryRange: '',
    HiringQty: '',
    City: '',
    County: '',
    LastUpdateTimeDes: '',
    EnterpriseName: '',
    WorkAddress: '',
    JobRequire: '',
    ContactName: '',
    ContactMobile: '',
    EnterpriseId: '',
    OtherJobList: [],
    Nature: true,  //判断企业性质 供应商true 采购商false
    Latitude: 0,
    Longitude: 0
  },
  EventVerif: function () {
    wx.redirectTo({
      url: '/page/recruit/recruitInfo/verify/verify?id=' + Info.Id,
    })
  },

  ToSupplier: function (e) {
    var EnterpriseId = e.currentTarget.dataset.id;
    if (this.data.Nature) {
      wx.navigateTo({
        url: '/page/home/mybussine/mybussine?enterpriseId=' + EnterpriseId,
      })
    }
  },

  EventTel: function (e) {
    var phone = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: phone, //仅为示例，并非真实的电话号码
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '拨打电话失败',
        })
      }
    })
  },

  EventTodetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '/page/recruit/recruitInfo/recruitInfo?id=' + id,
    })
  },

  EventOpenmap: function () {
    if (this.data.Latitude == 0 || this.data.Longitude == 0) {
      wx.showModal({
        title: '提示',
        content: '打开地图失败',
        showCancel: false
      })
      return
    }
    wx.openLocation({
      latitude: this.data.Latitude,
      longitude: this.data.Longitude,
      scale: 28,
      name: this.data.WorkAddress
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    Info.Id = options.id;
    promisefy.EnterpriseJobPromise({
      url: 'GetJobDetail?Id=' + Info.Id,
      method: 'GET'
    }).then(res => {
      if (!res.data.Succeed){
        wx.showModal({
          title: '错误提示',
          content: "数据有误，点击确认按钮返回招聘列表",
          showCancel: false,
          success: function (res) {
            wx.switchTab({
              url: '/page/recruit/recruit',
            })
          }
        })
      }
      var data = res.data.Data;
      Info.CheckMoblie(that, data);
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    app.globalData.recruitGo = false;
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