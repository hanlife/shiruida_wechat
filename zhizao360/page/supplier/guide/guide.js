// page/supplier/guide/guide.js
var appInstance = getApp(); //获取全局对象
var base = appInstance.globalData.rootUrl + "/Content/images/wx/";


Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: false,
    duration: 500,
    imgUrls: [
      base + "操作指引1.png",
      base + "操作指引3.png",
      base + "操作指引2.png",
      base + "操作指引4.png",
      base + "操作指引5.png"
    ]
  },
  guideChange: function (e) {
    var that = this;
    if (e.detail.current == 4) {
      setTimeout(function () {
        setStorage("guide", 'true');
        wx.switchTab({
          url: '/page/supplier/supplier',
        })
      }, 1500)
    }
  },
  guideClose: function () {
    setStorage("guide", 'true');
    wx.switchTab({
      url: '/page/supplier/supplier',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    appInstance.getUserInfo();
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  }
})

function setStorage(key, val) {
  wx.setStorageSync(key, val);
}