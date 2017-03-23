// page/ordinarylist/index/index.js
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

var header = {
  //顶部搜索框
  isShow: true, //搜索框
  left: "225rpx", //搜索图标左边距
  width: "100%",  //搜索框宽度
  textLeft: "center", //搜索框字体对齐
  paddingLeft: "0", //搜索框左边距
  inputFocus: "none", //取消按钮
  //区域筛选
  searchId: "0",  //筛选类型
  areaHeight: "700rpx", //筛选区高度
  showIndex: "999", //区域右侧scoll
  array: [{ message: "a" }, { message: "b" }, { message: "c" }, { message: "d" }, { message: "a" }, { message: "b" }, { message: "c" }, { message: "d" }, { message: "a" }, { message: "b" }, { message: "c" }, { message: "d" }],//区域右侧列表数据
  Address: "ddddd",//距离
  area_select: "0", //区域 0 附近 1
  //设备类型
  deviceTypeHeight: "500rpx",
  typeList: DeviceType,   //设备类型
  choseArr: [],
  choseTemp: 0,
  //更多
  MoreArray: PQty,
  more_select: "0", //主营行业 0 员工人数 1 加工类型 2
  MainIndustryArray: IndustryList,  //一级行业
  MainIndustryArray_T: IndustryList[0].SubIndustries,//二级行业
  MoreTypeId: "-1",
  ParentId: '0', //一级行业选中id
  ChildId: ""//二级行业选中id
};

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
    header = search.choseArea(e, header)
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
  //确认
  EventOrdinary: function () {

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
    var idx = e.currentTarget.dataset.typeid;
    header.ChildId = idx;
    this.setData({
      item_head: header
    })
  },
  //右侧选择
  choseMore_right: function (e) {
    var idx = e.currentTarget.dataset.id;
    header.MoreTypeId = idx;
    this.setData({
      item_head: header
    })
  },
  //清空按钮
  EventEmpty: function () {
    header.MoreTypeId = "-1";
    header.ParentId = '0';
    header.ChildId = "";
    this.setData({
      item_head: header
    })
  },
  //确定按钮
  EventResult: function () {

    header.searchId = 0;
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
    this.setData({
      item_head: {
        isShow: true,
        left: "20rpx",
        width: "580rpx",
        textLeft: "left",
        paddingLeft: "50rpx",
        inputFocus: "inline-block"
      }
    })
  },
  //输入框移除焦点
  EventBlur: function (e) {
    console.log(e.detail.value)
    this.setData({
      item_head: {
        isShow: true,
        left: "225rpx",
        width: "100%",
        textLeft: "center",
        paddingLeft: "0",
        inputFocus: "none"
      }
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(DeviceType)
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
    var areaH = parseInt(H - (W / 750 * 450));
    var TypeH = parseInt(H - (W / 750 * 600));
    header.areaHeight = areaH;
    header.deviceTypeHeight = TypeH;
    this.setData({
      con_Height: con_H,
      item_head: header
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})