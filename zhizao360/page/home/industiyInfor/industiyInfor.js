// page/home/industiyInfor/industiyInfor.js
var utils = require('../../../utils/util.js');
var app = getApp();
const data  =   wx.getStorageSync("industiyInforData");
var pageObject = {
  data: {
    companyName: data.companyName,       //公司名称
    address: data.address,           //地区
    addressDetail: data.addressDetail,     //详细地址   
    photoArray: data.photoArray,        //营业执照
    province: data.province ,
    city: data.city,
    county: data.county,
    longitude: data.longitude,
    latitude: data.latitude,
    status: data.status,
    buttonText: data.buttonText || "提交审核",   //按钮文字
    btnFlag: data.btnFlag || false,  

    clearFlag: true,
    hasAddress: true
  },
  bindinput: function (e) {
    if (e.detail.value.length > 0) {
      this.setData({ 
        clearFlag: false,
        companyName:e.detail.value
       })
    } else {
      this.setData({ 
        clearFlag: true,
        companyName:e.detail.value
      })
    }
  },
  clearText: function () {
    this.setData({
      companyName: ""
    })
  },
  chooseLocation: function () {

    wx.chooseLocation({
      success: (res) => {
        console.log(res)
        var provinceArray = res.address.split("省", 2);
        console.log(provinceArray)
        var cityArray = provinceArray[1].split("市", 2);
        console.log(cityArray)
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

        console.log(res)
        this.setData({
          address: province + "省 " + city + "市 " + county,
          addressDetail: detail + " " + res.name,
          province: province + "省",
          city: city + "市",
          county: county,
          longitude:res.longitude,
          latitude:res.latitude
        })
      }
    })
  },
  
  ChooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 3, // 最多可以选择的图片张数，默认9
      success: function (res) {
        // success
        wx.showLoading({
          title: '上传中...',
          mask: true,
        })
        wx.uploadFile({
          url:  app.globalData.rootUrl + '/WXApi/Enterprise/Upload',
          filePath: res.tempFilePaths[0],
          name: 'image',
          success: function (res) {
            console.log("++++++++++++++++++")
            //do something
            wx.hideLoading();
          }
        })
        
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

    if (!that.data.companyName) {
      massage += '公司名称名称不能为空；'
    }
    if (!(that.data.province && that.data.city && that.data.county) ) {
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
        showCancel:'false',
        confirmText: '知道了',
        success: function (res) {

        }
      })
      return;
    }

    var obj = {
      Name: that.data.companyName,            //公司名称
      Province: that.data.province,           //省
      City: that.data.city,                   //市
      County: that.data.county,               //县
      Address: that.data.addressDetail,       //详细地址
      Longitude: that.data.longitude,         //经度   
      Latitude: that.data.latitude,           //维度 
      LicenseImage: that.data.photoArray[0],  //营业执照图片路径
      Status: that.data.status                //状态
    }

    utils.EnterpriseRequest({
      url: 'SubmitCertification',
      method: 'POST',
      data: obj,
      callback: function (res) {
        wx.showToast({
          title:"提交成功",
          icon:"success",
          duration:1000
        })
      }
    })

  },
  onLoad: function () {
    console.log(app)
    console.log()
    

  }
}


Page(pageObject)


