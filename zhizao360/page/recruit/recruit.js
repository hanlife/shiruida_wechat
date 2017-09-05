// page/recruit/recruit.js
var promisefy = require('../../utils/promise.js');
var bmap = require('../../utils/bmap-wx.min.js');
var app = getApp();
var cityItem;
Page({
  data: {
    placeholder: "搜索",
    recuitArray: [],
    loadingFlag: false,
    londingText: '加载中...',
    Status: '',
    enterpriseId: '',
    mobile: '',
    shareTitle: '',
    noneData: false,
    //{ 请求数据的参数 }
    KeyWord: '',
    Provin: '',
    City: '',
    County: '',
    Longitude: '',
    Latitude: '',
    JobNameId: '',
    // SalaryRange: '',
    IsCustomerSetRange: false,
    SkipCount: '',
    MaxResultCount: 15,
    CurrentPageNumber: 1,
    Sorting: ''
  },
  onLoad: function (options) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      mask:true,
      duration: 100000
    })

    //{  初始化数据 }
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({ ak: 'oPufGCXIP6BGyj67bBO3KVsG5G7Qa9G4' });
    var fail = function (data) { };
    var success = function (data) {
      var wxMarkerData = data.wxMarkerData[0];
      addressAnalyze(wxMarkerData);
    }
    //发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success
    });
    function addressAnalyze(res) {
      let isprovince = res.address.indexOf('省');
      let iscity = res.address.indexOf('市');
      let iscounty = res.address.indexOf('区');

      let province = '', provinceId, city = '', cityId, county, countyId, provinceArray, cityArray, detail;

      if (isprovince > -1) {
        province = res.address.substring(0, isprovince + 1) + " "
      }
      if (iscity > -1) {

        city = res.address.substring(isprovince + 1, iscity + 1) + " "
        cityArray = res.address.substring(iscity + 1);
      }
      if (cityArray.indexOf("县") != -1) {
        county = cityArray.substring(0, cityArray.indexOf("县") + 1);
        detail = cityArray.split("县", 2)[1];
      }
      if (cityArray.indexOf("区") != -1) {
        county = cityArray.substring(0, cityArray.indexOf("区") + 1);
        detail = cityArray.split("区", 2)[1];
      }

      //{  获取选项的省市县  }
      promisefy.wxRequest({
        url: app.globalData.rootUrl + "/Content/js/Area.js",
        method: 'GET'
      }).then(response => {
        cityItem = response.data[0].children[0].children;
        app.globalData.cityItem = cityItem
        // wx.setStorageSync('cityItem', cityItem);
        var cityData = cityItem;
        const provinces = [];
        const citys = [];
        const countys = [];
        province = province.replace(/(^\s*)|(\s*$)/g, "");
        city = city.replace(/(^\s*)|(\s*$)/g, "");
        county = county.replace(/(^\s*)|(\s*$)/g, "");
        //省
        for (let i = 0; i < cityData.length; i++) {
          if (province == cityData[i].text) {
            provinceId = cityData[i].id
          };
          provinces.push({
            name: cityData[i].text,
            id: cityData[i].id
          });
          //市
          for (let j = 0; j < cityData[i].children.length; j++) {

            if (city.replace(/(^\s*)|(\s*$)/g, "") == cityData[i].children[j].text) {
              cityId = cityData[i].children[j].id
            };
            citys.push({
              name: cityData[i].children[j].text,
              id: cityData[i].children[j].id
            })

            //县
            for (let k = 0; k < cityData[i].children[j].children.length; k++) {
              if (county.replace(/(^\s*)|(\s*$)/g, "") == cityData[i].children[j].children[k].text) {
                countyId = cityData[i].children[j].children[k].id
              };
              countys.push({
                name: cityData[i].children[j].children[k].text,
                id: cityData[i].children[j].children[k].id
              })
            }
          }
        }
        that.setData({
          provinces: provinces,
          citys: citys,
          countys: countys,
          provinceId: provinceId,
          Provin: province,
          cityId: cityId,
          City: city,
          countyId: countyId,
          County: '',
          Longitude: res.longitude,
          Latitude: res.latitude,
        })
        requestData({ that: that, init: true })
      }).done();
    }

    //招聘分享的配置
    promisefy.BaseDataPromise({
      url: 'GetShareConfig',
    }).then(res => {
      let data = JSON.parse(res.data.Data.Value)
      if (data.recruit && data.recruit.title) {
        var shareTitle = JSON.parse(res.data.Data.Value).recruit.title
        this.setData({ shareTitle: shareTitle })
      }
    }).done();
  },
  onReady: function () { },
  onShow: function () {
    if (!app.globalData.recruitGo) { return; }

    let flag = false;
    //判断是否有筛选条件
    if (app.globalData.filterWeb) {
      flag = true;
      let filter = app.globalData.filterWeb
      this.setData({
        CurrentPageNumber: 1,
        Provin: filter.province,
        City: filter.city,
        County: filter.county,
        Longitude: filter.longitude,
        Latitude: filter.latitude,
        JobNameId: filter.professionId,
        SalaryRangeId: filter.payId,
        SalaryMin: filter.payMin,
        SalaryMax: filter.payMax,
        IsCustomerSetRange: false
      })
    }
    //判断是否有关键字
    if (app.globalData.RecruitKeyWord && app.globalData.RecruitKeyWord.length) {
      flag = true;
      this.setData({
        recuitArray: [],
        CurrentPageNumber: 1,
        KeyWord: app.globalData.RecruitKeyWord[0]
      })
    }

    if (flag) {
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        mask:true,
        duration: 100000
      })
      requestData({ that: this })
    }
  },

  onHide: function () { },
  onUnload: function () { },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.shareTitle,
      path: 'page/recruit/recruit',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }

  },
  //{  页面上拉触底事件的处理函数  } 
  onReachBottom: function (e) {

    if (!this.data.recuitArray.length && this.data.noneData) { return; }
    if (this.data.recuitArray.length < 5) { return; }
    this.setData({
      // loadingFlag: true,
      // londingText: '加载中...',
      CurrentPageNumber: this.data.CurrentPageNumber + 1
    })
    //{  数据不够 不加载  }
    if (this.data.CurrentPageNumber - this.data.TotalCount / this.data.MaxResultCount > 1) {
      this.setData({
        noneData: false,
        loadingFlag: true,
        londingText: '没有更多内容'
      })
      return;
    }
    requestData({ that: this, flag: true })
  },
  //{  下拉刷新  }
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      mask:true,
      duration: 100000
    })
    this.setData({
      CurrentPageNumber: 1
    })
    requestData({ that: this })
  },
  //{  点击筛选  }
  openFilter: function () {
    wx.navigateTo({
      url: '/page/recruit/filter/filter'
    })
  },
  //{  点击搜索  }
  NavToSearch: function () {
    wx.navigateTo({
      url: '/page/recruit/search/search'
    })
  },
  //{  进入详情页  }
  NavToRecruitInfo: function (e) {
    wx.navigateTo({ url: '/page/recruit/recruitInfo/recruitInfo?id=' + e.currentTarget.dataset.id })
  },

  //{  点击发布按钮  }
  publishRecruit: function () {
    let isImLogin = wx.getStorageSync('isImLogin');
    //{  没有登录跳转到绑定页面 }
    if (!isImLogin) {
      wx.redirectTo({ url: '/page/member/login' });
      return;
    }
     wx.showToast({
      title: '加载中...',
      mask:true,
      icon: 'loading',
      duration: 100000
    })
    app.getUserInfo(publishFuc);
    function publishFuc() {
      promisefy.EnterprisePromise({   //企业认证
        url: 'GetCertificationInfo',
        method: 'POST'
      }).then(res => {
        let Status = res.data.Status;
        let enterpriseId = res.data.Id;

        //{  企业状态  }
        if (!Status) {
          wx.showModal({
            title: '提示',
            content: "主账号还未审核通过，请联系主账号或客服：0755-28716135",
            showCancel: false,
            confirmText: '我知道了'
          })
          return;
        }
        if (Status == "审核通过") {
          promisefy.MemberInfoPromise({
            url: 'Index',
            method: 'POST'
          }).then(res => {
            //{  主账号  子账号 相同的处理 }
            promisefy.EnterpriseJobPromise({
              url: 'GetEnterpriseJob?enterpriseId=' + enterpriseId,
              method: 'GET',
            }).then(res => {
              let url = '';
              if (res.data.Data.length) {
                // 跳转到对应公司招聘信息列表
                url = '/page/recruit/recruitDetail/recruitDetail';
              } else {
                url = '/page/recruit/publish/publish';
              }
              wx.navigateTo({ url: url })
            })

          })
        } else {
          if (Status == "待审核") {
            wx.showModal({
              title: '提示',
              content: "贵公司还未通过企业认证，可以拨打客服电话：0755-28716135",
              cancelText: '知道了',
              showCancel: false,
              success: function (res) {
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: "贵公司还未完善企业资料",
              cancelText: '继续浏览',
              confirmText: '完善资料',
              success: function (res) {
                if (res.cancel) {
                  return;
                }
                if (res.confirm) {
                  wx.navigateTo({ url: '/page/home/industiyInfor/industiyInfor' })
                }
              }
            })
          }
        }
      }).finally(()=>{
        wx.hideToast();
      })
    }
  }
})
var requestData = function ({ that = '', flag = false, init = false } = {}) {
  //{ flag-是否是下拉加载 init-是否是初始化数据 }
  let condition = {
    KeyWord: that.data.KeyWord,
    Provin: that.data.Provin,
    City: that.data.City,
    County: that.data.County,
    // Provin: '',
    // City: '',
    // County: '',
    Longitude: that.data.Longitude,
    Latitude: that.data.Latitude,
    JobNameId: that.data.JobNameId,
    // SalaryRange: that.data.SalaryRange,
    SalaryRangeId: that.data.SalaryRangeId,
    SalaryMin: that.data.SalaryMin,
    SalaryMax: that.data.SalaryMax,
    IsCustomerSetRange: that.data.IsCustomerSetRange,
    SkipCount: that.data.SkipCount,
    MaxResultCount: that.data.MaxResultCount,
    CurrentPageNumber: that.data.CurrentPageNumber,
    Sorting: that.data.Sorting
  }
  promisefy.EnterpriseJobPromise({
    url: 'GetJobList',
    method: 'POST',
    data: { condition: condition }
  }).then(res => {

    if (res.data.Succeed) {
      let resArray = res.data.Data.Items;
      let TotalCount = res.data.Data.TotalCount;
      //如果是上拉触底事件
      if (flag) {
        //如果数组为空
        if (!resArray.length) {
          that.setData({
            noneData: false,
            loadingFlag: true,
            londingText: '没有更多内容'
          })
          return;
        }
        if (that.data.recuitArray.length) {
          let recuitArray = that.data.recuitArray;
          for (let i = 0; i < resArray.length; i++) {
            recuitArray.push(resArray[i])
          }
          resArray = recuitArray
        }
      }
      //当前城市没有数据  请求全部数据
      if (!resArray.length && init) {
        that.setData({
          Provin: '',
          City: '',
          County: ''
        })
        requestData({
          that: that
        });
        return;
      }
      for (let i = 0; i < resArray.length; i++) {
        resArray[i].Distance = parseFloat(resArray[i].Distance).toFixed(1)
      }
      if (!resArray.length) {
        that.setData({ noneData: true })
      }

      that.setData({
        recuitArray: resArray,
        loadingFlag: false,
        TotalCount: TotalCount,
        noneData: resArray.length ? false : true,
        londingText: resArray.length > 6 ? "加载中..." : "没有更多内容"
      })

    }
  }).finally(() => {
    wx.hideToast();
    wx.stopPullDownRefresh();
  }).done();

}

