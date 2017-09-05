// page/bussines/index.js
var util = require('../../utils/util.js');//公共JS
var appInstance = getApp(); //获取全局对象

var obj = {
  TotalCount: 0,
  request: {
    KeyWord: '',
    MaxResultCount: 15,
    CurrentPageNumber: 1,
    Orderby: 2,
    IsAsc: '',
  }
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    EnquiryList: [],
    noneData: false,
    loadShow: true,
    active: 0,
    loading: '加载中',
    keyword: '',
    load_Event:true
  },
  //详情页
  Tobusiness: function (e) {
    var Id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/page/business/businessDetail/index?id=' + Id
    })
  },
  searchBtn: function () {
    wx.navigateTo({
      url: '/page/business/businessSearch/index'
    })
  },

  EventQuote: function () {
    var active = this.data.active;
    var IsAsc = obj.request.IsAsc;
    active++;
    if (active >= 3) {
      active = 0;
    }
    this.setData({
      active: active,
      load_Event: false
    })
    obj.request.Orderby = active == 0 ? 2 : 3;
    obj.request.IsAsc = active == 0 ? "" : !IsAsc;
    obj.request.CurrentPageNumber = 1;
    //获取询价单列表
    Business.Query(obj, this);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    obj.request.IsAsc = "";
    obj.request.KeyWord = appInstance.EnquiryKeyword;
    obj.request.CurrentPageNumber = 1;
    this.setData({
      keyword: appInstance.EnquiryKeyword
    })
    //获取询价单列表
    Business.Query(obj, that);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    util.BaseDataRequest({
      url: 'GetShareConfig',
      method: 'post',
      callback: function (res) {
        appInstance.globalData.shareTitle = JSON.parse(res.data.Data.Value);
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var that = this;
    obj.request.KeyWord = appInstance.EnquiryKeyword;
    if (appInstance.EnquiryBool && appInstance.EnquiryKeyword != this.data.keyword) {
      obj.request.CurrentPageNumber = 1;
      this.setData({
        keyword: appInstance.EnquiryKeyword,
        load_Event: false
      })
      //获取询价单列表
      Business.Query(obj, that);
      appInstance.EnquiryBool = false;
    }
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
    var that = this;
    obj.request.CurrentPageNumber = 1;
    //获取询价单列表
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    Business.Refresh(obj, that);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    obj.request.CurrentPageNumber++;
    if (this.data.loading == "已加载全部" || this.data.loadShow) {
      return;
    }
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    //获取询价单列表
    Business.Query(obj, that);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: appInstance.globalData.shareTitle.business.content || "智造360最新询盘",
      path: 'page/business/index'
    }
  }
})

var Business = {
  Query: function (obj, that) {
    // 询价单列表
    var t = this;
    util.EnquiryRequest({
      url: "GetEenquiryList",
      method: 'post',
      data: { request: obj.request },
      callback: function (res) {
        wx.hideToast();
        obj.TotalCount = res.data.TotalCount;
        if (res.data.TotalCount == 0) {
          that.setData({
            EnquiryList: [],
            loadShow: true,
            noneData: true,
            load_Event: true
          })
          return
        }
        if (obj.request.CurrentPageNumber > 1) {
          var loading = t.checkCurrent(obj.request.CurrentPageNumber, res.data.TotalCount);
          var List = that.data.EnquiryList.concat(res.data.Items)
          that.setData({
            EnquiryList: List,
            loading: loading,
            noneData: false,
            load_Event: true
          })
        } else {
          var Load = t.checkLoad(res.data.TotalCount);
          that.setData({
            EnquiryList: res.data.Items,
            loadShow: Load.loadShow,
            loading: Load.loading,
            noneData: false,
            load_Event: true
          })
        }
      }
    })
  },
  Refresh: function (obj, that) {
    // 询价单列表
    var t = this;
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    util.EnquiryRequest({
      url: "GetEenquiryList",
      method: 'post',
      data: { request: obj.request },
      callback: function (res) {
        wx.hideToast();
        wx.stopPullDownRefresh();

        obj.TotalCount = res.data.TotalCount;
        if (res.data.TotalCount == 0) {
          that.setData({
            noneData: true
          })
          return
        }
        var Load = t.checkLoad(res.data.TotalCount);
        that.setData({
          EnquiryList: res.data.Items,
          loadShow: Load.loadShow,
          loading: Load.loading
        })

      }
    })
  },
  checkLoad: function (total) {
    var loading = "";
    if (total >= 10) {
      var loadShow = false;
      if (total <= 15) {
        var loading = "加载全部"
      } else {
        var loading = "加载中"
      }
    } else {
      var loadShow = true;
    }
    return { loading: loading, loadShow: loadShow }
  },
  checkCurrent: function (currentPageNumber, total) {
    if (currentPageNumber * 15 >= total) {
      return "已加载全部"
    } else {
      return "加载中"
    }
  },
}