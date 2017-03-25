// page/ordinarylist/index/index.js
var bmap = require('../../../utils/bmap-wx.min.js');
var app = require('../../../utils/common.js');//
var util = require('../../../utils/util.js');//公共JS
var ordinaryData = require('../../../utils/ordinaryData.js');//模拟数据
var search = require('../../../module/headSearch.js');//头部搜索共用JS
var search = search.search;
var Data = ordinaryData.data.Data.Items;//列表数据
var IndustryList = ordinaryData.data.IndustryList;//主营行业
var ProducessType = ordinaryData.data.ProducessType;//加工类型
var DeviceType = ordinaryData.data.DeviceType;//设备类型
var PQty = ordinaryData.data.PQty; //员工人数
var formatLocation = util.formatLocation;
var appInstance = getApp(); //获取全局对象

search.data.typeList = DeviceType;
search.data.MoreArray = PQty;
search.data.MoreTypeArray = ProducessType;
search.data.MainIndustryArray = IndustryList;
search.data.MainIndustryArray_T = IndustryList[0].SubIndustries;
var header = search.data;

Page({
  data: {
    con_Height: 0,
    loadShow: true,
    item_head: header,
    company_list: Data,
    keyWord: ""
  },
  // 区域选择
  choseArea: function (e) {
    header = search.choseArea(e, header);
    console.log(header)
    this.setData({
      item_head: header
    })
  },
  //设备类型
  choseType: function (e) {
    header = search.choseType(e, header)
    this.setData({
      item_head: header
    })
  },
  //设备类型确认
  EventOrdinary: function () {
    if (header.choseTemp == "0") {
      header.DeviceName = "设备类型";
    } else if (header.choseTemp == "1") {
      header.DeviceName = header.Data.DeviceName[0].value;
    } else {
      header.DeviceName = "多选";
    }
    header.searchId = 0;
    this.setData({
      item_head: header
    })
  },
  //更多
  choseMore: function (e) {
    header = search.choseMore(e, header)
    this.setData({
      item_head: header
    })
  },
  //选择地区
  choseposition: function () {
    header = search.choseposition(header);
    this.setData({
      item_head: header,
    })
  },
  //重新定位
  reposition: function () {
    header = search.reposition(header);
    this.setData({
      item_head: header,
    })
  },
  //区域左侧nav
  choseDistrict: function (e) {
    header = search.choseDistrict(e, header);
    this.setData({
      item_head: header
    })
  },
  //区域右侧
  choseCondition: function (e) {
    var index = e.target.dataset.index;
    header.showIndex = index;
    this.setData({
      item_head: header
    })
  },
  //选择设备类型
  deviceType: function (e) {
    header = search.deviceType(e, header);
    this.setData({
      item_head: header
    })
  },
  //更多左侧nav
  MoreSelect: function (e) {
    header = search.MoreSelect(e, header, PQty, ProducessType);
    this.setData({
      item_head: header
    })
  },
  //主营行业选择
  choseIndustry: function (e) {
    header = search.choseIndustry(e, header, IndustryList);
    this.setData({
      item_head: header
    })
  },
  //二级行业选择
  choseIndustry_T: function (e) {
    header = search.choseIndustry_T(e, header);
    this.setData({
      item_head: header
    })
  },
  //右侧选择
  choseMore_right: function (e) {
    header = search.choseMore_right(e, header);
    this.setData({
      item_head: header
    })
  },
  //右侧选择
  choseMoreType_right: function (e) {
    header = search.choseMoreType_right(e, header);
    this.setData({
      item_head: header
    })
  },
  //清空按钮
  EventEmpty: function () {
    header = search.EventEmpty(header);
    this.setData({
      item_head: header
    })
  },
  //确定按钮
  EventResult: function () {
    header.searchId = 0;
    header = search.checkMore(header);
    this.setData({
      item_head: header
    })
  },
  //上拉加载
  EventLoad: function () {
    var that = this;
    this.setData({
      loadShow: false,
    })
    wx.showNavigationBarLoading();
    setTimeout(function () {
      var List = that.data.company_list.concat(Data);
      that.setData({
        loadShow: true,
        company_list: List,
      })
      wx.hideNavigationBarLoading();
    }, 1000)
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    setTimeout(function () {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading();
    }, 1000)
  },
  //隐藏区域选择
  areaHide: function () {
    header.searchId = 0;
    this.setData({
      item_head: header
    })
  },
  //输入框聚焦
  EventFocus: function (e) {
    header = search.EventFocus(e, header);
    this.setData({
      item_head: header
    })
  },
  //搜索结果
  SearchResult: function (e) {
    header.inputValue = e.detail.value;
    console.log(e.detail.value)

  },
  //取消
  EventConsole: function () {
    header = search.EventConsole(header);
    this.setData({
      item_head: header
    })
  },
  //自定义分享标题
  onShareAppMessage: function () {
    return {
      title: '自定义分享标题',
      path: 'page/ordinarylist/index/index'
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    header = search.bmap_fn(bmap, header);
  },
  onReady: function () {
    // 页面渲染完成
    for (var i = 0; i < header.typeList.length + 1; i++) {
      header.choseArr[i] = "false"
    }
  },
  onShow: function () {
    // 页面显示
    var H = app.app.getSystemInfo().windowHeight;
    var W = app.app.getSystemInfo().windowWidth;
    var con_H = parseInt(H - (W / 750 * 160));
    header = search.setHeight(header);
    this.setData({
      con_Height: con_H,
      item_head: header
    })
    wx.request({
      url: "https://localhost:8060/test.txt",
      data: '',
      method: 'get',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res)
        return typeof cb == "function" && cb(res.data)
      },
      fail: function () {
        return typeof cb == "function" && cb(false)
      }
    })

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})