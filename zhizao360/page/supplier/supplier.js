// page/supplier/supplier.js
var bmap = require('../../utils/bmap-wx.min.js');
var app = require('../../utils/common.js');//
var util = require('../../utils/util.js');//公共JS
var headSearch = require('../../module/headSearch.js');//头部搜索共用JS
var search = headSearch.search;
var formatLocation = util.formatLocation;
var appInstance = getApp(); //获取全局对象

var header = {
  Data: {
    District: [],
    Nearby: [],
    DeviceName: [],
    Address: {
      county: ''
    },
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
    }
  },
  AddressColor: false,
  DeviceColor: false,
  MoreColor: false,
  //顶部搜索框
  isShow: true, //搜索框
  ClearShow: true,
  inputWord: '搜索设备、产品、公司名称',
  inputValue: '',
  left: "135rpx", //搜索图标左边距
  width: "673rpx",  //搜索框宽度
  textLeft: "center", //搜索框字体对齐
  paddingLeft: "0", //搜索框左边距
  inputFocus: "none", //取消按钮
  SearchTxt: "取消",
  SearchList: [],//搜索关联内容
  Searching: true,
  AddressName: "区域",
  //区域筛选
  searchId: "0",  //筛选类型
  areaHeight: "700rpx", //筛选区高度
  showIndex: "999", //区域右侧scoll
  array: [],//区域右侧列表数据
  Address: "",//距离
  latitude: '',
  longitude: '',
  area_select: "0", //区域 0 附近 1
  //设备类型
  deviceTypeHeight: "500rpx",
  typeList: [],   //加工类型
  choseArr: [],
  molimit: "false",
  choseTemp: 0,
  DeviceName: "加工类型",
  //更多
  MoreName: "更多",
  MoreArray: [],//员工人数
  MoreTypeArray: [],//设备类型
  more_select: "0", //主营行业 0 员工人数 1 加工类型 2
  MainIndustryArray: [],  //一级行业
  MainIndustryArray_T: [],//二级行业
  MoreTypeId: "-1",
  MoreId: "-1",
  ParentId: '0', //一级行业选中id
  ChildId: "",//二级行业选中id
  pageId: 2  //页面ID
};

//搜索条件
var request = {
  KeyWord: "",
  Provin: "",
  City: "",
  County: "",
  DeviceTypeId: [],
  Distance: "",
  IndustryId: [],
  PQty: "",
  ProcessTypeId: [],
  Longitude: 0,
  Latitude: 0,
  MaxResultCount: "10",
  CurrentPageNumber: "1",
};
Page({
  data: {
    loadShow: true,
    item_head: header,
    supplier_list: [],
    keyWord: "",
    loading: '正在加载...',
    scrollTop: 0
  },
  // 区域+设备类型+更多
  choseArea: function (e) {
    header = search.choseArea(e, header)
    this.setData({
      item_head: header
    })
  },
  //设备类型确认
  EventOrdinary: function () {
    if (header.choseTemp == "0") {
      header.DeviceName = "加工类型";
      header.DeviceColor = false;
      request.ProcessTypeId = [];
    } else if (header.choseTemp == "1") {
      header.DeviceName = header.Data.DeviceName[0].value;
      header.DeviceColor = true;
      request.ProcessTypeId = [header.Data.DeviceName[0].Id];
    } else {
      header.DeviceName = "多选";
      header.DeviceColor = true;
      request.ProcessTypeId = [];
      for (var i = 0; i < header.Data.DeviceName.length; i++) {
        request.ProcessTypeId.push(header.Data.DeviceName[i].Id)
      }
    }
    header.searchId = 0;
    this.setData({
      item_head: header
    })
    QuerySupplier(this);
  },
  //选择地区
  choseposition: function () {
    header = search.choseposition(header, this, request);
  },
  //重新定位
  reposition: function () {
    header = search.reposition(header);
    header = search.bmap_fn(bmap, header, this);
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
    if (header.area_select == '0') {
      //区域
      request.Provin = header.Data.Address.province;
      request.City = header.Data.Address.city;
      request.County = header.Data.Address.county;
      request.Distance = '';
    } else {
      //附近
      request.Provin = '';
      request.City = '';
      request.County = '';
      request.Distance = header.Data.Address.county.split('km')[0];
    }
    QuerySupplier(this)
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
    header.searchId = 0;
    header = search.EventEmpty(header);
    request.DeviceTypeId = [];
    request.IndustryId = [];
    request.PQty = '';
    this.setData({
      item_head: header
    })
    QuerySupplier(this);
  },
  //确定按钮
  EventResult: function () {
    header.searchId = 0;
    header = search.checkMore(header);
    this.setData({
      item_head: header
    })
    request.PQty = header.Data.MoreName.StaffNum.Name;
    if (header.Data.MoreName.MoreType.Id != "") {
      request.DeviceTypeId = [header.Data.MoreName.MoreType.Id];
    } else {
      request.DeviceTypeId = [];
    }
    if (header.Data.MoreName.Industry.Id != "") {
      request.IndustryId = [header.Data.MoreName.Industry.Id];
    } else {
      request.IndustryId = [];
    }
    QuerySupplier(this);
  },
  ToSupplier: function (e) {
    search.ToSupplier(e);
  },
  //上拉加载
  onReachBottom: function () {
    request.CurrentPageNumber++;
    getQuery(this);
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    // wx.showNavigationBarLoading();
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    request.CurrentPageNumber = 1;
    appInstance.reqPost("Enterprise/QuerySupplier", function (res) {
      request.CurrentPageNumber = 1;
      if (res.Succeed) {
        if (res.Data.Items.length > 0) {
          var List = util.distanc(res.Data.Items, header);
          that.setData({
            supplier_list: List,
            scrollTop: 0
          })
        } else {
          that.setData({
            dataList: true,
          })
        }
      }
      wx.stopPullDownRefresh({
        complete: function (res) {
          wx.hideToast();
          // wx.hideNavigationBarLoading();
        }
      })
    }, { request: request })
  },
  //隐藏区域选择
  areaHide: function () {
    header.searchId = 0;
    this.setData({
      item_head: header
    })
  },
  EventInput: function (e) {
    header.inputValue = e.detail.value;
    if (e.detail.value != '') {
      header.SearchTxt = "搜索"
      header.ClearShow = false;
    } else {
      header.SearchTxt = "取消"
      header.ClearShow = true;
    }
    this.setData({
      item_head: header
    })
  },
  //清空按钮
  ClearTxt: function () {
    header.inputValue = '';
    header.ClearShow = true;
    header.SearchTxt = "取消"
    this.setData({
      item_head: header
    })
  },
  //输入框聚焦
  EventFocus: function (e) {
    header = search.EventFocus(e, header);
    header.Searching = false;
    this.setData({
      item_head: header
    })
  },
  //搜索结果
  SearchResult: function (e) {
    header.inputValue = e.detail.value;
  },
  // //输入确定
  // EventBlur: function (e) {
  //   request.KeyWord = e.detail.value;
  //   header.Searching = true;
  //   header.inputValue = e.detail.value;
  //   if (e.detail.value == '') {
  //     header = search.EventConsole(header);
  //   }
  //   this.setData({
  //     item_head: header
  //   })
  //   QuerySupplier(this);
  // },
  //取消或搜索
  EventConsole: function () {
    if (header.inputValue == '') {
      header.inputValue = request.KeyWord;
      if (request.KeyWord != '') {
        header = search.EventSearch(header);
      } else {
        header = search.EventConsole(header);
      }
    } else {
      header = search.EventSearch(header);
      request.KeyWord = header.inputValue;
      QuerySupplier(this);
    }
    this.setData({
      item_head: header
    })
  },
  //输入确定
  EventSearch: function (e) {
    request.KeyWord = e.detail.value;
    header.Searching = true;
    header.inputValue = e.detail.value;
    if (e.detail.value == '') {
      header = search.EventConsole(header);
    } else {
      header = search.EventSearch(header);
    }
    this.setData({
      item_head: header
    })
    QuerySupplier(this);
  },
  imgError: function (e) {
  },
  //自定义分享标题
  onShareAppMessage: function () {
    return {
      title: appInstance.globalData.shareTitle.supplier.content,
      path: 'page/supplier/supplier'
    }
  },
  onLoad: function (options) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    var H = appInstance.globalData.addLog.Windowheight;
    var W = appInstance.globalData.addLog.Windowwidth;
    header = search.setHeight(header);
    this.setData({
      item_head: header
    })

    //赋值经纬度
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        request.Latitude = res.latitude;
        request.Longitude = res.longitude;
        // 获取闲置产能
        QuerySupplier(that);
      }
    })
  },
  onShow: function () {
    // 页面显示
    // var that = this;
    // if (request.Latitude) {
    //   QuerySupplier(this);
    // } else {
    //   wx.getLocation({
    //     type: 'wgs84',
    //     success: function (res) {
    //       request.Latitude = res.latitude;
    //       request.Longitude = res.longitude;
    //       // 获取闲置产能
    //       QuerySupplier(that);
    //     }
    //   })
    // }
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 500
    })
  },
  onReady: function () {
    // 页面渲染完成
    header = search.sevice(header);
    header = search.bmap_fn(bmap, header, this);
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})

// 获取闲置产能
function QuerySupplier(that) {
  wx.showToast({
    title: '加载中...',
    icon: 'loading'
  })
  request.CurrentPageNumber = 1;
  appInstance.reqPost("Enterprise/QuerySupplier", function (res) {
    var text = '加载中...'
    var loadShow = false;
    if (res.Succeed) {
      if (res.Data.Items.length > 0) {
        header.Data.Totle = res.Data.TotalCount;
        var data = util.distanc(res.Data.Items, header);
        if (request.CurrentPageNumber * 10 > header.Data.Totle) {
          text = "已加载全部";
        }
        if (res.Data.Items.length < 5) {
          loadShow = true;
        }
        that.setData({
          loadShow: loadShow,
          supplier_list: data,
          dataList: false,
          loading: text,
          scrollTop: 0
        })
      } else {
        that.setData({
          loadShow: true,
          dataList: true,
        })
      }
    }
    wx.hideToast();
    wx.hideNavigationBarLoading();
  }, { request: request })
}
// 搜索请求
function getQuery(that) {
  if (request.CurrentPageNumber * 10 > header.Data.Totle) {
    that.setData({
      loading: "已加载全部",
    })
  } else {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    appInstance.reqPost("Enterprise/QuerySupplier", function (res) {
      wx.hideToast();
      if (res.Succeed) {
        if (res.Data.Items.length > 0) {
          header.Data.Totle = res.Data.TotalCount;
          var data = util.distanc(res.Data.Items, header);
          var List = that.data.supplier_list.concat(data);
          that.setData({
            dataList: false,
            supplier_list: List,
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