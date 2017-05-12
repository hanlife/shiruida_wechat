// page/home/industiyInfor/industiyInfor.js
var bmap = require('../../../utils/bmap-wx.min.js');
// var utils = require('../../../utils/util.js');
var promisefy = require('../../../utils/promise.js');
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
    this.setData({ companyName: "" })
  },
  bindInputTeatarea: function (e) {
    this.setData({
      addressDetail: e.detail.value
    })
  },
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

  ChooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      success: function (res) {
        that.setData({
          photoArray: res.tempFilePaths
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
    
    wx.showToast({
              title: "提交审核中...",
              icon: "loading",
              mask: true,
              duration: 3000
            }) 
    promisefy.EnterprisePromise({
      url: "GetCertificationInfo",
      method: 'POST',
    }).then(res => {
      if (res.data.Status == "审核通过") {
        wx.showModal({
          title: '提示',
          content: '该企业已通过审核',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({ url: '/page/home/industiyInfor/industiyInfor' })
            }
          }
        })
        return;
      }
      if (!that.data.companyName || that.data.companyName.length < 2 || that.data.companyName.length > 30) {
        massage += '请输入2-30个字的公司名称；'
      }
      if (!that.data.address) {
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
      if (that.data.photoArray[0] != that.data.ophotoArray[0]) {   //没有修改图片
        wx.uploadFile({
          url: app.globalData.rootUrl + '/WXApi/Enterprise/Upload',
          filePath: that.data.photoArray[0],
          name: 'image',
          success: function (res) {
            var data = JSON.parse(res.data);
            that.setData({
              photoArray: [app.globalData.rootUrl + data.Data.href]
            })
            submitFuc();
          }
        })
      } else {   //{ 修改图片 }
        submitFuc();
      }
      function submitFuc() {
        var LicenseImageUrl = "/Uploads" + that.data.photoArray[0].split("Uploads")[1];
        var obj = {
          Name: that.data.companyName,            //公司名称
          Province: that.data.province || that.data.city,       //省
          City: that.data.province ? that.data.city : that.data.county,             //市
          County: that.data.province ? that.data.county : '',    //县
          Id: app.globalData.EnterpriseId,
          Address: that.data.addressDetail,       //详细地址
          Longitude: that.data.longitude,         //经度   
          Latitude: that.data.latitude,           //维度 
          LicenseImage: LicenseImageUrl,  //营业执照图片路径
          Status: that.data.status                //状态
        }
        promisefy.EnterprisePromise({
          url: 'SubmitCertification',
          method: 'POST',
          data: obj,
        }).then( res => {
          wx.showToast({
              title: "提交成功",
              icon: "success",
              mask: true,
              duration: 1000
            })
        }).done();
      }
    }).done();

    // utils.EnterpriseRequest({
    //   url: "GetCertificationInfo",
    //   method: 'POST',
    //   callback: function (res) {
    //     if (res.data.Status == "审核通过") {
    //       wx.showModal({
    //         title: '提示',
    //         content: '该企业已通过审核',
    //         showCancel: false,
    //         success: function (res) {
    //           if (res.confirm) {
    //             wx.redirectTo({ url: '/page/home/industiyInfor/industiyInfor' })
    //           }
    //         }
    //       })
    //       return;
    //     }
    //     if (!that.data.companyName || that.data.companyName.length < 2 || that.data.companyName.length > 30) {
    //       massage += '请输入2-30个字的公司名称；'
    //     }
    //     if (!that.data.address) {
    //       massage += '选择地区不能为空；'
    //     }
    //     if (!that.data.addressDetail) {
    //       massage += '详细地址不能为空；'
    //     }
    //     if (!that.data.photoArray[0]) {
    //       massage += '营业执照不能为空；'
    //     }
    //     if (massage) {
    //       wx.showModal({
    //         title: '提示',
    //         content: massage,
    //         showCancel: false,
    //         confirmText: '知道了',
    //       })
    //       return;
    //     }
    //     if (that.data.photoArray[0] != that.data.ophotoArray[0]) {   //没有修改图片
    //       wx.uploadFile({
    //         url: app.globalData.rootUrl + '/WXApi/Enterprise/Upload',
    //         filePath: that.data.photoArray[0],
    //         name: 'image',
    //         success: function (res) {
    //           var data = JSON.parse(res.data);
    //           that.setData({
    //             photoArray: [app.globalData.rootUrl + data.Data.href]
    //           })
    //           submitFuc();
    //         }
    //       })
    //     } else {   //{ 修改图片 }
    //       submitFuc();
    //     }
    //     function submitFuc() {
    //       var LicenseImageUrl = "/Uploads" + that.data.photoArray[0].split("Uploads")[1];
    //       var obj = {
    //         Name: that.data.companyName,            //公司名称
    //         Province: that.data.province || that.data.city,       //省
    //         City: that.data.province ? that.data.city : that.data.county,             //市
    //         County: that.data.province ? that.data.county : '',    //县
    //         Id: app.globalData.EnterpriseId,
    //         Address: that.data.addressDetail,       //详细地址
    //         Longitude: that.data.longitude,         //经度   
    //         Latitude: that.data.latitude,           //维度 
    //         LicenseImage: LicenseImageUrl,  //营业执照图片路径
    //         Status: that.data.status                //状态
    //       }
    //       utils.EnterpriseRequest({
    //         url: 'SubmitCertification',
    //         method: 'POST',
    //         data: obj,
    //         callback: function (res) {
    //           wx.showToast({
    //             title: "提交成功",
    //             icon: "success",
    //             duration: 1000
    //           })

    //         }
    //       })
    //     }
    //   }
    // })



  },
  onLoad: function () {
    var that = this;
    var data = app.globalData.industiyInforData

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    //企业认证
    promisefy.EnterprisePromise({
      url: 'GetCertificationInfo',
      method: 'POST'
    }).then(res => {
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
        if (res.data.Province && res.data.City) {
          address = res.data.Province + " " + res.data.City + " " + res.data.County
        }

        that.setData({
          companyName: res.data.Name,       //公司名称
          address: address || '地区选择',               //地区
          addressDetail: res.data.Address,   //详细地址   
          photoArray: res.data.LicenseImage ? [app.globalData.rootUrl + res.data.LicenseImage] : '',         //营业执照
          ophotoArray: res.data.LicenseImage ? [app.globalData.rootUrl + res.data.LicenseImage] : '',        //保存初始数据
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
    }).done();

    // utils.EnterpriseRequest({
    //   url: 'GetCertificationInfo',
    //   method: 'POST',
    //   callback: function (res) {
    //     that.setData({
    //       checkStatusText: res.data.Status
    //     })

    //     if (res.data.Status == "审核通过") {
    //       returnData(res.data, res.data.Status, true);
    //     } else {  //待提交、待审核、审核不同通过
    //       returnData(res.data, "提交审核", false);
    //     }
    //     wx.hideLoading();
    //     function returnData(data, buttonText, btnFlag) {
    //       var address = '';
    //       if (res.data.Province && res.data.City) {
    //         address = res.data.Province + " " + res.data.City + " " + res.data.County
    //       }

    //       that.setData({
    //         companyName: res.data.Name,       //公司名称
    //         address: address || '地区选择',               //地区
    //         addressDetail: res.data.Address,   //详细地址   
    //         photoArray: res.data.LicenseImage ? [app.globalData.rootUrl + res.data.LicenseImage] : '',         //营业执照
    //         ophotoArray: res.data.LicenseImage ? [app.globalData.rootUrl + res.data.LicenseImage] : '',        //保存初始数据
    //         province: res.data.Province,
    //         city: res.data.City,
    //         county: res.data.County,
    //         longitude: res.data.Longitude,
    //         latitude: res.data.Latitude,
    //         status: res.data.Status,
    //         buttonText: buttonText || "提交审核",   //按钮文字
    //         btnFlag: btnFlag || false
    //       })

    //     }
    //   }
    // })

  }
}


Page(pageObject)


