// page/recruit/publish/publish.js
var bmap = require('../../../utils/bmap-wx.min.js');
var promisefy = require('../../../utils/promise.js');
var app = getApp();
let addressDetail = null;
let addressDetailFlag = false; //{ 详细地址是否修改 }

Page({
  data: {
    //{  判断是否是查看详情  }
    optionsId: '',

    lookdetail: false,
    //{  工种信息 }
    pickerArray: [],
    pickerIndex: '',
    JobNameId: '',
    JobName: '',

    //{  招聘人数  }
    number: 1,

    //{  薪资  }
    SalaryObj: {},

    //{  地区信息  }
    address: '地区选择',
    addressDetail: '',
    province: '',
    provinceId: '',
    city: '',
    cityId: '',
    county: '',
    countyId: '',
    longitude: '',
    latitude: '',

    //{  岗位要求 }
    textarealimitNum: 500,
    textareaVal: '',
    cacheTextareaVal: '',
    surplusVal: 500,

    //{ 公司 联系人 }
    EnterpriseName: '',
    EnterpriseId: '',
    ContactName: '',
    ContactMobile: ''
  },
  onLoad: function (options) {
    let _this = this;
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      mask: true,
      duration: 10000
    })
   
    function FuncA() {
      //{  获取工种  }
      return promisefy.BaseDataPromise({
        url: 'GetJobName',
        method: 'GET'
      }).then(res => {
        return res;
      });
    }

    function FucB() {
      //{  获取公司信息  }
      return promisefy.EnterprisePromise({
        url: 'GetCertificationInfo',
        method: 'POST'
      }).then(res => {
        return res;
      })
    }

    function FucC() {
      //{  获取联系人信息  }
      return promisefy.MemberInfoPromise({
        url: "index",
        method: "POST"
      }).then(res => {
        _this.setData({
          ContactName: res.data.Name,
          ContactMobile: res.data.Mobile
        })
        return res;
      })
    }
    Promise.all([FuncA(), FucB(), FucC()]).then(res => {
      this.setData({
        pickerArray: res[0].data.Data,
        EnterpriseName: res[1].data.Name,
        EnterpriseId: res[1].data.Id,
        longitude: res[1].data.Longitude,
        latitude: res[1].data.Latitude,
        ContactName: res[2].data.Name,
        ContactMobile: res[2].data.Mobile
      })

      //{  查看发布详情的数据处理  }
      if (options.id) {
        this.setData({ optionsId: options.id })
        wx.setNavigationBarTitle({
          title: '修改招聘'
        })
        app.globalData.SalaryObj = "";
        promisefy.EnterpriseJobPromise({
          url: 'GetJobDetail',
          data: { Id: parseInt(options.id) }
        }).then(res => {
          res = res.data.Data;
          this.setData({
            //{  工种信息  }
            JobNameId: res.JobNameId,
            JobName: res.JobName,
            //{  招聘人数  }
            number: res.HiringQty,
            //{  薪资  }
            SalaryObj: {
              name: res.SalaryRange,
              id: res.SalaryRangeId,
              SalaryMax: res.SalaryMax,
              SalaryMin: res.SalaryMin
            },
            //{  地区信息  }
            address: res.Provin + " " + res.City + " " + res.County,
            addressDetail: res.Address,
            province: res.Provin,
            city: res.City,
            county: res.County,
            longitude: res.Longitude,
            latitude: res.Latitude,
            //{  岗位要求 }
            textareaVal: res.JobRequire,
            cacheTextareaVal: res.JobRequire
          })
        })
        return;
      }

      //{  读取保存在本地的发布页面数据处理  }
      let dataArray = wx.getStorageSync('publishWeb');
      if (dataArray.length) {
        let dataObj = dataArray[0]
        this.setData({
          //{  工种信息 }
          pickerArray: dataObj.pickerArray,
          pickerIndex: dataObj.pickerIndex,
          JobNameId: dataObj.JobNameId,
          JobName: dataObj.JobName,
          //{  招聘人数  }
          number: dataObj.number,
          //{  薪资  }
          SalaryObj: dataObj.SalaryObj,
          //{  地区信息  }
          address: dataObj.address,
          addressDetail: dataObj.addressDetail,
          province: dataObj.province,
          city: dataObj.city,
          county: dataObj.county,
          longitude: dataObj.longitude,
          latitude: dataObj.latitude,
          //{  岗位要求 }
          textareaVal: dataObj.textareaVal,
        })
        return;
      }

      //{  读取地区信息 }
      promisefy.EnterpriseJobPromise({
        url: 'GetAddress'
      }).then(res => {
        let data = res.data.Data;
        this.setData({
          address: data.Provin + " " + data.City + " " + data.County,
          addressDetail: data.Address,
          province: data.Provin,
          city: data.City,
          county: data.County,
          longitude: data.Longitude,
          Latitude: data.Latitude
        })
      })
      
    }).finally(() => {
       wx.hideToast();
    }).done();;



  },
  onReady: function () {

  },
  onShow: function (options) {


    let SalaryObj = {}
    if (this.data.SalaryObj && this.data.SalaryObj.name) { SalaryObj = this.data.SalaryObj }
    if (app.globalData.SalaryObjFlag && app.globalData.SalaryObj) {

      SalaryObj = app.globalData.SalaryObj

      app.globalData.SalaryObjFlag = false;
    }
    this.setData({
      SalaryObj: SalaryObj
    })


    wx.hideToast();
  },
  //{  选择工种  }
  bindPickerChange: function (e) {
    let pickerIndex = e.detail.value;
    let JobNameId = this.data.pickerArray[pickerIndex].Id;
    let JobName = this.data.pickerArray[pickerIndex].Name
    this.setData({
      pickerIndex: pickerIndex,
      JobNameId: JobNameId,
      JobName: JobName
    })
  },
  cutNumber: function () {    //数量减少
    var number = parseInt(this.data.number);
    number--;
    if (number < 1) {
      number = 1;
    }
    this.setData({
      number: number
    })
  },
  numberInput: function (e) {  //数量取整
    var number = e.detail.value;
    if (number < 1) { number = 1 }
    if (number > 9999) { number = 9999 }
    this.setData({
      number: parseInt(number)
    })
  },
  addNumber: function () {     //数量增加
    var number = parseInt(this.data.number);
    number++;
    if (number > 9999) {
      number = 9999
    }
    this.data.number = number;
    this.setData({
      number: number
    })
  },
  //{  选择薪资范围  }
  NavToPayRange: function () {
    wx.navigateTo({ url: '/page/recruit/publish/payRange/payRange' })
  },
  //{  选择地区  }
  chooseLocation: function () {
    wx.chooseLocation({
      success: (res) => {
        var that = this;
        if (!res.name) {
          // 新建百度地图对象 
          var BMap = new bmap.BMapWX({ ak: 'oPufGCXIP6BGyj67bBO3KVsG5G7Qa9G4' });
          var fail = function (data) { };
          var success = function (data) {
            var wxMarkerData = data.wxMarkerData[0];
            res.address = wxMarkerData.address + wxMarkerData.desc
            addressAnalyze(res);
          }
          // 发起regeocoding检索请求 
          BMap.regeocoding({
            fail: fail,
            success: success
          });
          return;
        }
        addressAnalyze(res);
        function addressAnalyze(res) {
          let isprovince = res.address.indexOf('省');
          let iscity = res.address.indexOf('市');
          let iscounty = res.address.indexOf('区');

          let province = '', city = '', county, provinceArray, cityArray, detail;

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

          that.setData({
            address: province + city + county,
            addressDetail: detail + " " + res.name,
            province: province,
            city: city,
            county: county,
            longitude: res.longitude,
            latitude: res.latitude
          })
        }

      }
    })
  },
  //{  填写详细地址  }
  addressDetailInputFuc: function (e) {
    addressDetailFlag = true
    addressDetail = e.detail.value;
  },
  //{  填写岗位要求  }
  textareaFuc: function (e) {
    let val = e.detail.value;
    let limitNum = this.data.textarealimitNum;
    // this.setData({ 
    //   surplusVal: limitNum - val.length
    //  })
    this.setData({
      cacheTextareaVal: val
    })

  },
  textareaBlurFuc: function (e) {
    this.setData({ textareaVal: e.detail.value })
  },
  //{  查看公司主页  }
  NavToMybussine: function () {

    wx.navigateTo({ url: '/page/home/mybussine/mybussine?enterpriseId=' + this.data.EnterpriseId })
  },
  //{  发布按钮  }
  btnPublishFuc: function (e) {
    if (addressDetailFlag) {
      this.setData({ addressDetail: addressDetail });
    }
    let content = '';
    if (!this.data.JobName) {
      content = '请选择工种！';
    }
    else if (!this.data.SalaryObj.name) { content = '请选择薪资范围！'; }
    else if (this.data.address == "地区选择" || !this.data.addressDetail) { content = '请填写详细地址！'; }
    else if (this.data.province == "" || !this.data.addressDetail) { content = '缺少省份，请重新选择地区'; }
    if (content) {
      wx.showModal({
        title: '提示',
        content: content,
        cancelText: '知道了',
        showCancel: false,
        success: function (res) {
        }
      })
      return;
    }
    //{  如果是详情页进入则为更新  }
    let urlData = {
      JobNameId: this.data.JobNameId,
      JobName: this.data.JobName,
      HiringQty: this.data.number,
      SalaryRangeId: this.data.SalaryObj.id,
      SalaryRange: this.data.SalaryObj.name,
      SalaryMin: this.data.SalaryObj.SalaryMin,
      SalaryMax: this.data.SalaryObj.SalaryMax,
      Provin: this.data.province.replace(/(^\s*)|(\s*$)/g, ""),
      City: this.data.city.replace(/(^\s*)|(\s*$)/g, ""),
      County: this.data.county.replace(/(^\s*)|(\s*$)/g, "") || " ",
      // Provin: this.data.provinceId,
      // City: this.data.cityId,
      // County: this.data.countyId,
      Address: this.data.addressDetail,
      Longitude: this.data.longitude,
      Latitude: this.data.latitude,
      JobRequire: this.data.cacheTextareaVal || " ",
      EnterpriseId: this.data.EnterpriseId,
      EnterpriseName: this.data.EnterpriseName,
      ContactName: this.data.ContactName,
      ContactMobile: this.data.ContactMobile
    }
    if (this.data.optionsId) {
      urlData.Id = this.data.optionsId;
      promisefy.EnterpriseJobPromise({
        url: 'UpdateJob',
        method: "POST",
        data: {
          input: urlData
        }
      }).then(res => {
        if (!res.data.Succeed) {
          wx.showModal({
            title: '提示',
            content: res.data.ErrorMessage,
            cancelText: '知道了',
            showCancel: false,
            success: function (res) {
            }
          })
          return;
        }
        publishSucceed();
      })
      return;
    }

    promisefy.EnterpriseJobPromise({
      url: 'AddJob',
      method: 'POST',
      data: {
        input: urlData
      }
    }).then(res => {
      if (!res.data.Succeed) {
        wx.showModal({
          title: '提示',
          content: res.data.ErrorMessage,
          cancelText: '知道了',
          showCancel: false,
          success: function (res) {
          }
        })
        return;
      }
      publishSucceed();
    }).done();

  },
  //保存按钮
  saveFuc: function () {
    this.setData({ textareaVal: this.data.cacheTextareaVal })
    wx.setStorageSync('publishWeb', [this.data])
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 500
    })
  }
})

function publishSucceed() {
  wx.showModal({
    title: '提示',
    content: "发布成功，我们会在两个工作日内审核",
    cancelText: '知道了',
    showCancel: false,
    success: function (res) {
      app.globalData.SalaryObj = {}
      wx.setStorageSync("publishWeb", [])
      let web = getCurrentPages();
      wx.navigateBack({
        delta: web[web.length-2] 
      })
      // wx.redirectTo({ url:'/page/recruit/recruitDetail/recruitDetail' })
      app.globalData.publishToRecruitDetail = true;
    }
  })
}