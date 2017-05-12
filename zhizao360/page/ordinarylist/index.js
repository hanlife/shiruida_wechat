// page/ordinarylist/index/index.js
var bmap = require('../../utils/bmap-wx.min.js');
var app = require('../../utils/common.js');//
var util = require('../../utils/util.js');//公共JS
var headSearch = require('../../module/headSearch.js');//头部搜索共用JS
var search = headSearch.search;
var formatLocation = util.formatLocation;
var appInstance = getApp(); //获取全局对象
var base = appInstance.globalData.rootUrl + "/Content/images/wx/";

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
  isShow: true, //搜索框
  inputWord: '搜索设备名称、设备类型',
  inputValue: '',
  ClearShow: true,
  left: "155rpx", //搜索图标左边距
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
  areaHeight: "", //筛选区高度
  showIndex: "999", //区域右侧scoll
  array: [],//区域右侧列表数据
  Address: '',//距离
  latitude: '',
  longitude: '',
  area_select: "0", //区域 0 附近 1
  //设备类型
  deviceTypeHeight: "500rpx",
  typeList: [],   //设备类型
  molimit: "false",
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
  MoreId: "",
  ParentId: '0', //一级行业选中id
  ChildId: "",//二级行业选中id
  pageId: 1  //页面ID
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
    company_list: [],
    keyWord: "",
    dataList: false,
    loading: '正在加载...',
    scrollTop: '0',
    guideshow: false,
    releaseBtn: false,
    guideData: {
      indicatorDots: true,
      autoplay: false,
      duration: 500,
      imgUrls: [
        base + "操作指引-1.png",
        base + "操作指引-2.png",
        base + "操作指引-3.png",
        base + "操作指引-4.png",
        base + "操作指引-5.png",
        base + "操作指引-6.png",
        base + "操作指引-7.png"
      ]
    }
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
      request.DeviceTypeId = [];
    } else if (header.choseTemp == "1") {
      header.DeviceName = header.Data.DeviceName[0].value;
      header.DeviceColor = true;
      request.DeviceTypeId = [header.Data.DeviceName[0].Id]
    } else {
      header.DeviceName = "多选";
      header.DeviceColor = true;
      request.DeviceTypeId = [];
      for (var i = 0; i < header.Data.DeviceName.length; i++) {
        request.DeviceTypeId.push(header.Data.DeviceName[i].Id)
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
    GetCapacityList(this);
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
    request.ProcessTypeId = [];
    request.IndustryId = [];
    request.PQty = '';
    this.setData({
      item_head: header
    })
    GetCapacityList(this);
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
      request.ProcessTypeId = [header.Data.MoreName.MoreType.Id];
    } else {
      request.ProcessTypeId = [];
    }
    if (header.Data.MoreName.Industry.Id != "") {
      request.IndustryId = [header.Data.MoreName.Industry.Id];
    } else {
      request.IndustryId = [];
    }
    GetCapacityList(this);
  },
  //上拉加载
  EventLoad: function () {
    var that = this;
    request.CurrentPageNumber++;
    getQuery(this);
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    request.CurrentPageNumber = 1;
    //wx.showNavigationBarLoading();
    appInstance.reqPost("Device/GetCapacityList", function (res) {
      if (res.Succeed) {
        if (res.Data.Items.length > 0) {
          var List = util.distanc(res.Data.Items, header);
          that.setData({
            loading: "加载中",
            company_list: List,
            scrollTop: 0
          })
        } else {
          that.setData({
            dataList: true,
          })
        }
        wx.stopPullDownRefresh({
          complete: function (res) {
            wx.hideToast();
            // wx.hideNavigationBarLoading();
          }
        })
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
  // EventBlur: function (e) {
  //   if (e.detail.value == '') {
  //     header = search.EventConsole(header);
  //     header.ClearShow = true;
  //   } else {
  //     request.KeyWord = e.detail.value;
  //     header.Searching = true;
  //     header.inputValue = e.detail.value;
  //     GetCapacityList(this);
  //   }
  //   this.setData({
  //     item_head: header
  //   })
  // },
  //清空按钮
  ClearTxt: function () {
    header.inputValue = '';
    header.ClearShow = true;
    header.SearchTxt = "取消"
    this.setData({
      item_head: header
    })
  },
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
      GetCapacityList(this);
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
    GetCapacityList(this);
  },
  //发布产能
  toRelease: function () {
    if (wx.getStorageSync('isImLogin')) {
      wx.navigateTo({
        url: '/page/ordinarylist/release/release',
        success: function (res) {
          // success
        }
      })
    } else {
      wx.navigateTo({
        url: '/page/member/login',
        success: function (res) {
          // success
        }
      })
    }
  },
  guideChange: function (e) {
    var that = this;
    if (e.detail.current == 6) {
      setTimeout(function () {
        that.setData({
          guideshow: false
        })
      }, 1500)
    }
  },
  guideClose: function () {
    this.setData({
      guideshow: false
    })
  },
  //自定义分享标题
  onShareAppMessage: function () {
    return {
      title: appInstance.globalData.shareTitle.ordinarylist.content,
      path: 'page/ordinarylist/index'
    }
  },
  onLoad: function (options) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    var H = appInstance.globalData.addLog.Windowheight;
    var W = appInstance.globalData.addLog.Windowwidth;
    //操作指引
    if (wx.getStorageSync('rd_session') == "") {
      var guideline = true;
    }
    header = search.setHeight(header);
    this.setData({
      item_head: header
    })
    if (!this.data.guideshow) {
      wx.showNavigationBarLoading();
    }
    //赋值经纬度
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        request.Latitude = res.latitude;
        request.Longitude = res.longitude;
        // 获取闲置产能
        GetCapacityList(that);
      }
    })
  },
  onShow: function () {
    var that = this;
    // 获取闲置产能
    GetCapacityList(that);
    //是否显示发布闲置产能按钮
    util.EnterpriseRequest({
      url: 'GetCertificationInfo',
      method: 'POST',
      callback: function (res) {
        var NaturesId = null;
        var Natures = appInstance.globalData.EnterpriseNatures;
        for (var i = 0; i < Natures.length; i++) {
          if (Natures[i].Name == "供应商") {
            NaturesId = Natures[i].Id
          }
        }
        if (res.data.Status == "审核通过" && res.data.EnterpriseNatures == NaturesId) {
          that.setData({
            releaseBtn: true
          })
        } else {
          that.setData({
            releaseBtn: false
          })
        }
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
    var that = this;
    header = search.sevice(header, this);//获取头部搜索条件内容
    header = search.bmap_fn(bmap, header, this);
    util.BaseDataRequest({
      url: 'GetShareConfig',
      method: 'post',
      callback: function (res) {
        appInstance.globalData.shareTitle = JSON.parse(res.data.Data.Value);
      }
    })
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
  wx.showToast({
    title: '加载中...',
    icon: 'loading'
  })
  request.CurrentPageNumber = 1;
  appInstance.reqPost("Device/GetCapacityList", function (res) {
    if (!res) {
      wx.showToast({
        title: '数据请求失败，请检查网络',
        icon: 'loading'
      })
    }
    var text = '加载中...';
    var loadShow = false;
    if (res.Succeed) {
      if (res.Data.Items.length > 0) {
        header.Data.Totle = res.Data.TotalCount;
        if (request.CurrentPageNumber * 10 > header.Data.Totle) {
          text = "已加载全部";
        }
        if (res.Data.Items.length < 4) {
          loadShow = true;
        }
        var data = util.distanc(res.Data.Items, header);
        t.setData({
          loadShow: loadShow,
          dataList: false,
          company_list: data,
          scrollTop: 0,
          loading: text,
        })
      } else {
        t.setData({
          dataList: true,
        })
      }
      wx.hideToast();
      wx.hideNavigationBarLoading();
    }
  }, { request: request })
}
// 搜索请求
function getQuery(that) {
  if (request.CurrentPageNumber * 10 > header.Data.Totle) {
    that.setData({
      loading: "已加载全部",
    })
  } else {
    wx.showNavigationBarLoading();
    appInstance.reqPost("Device/GetCapacityList", function (res) {
      if (!res) {
        wx.showToast({
          title: '数据请求失败，请检查网络',
          icon: 'loading'
        })
      }
      if (res.Succeed) {
        if (res.Data.Items.length > 0) {
          header.Data.Totle = res.Data.TotalCount;
          var data = util.distanc(res.Data.Items, header);
          var List = that.data.company_list.concat(data);
          that.setData({
            company_list: List,
            dataList: false,
          })
        } else {
          that.setData({
            dataList: true,
          })
        }
        wx.hideNavigationBarLoading();
      }
    }, { request: request })
  }
}
