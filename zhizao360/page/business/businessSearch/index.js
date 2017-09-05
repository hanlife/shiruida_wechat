// page/bussines/bussinesSearch/index.js
var appInstance = getApp(); //获取全局对象
var keyword = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Focus: true,
    width: '633rpx',
    search_txt: '取消',
    clearShow: true,
    inputValue: '',
    data_value: ''
  },
  // 获取焦点
  EventFocus: function () {
    
  },
  // 输入
  EventInput: function (e) {
    var show = false;
    var txt = "搜索";
    keyword = e.detail.value;
    if (!e.detail.value) {
      show = !show;
      txt = "取消";
    }
    this.setData({
      search_txt: txt,
      clearShow: show,
      data_value: keyword
    })
  },
  ClearTxt: function () {
    this.setData({
      Focus: true,
      clearShow: true,
      search_txt: '取消',
      inputValue: ''
    })
  },
  //确定
  EventSearch: function (e) {
    var value = e.detail.value;
    appInstance.EnquiryKeyword = value;
    appInstance.EnquiryBool = true;
    wx.switchTab({
      url: '/page/business/index'
    })
  },
  //取消
  EventConsole: function () {
    if (keyword == "") {
      wx.switchTab({
        url: '/page/business/index'
      })
    } else {
      appInstance.EnquiryKeyword = keyword;
      appInstance.EnquiryBool = true;
      wx.switchTab({
        url: '/page/business/index'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var clearShow = true;
    if (appInstance.EnquiryKeyword){
      clearShow = false;
    }
   
    this.setData({
      clearShow: clearShow,
      inputValue: appInstance.EnquiryKeyword
    })
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