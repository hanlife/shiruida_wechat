// page/ordinarylist/index/index.js
var bmap = require('../../../utils/bmap-wx.min.js');
var app = require('../../../utils/common.js');//
var util = require('../../../utils/util.js');//公共JS
var headSearch = require('../../../module/headSearch.js');//头部搜索共用JS
var search = headSearch.search;
var formatLocation = util.formatLocation;
var appInstance = getApp(); //获取全局对象

var header = {
  Data: {
    District: [],
    Nearby: [],
    DeviceName: [],
    Address: {},
    MoreName: {
      Industry: {
        Name: '',
        Id: ''
      },
      StaffNum: {
        Name: '',
        Id: ''
      },
      MoreType: {
        Name: '',
        Id: ''
      }
    },
    Totle: 0
  },
  AddressColor: false,
  DeviceColor: false,
  MoreColor: false,
  //顶部搜索框
  isShow: true, //搜索框
  inputValue: '',
  left: "225rpx", //搜索图标左边距
  width: "100%",  //搜索框宽度
  textLeft: "center", //搜索框字体对齐
  paddingLeft: "0", //搜索框左边距
  inputFocus: "none", //取消按钮
  SearchList: [],//搜索关联内容
  Searching: true,
  AddressName: "区域",
  //区域筛选
  searchId: "0",  //筛选类型
  areaHeight: "700rpx", //筛选区高度
  showIndex: "999", //区域右侧scoll
  array: [],//区域右侧列表数据
  Address: '',//距离
  latitude: '',
  longitude: '',
  area_select: "0", //区域 0 附近 1
  //设备类型
  deviceTypeHeight: "500rpx",
  typeList: [],   //设备类型
  choseArr: [],
  choseTemp: 0,
  DeviceName: "设备类型",
  //更多
  MoreName: "更多",
  MoreArray: [],//员工人数
  MoreTypeArray: [],//加工类型
  more_select: "0", //主营行业 0 员工人数 1 加工类型 2
  MainIndustryArray: [],  //一级行业
  MainIndustryArray_T: [],//二级行业
  MoreTypeId: "-1",
  MoreId: "-1",
  ParentId: '0', //一级行业选中id
  ChildId: "",//二级行业选中id
  pageId: 1  //页面ID
};
//搜索条件
var request = {
  KeyWord: "",
  Provinid: "",
  Cityid: "",
  Countyid: "",
  DeviceType: [],
  Distanc: "",
  Industry: [],
  PQty: "",
  ProcessTypeId: [],
  Longitude: 0,
  Latitude: 0,
  MaxResultCount: "10",
  CurrentPageNumber: "1",
};

Page({
  data: {
    con_Height: 0,
    loadShow: true,
    item_head: header,
    company_list: [],
    keyWord: "",
    dataList: false,
    loading: '正在加载...',
    isImLogin: false,
  },
  //进入该公司详情页
  ToSupplier: function (e) {
    search.ToSupplier(e);
  },
  // 区域+设备类型+更多
  choseArea: function (e) {
    header = search.choseArea(e, header);
    this.setData({
      item_head: header
    })
  },
  //设备类型确认
  EventOrdinary: function () {
    if (header.choseTemp == "0") {
      header.DeviceName = "设备类型";
      header.DeviceColor = false;
      request.DeviceType = [];
    } else if (header.choseTemp == "1") {
      header.DeviceName = header.Data.DeviceName[0].value;
      header.DeviceColor = true;
      request.DeviceType.push(header.Data.DeviceName[0].Id)
    } else {
      header.DeviceName = "多选";
      header.DeviceColor = true;
      for (var i = 0; i < header.Data.DeviceName.length; i++) {
        request.DeviceType.push(header.Data.DeviceName[i].Id)
      }
    }
    header.searchId = 0;
    this.setData({
      item_head: header
    })
    GetCapacityList(this);
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
    header = search.choseCondition(e, header);
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
    header = search.MoreSelect(e, header);
    this.setData({
      item_head: header
    })
  },
  //主营行业选择
  choseIndustry: function (e) {
    header = search.choseIndustry(e, header);
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
    request.PQty = header.Data.MoreName.StaffNum.Id;
    if (header.Data.MoreName.MoreType.Id != "") {
      request.ProcessTypeId = header.Data.MoreName.MoreType.Id;
    } else {
      request.ProcessTypeId = [];
    }
    if (header.Data.MoreName.Industry.Id != "") {
      request.Industry = [header.Data.MoreName.Industry.Id];
    } else {
      request.Industry = [];
    }
    GetCapacityList(this);
  },
  //上拉加载
  EventLoad: function () {
    var that = this;
    this.setData({
      loadShow: false,
    })
    wx.showNavigationBarLoading();
    request.CurrentPageNumber++;
    getQuery(this);
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    request = {
      KeyWord: "",
      Provinid: "",
      Cityid: "",
      Countyid: "",
      DeviceType: [],
      Distanc: "",
      Industry: [],
      PQty: "",
      ProcessTypeId: [],
      Longitude: 0,
      Latitude: 0,
      MaxResultCount: "10",
      CurrentPageNumber: "1",
    };
    appInstance.reqPost("Device/GetCapacityList", function (res) {
      if (res.Succeed) {
        if (res.Data.Items.length > 0) {
          var List = res.Data.Items;
          wx.stopPullDownRefresh()
          wx.hideNavigationBarLoading();
          that.setData({
            loadShow: true,
            company_list: List,
          })
        } else {
          that.setData({
            dataList: true,
          })
        }
      }
    }, { request: request })
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
    console.log(e.detail.value)

  },
  //取消
  EventConsole: function () {
    header = search.EventConsole(header);
    this.setData({
      item_head: header
    })
  },
  //输入确定
  EventBlur: function (e) {
    request.KeyWord = e.detail.value;
    header = search.EventConsole(header);
    this.setData({
      item_head: header
    })
    GetCapacityList(this);
    request.KeyWord = '';
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

    header = search.sevice(header);//获取头部搜索条件内容
    header = search.bmap_fn(bmap, header);
    // 页面显示
    var Islogin = wx.getStorageSync('isImLogin');
    var H = app.app.getSystemInfo().windowHeight;
    var W = app.app.getSystemInfo().windowWidth;
    var con_H = parseInt(H - (W / 750 * 160));
    header = search.setHeight(header);

    this.setData({
      con_Height: con_H,
      item_head: header,
      isImLogin: Islogin
    })
    wx.showLoading({
      title: '数据加载中',
    })
  },
  onShow: function () {
    // 获取闲置产能
    GetCapacityList(this);

  },
  onReady: function () {
    // 页面渲染完成
    util.UserRequest({
      url: 'AddLog',
      method: 'post',
      data: {
        input: appInstance.globalData.addLog
      },
      callback: function (res) {

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

// 获取闲置产能
function GetCapacityList(t) {
  request.CurrentPageNumber = 1;
  appInstance.reqPost("Device/GetCapacityList", function (res) {
    if (res.Succeed) {
      if (res.Data.Items.length > 0) {
        header.Data.Totle = res.Data.TotalCount;
        t.setData({
          dataList: false,
          company_list: res.Data.Items,
        })
        console.log(t.data.company_list)
      } else {
        t.setData({
          dataList: true,
        })
      }
      wx.hideLoading();
    }
  }, { request: request })
}
// 搜索请求
function getQuery(that) {
  if (request.CurrentPageNumber * 10 > header.Data.Totle) {
    that.setData({
      loading: "已加载全部",
    })
    setTimeout(function () {
      that.setData({
        loadShow: true,
        loading: "加载中...",
      })
      wx.hideNavigationBarLoading();
    }, 2000)
  } else {
    appInstance.reqPost("Device/GetCapacityList", function (res) {
      if (res.Succeed) {
        if (res.Data.Items.length > 0) {
          header.Data.Totle = res.Data.TotalCount;
          var List = that.data.company_list.concat(res.Data.Items);
          wx.hideNavigationBarLoading();
          that.setData({
            loadShow: true,
            company_list: List,
          })
        } else {
          that.setData({
            dataList: true,
          })
        }
      }
    }, { request: request })
  }

}