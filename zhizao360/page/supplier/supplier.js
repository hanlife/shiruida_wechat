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
    },
    Totle: 0,
  },
  AddressColor: false,
  DeviceColor: false,
  MoreColor: false,
  //顶部搜索框
  keyword: '',
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
    load_Event: true,
    supplier_list: [],
    keyWord: "",
    loading: '正在加载...',
    scrollTop: 0,
    data_area:null,
    data_process:null,
    data_more:null
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
      item_head: header,
      load_Event: false,
      data_process: header.Data.DeviceName
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
      item_head: header,
      load_Event: false,
      data_area: header.Data.Address.county
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
      item_head: header,
      load_Event: false,
      data_more:null,
    })
    QuerySupplier(this);
  },
  //确定按钮
  EventResult: function () {
    header.searchId = 0;
    header = search.checkMore(header);
    let IndustryName = header.Data.MoreName.Industry.Name == "" ? "" : header.Data.MoreName.Industry.Name+"、";
    let StaffNmuName = header.Data.MoreName.StaffNum.Name == "" ? "" : header.Data.MoreName.StaffNum.Name + "、";
    let data_more = IndustryName + StaffNmuName + header.Data.MoreName.MoreType.Name;
    this.setData({
      item_head: header,
      load_Event: false,
      data_more: data_more,
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

  //搜索结果
  searchBtn: function (e) {
    wx.navigateTo({
      url: '/page/supplier/supplier/index',
    })
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
    // var H = appInstance.globalData.addLog.Windowheight;
    // var W = appInstance.globalData.addLog.Windowwidth;
    this.setData({
      item_head: header
    })
    getLocation(that);
  },
  onShow: function () {
    header = search.setHeight(header);
    var that = this;
    if (wx.getStorageSync('guide') != 'true') {
      wx.redirectTo({
        url: '/page/supplier/guide/guide',
      })
    }
    if (appInstance.globalData.errorPage) {
      getLocation(that);
    }
    request.KeyWord = appInstance.SupplierKeyword;
    if (appInstance.SupplierBool && appInstance.SupplierKeyword != header.keyword) {
      request.CurrentPageNumber = 1;
      header.keyword = appInstance.SupplierKeyword;
      this.setData({
        item_head: header,
        load_Event: false
      })
      //  获取企业列表
      QuerySupplier(this);
      appInstance.SupplierBool = false;
    }
  },
  onReady: function () {
    // 页面渲染完成
    header = search.sevice(header);
    header = search.bmap_fn(bmap, header, this);
    if (appInstance.globalData.addLog.Iv != undefined) {
      var input = appInstance.globalData.addLog
      util.UserRequest({
        url: 'AddLog',
        method: 'post',
        data: {
          input: input
        },
        callback: function (res) {
        }
      })
    } else {
      wx.getUserInfo({
        success: function (res) {
          appInstance.globalData.addLog.Iv = res.iv;
          appInstance.globalData.addLog.EncryptedData = res.encryptedData;
          appInstance.globalData.addLog.Nickname = res.userInfo.nickName;
          appInstance.globalData.addLog.City = res.userInfo.city;
          appInstance.globalData.addLog.Country = res.userInfo.country;
          appInstance.globalData.addLog.Gender = res.userInfo.gender;
          appInstance.globalData.addLog.Language = res.userInfo.language;
          appInstance.globalData.addLog.Province = res.userInfo.province;
          appInstance.globalData.addLog.Avatarurl = res.userInfo.avatarUrl;
          var input = appInstance.globalData.addLog;
          util.UserRequest({
            url: 'AddLog',
            method: 'post',
            data: {
              input: input
            },
            callback: function (res) {
            }
          })
        }
      })
    }
    util.BaseDataRequest({
      url: 'GetShareConfig',
      method: 'post',
      callback: function (res) {
        appInstance.globalData.shareTitle = JSON.parse(res.data.Data.Value);
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
function QuerySupplier(that) {
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
          load_Event: true,
          loading: text,
          scrollTop: 0
        })
      } else {
        that.setData({
          loadShow: true,
          load_Event: true,
          dataList: true,
        })
      }
    } else {
      that.setData({
        loadShow: true,
        load_Event: true,
        dataList: true,
      })
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

function getLocation(that) {
  //赋值经纬度
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      appInstance.globalData.addLog.Latitude = res.latitude
      appInstance.globalData.addLog.Longitude = res.longitude
      request.Latitude = res.latitude;
      request.Longitude = res.longitude;
      // 获取企业列表
      QuerySupplier(that);
    },
    fail: function (res) {

    }
  })
}