// page/home/industiyInfor/industiyInfor.js
var utils = require('../../../utils/util.js');
var app = getApp();
const data = wx.getStorageSync("industiyInforData");
var pageObject = {
  data: {
    companyName: '',       //公司名称
    address: '地区选择',               //地区
    addressDetail: '',   //详细地址   
    photoArray: '',         //营业执照
    province: '',
    city: '',
    county: '',
    longitude: '',
    latitude: '',
    status: '',
    buttonText: '',   //按钮文字
    btnFlag: '',

    clearFlag: true,
    hasAddress: true
  },
  bindInputName: function (e) {
    if (e.detail.value.length > 0) {
      this.setData({
        clearFlag: false,
        companyName: e.detail.value
      })
    } else {
      this.setData({
        clearFlag: true,
        companyName: e.detail.value
      })
    }
  },
  clearText: function () {
    this.setData({
      companyName: ""
    })
  },
  bindInputTeatarea: function (e) {
    this.setData({
      addressDetail: e.detail.value
    })
  },
  chooseLocation: function () {

    wx.chooseLocation({
      success: (res) => {
        var provinceArray = res.address.split("省", 2);
        var cityArray = provinceArray[1].split("市", 2);
        if (cityArray[1].indexOf("县") != -1) {
          var county = cityArray[1].substring(0, cityArray[1].indexOf("县") + 1);
          var detail = cityArray[1].split("县", 2)[1];
        }
        if (cityArray[1].indexOf("区") != -1) {
          var county = cityArray[1].substring(0, cityArray[1].indexOf("区") + 1);
          var detail = cityArray[1].split("区", 2)[1];
        }
        var province = provinceArray[0];
        var city = cityArray[0];

        this.setData({
          address: province + "省 " + city + "市 " + county,
          addressDetail: detail + " " + res.name,
          province: province + "省",
          city: city + "市",
          county: county,
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    })
  },

  ChooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 3, // 最多可以选择的图片张数，默认9
      success: function (res) {

        that.setData({
          photoArray: res.tempFilePaths
        })
        // success


      }

    })

  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: this.data.photoArray
    })
  },
  //提交审核
  submitCheck: function () {
    var that = this;
    var massage = '';

    if (!that.data.companyName || that.data.companyName.length < 2 || that.data.companyName.length > 30) {
      massage += '请输入2-30个字的公司名称；'
    }
    if (!(that.data.province && that.data.city)) {
      massage += '选择地区不能为空；'
    }
    if (!that.data.addressDetail) {
      massage += '详细地址不能为空；'
    }
    if (!that.data.photoArray[0]) {
      massage += '营业执照不能为空；'
    }
    if (massage) {
      wx.showModal({
        title: '提示',
        content: massage,
        showCancel: false,
        confirmText: '知道了',
      })
      return;
    }

    wx.uploadFile({
      url: app.globalData.rootUrl + '/WXApi/Enterprise/Upload',
      filePath: that.data.photoArray[0],
      name: 'image',
      success: function (res) {
        var data = JSON.parse(res.data);
        that.setData({
          photoArray: [ app.globalData.rootUrl +  data.Data.href]
        })

      },
      complete: function (res) {
        var data = JSON.parse(res.data);
        var obj = {
          Name: that.data.companyName,            //公司名称
          Province: that.data.province,           //省
          City: that.data.city,                   //市
          County: that.data.county,               //县
          Id: app.globalData.EnterpriseId,
          Address: that.data.addressDetail,       //详细地址
          Longitude: that.data.longitude,         //经度   
          Latitude: that.data.latitude,           //维度 
          LicenseImage: data.Data.href,  //营业执照图片路径
          Status: that.data.status                //状态
        }

        utils.EnterpriseRequest({
          url: 'SubmitCertification',
          method: 'POST',
          data: obj,
          callback: function (res) {
            wx.showToast({
              title: "提交成功",
              icon: "success",
              duration: 1000
            })
          }
        })
      }
    })


  },
  onLoad: function () {
    var that = this;
    var data = app.globalData.industiyInforData

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    //企业认证
    utils.EnterpriseRequest({
      url: 'GetCertificationInfo',
      method: 'POST',
      callback: function (res) {
        that.setData({
          checkStatusText: res.data.Status
        })

        if (res.data.Status == "审核通过") {
          returnData(res.data, res.data.Status, true);
        } else {  //待提交、待审核、审核不同通过
          returnData(res.data, "提交审核", false);
        }
        wx.hideLoading();
        function returnData(data, buttonText, btnFlag) {
           var address = '';
          if( res.data.Province && res.data.City && res.data.County ){
              address = res.data.Province + " " + res.data.City + " " + res.data.County
          }
          
          that.setData({
            companyName: res.data.Name,       //公司名称
            address: address || '地区选择',               //地区
            addressDetail: res.data.Address,   //详细地址   
            photoArray: res.data.LicenseImage ? [ app.globalData.rootUrl + res.data.LicenseImage] : '',         //营业执照
            province: res.data.Province,
            city: res.data.City,
            county: res.data.County,
            longitude: res.data.Longitude,
            latitude: res.data.Latitude,
            status: res.data.Status,
            buttonText: buttonText || "提交审核",   //按钮文字
            btnFlag: btnFlag || false
          })

        }
      }
    })

  }
}


Page(pageObject)


