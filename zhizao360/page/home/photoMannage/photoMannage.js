// page/home/photoMannage/photoMannage.js
// var utils = require('../../../utils/util.js');
var promisefy = require('../../../utils/promise.js');
var app = getApp();
var cookie = wx.getStorageSync('cookie');
var rd_session = wx.getStorageSync('rd_session');
Page({
  data: {
    eventObj: {
      ChooseImage1: "ChooseImage1",
      ChooseImage2: "ChooseImage2",
      ChooseImage: "ChooseImage"
    },
    rootUrl: '',
    iconDeleteUrl: "/icon/icon_delete.png",
    serviceUrl1: "",
    serviceUrl2: "",
    serviceUrl3: "",
    serviceUrl4: "",
    serviceUrl5: "",
    serviceUrl6: "",
    Sum1: 0,
    Sum2: 0,
    limitSum1: 1,
    limitSum2: 1,
    oImageList1: [],
    oImageList2: [],
    oImageList3: [],
    oImageList4: [],
    oImageList5: [],
    oImageList6: [],
    imitSum: 100,
    closeflag3: false,
    closeflag4: false,
    closeflag5: false,
    closeflag6: false,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;

    //相册管理
    promisefy.EnterpriseImagePromise({
      url: 'GetImages',
      method: 'POST',
      data: { EnterpriseId: app.globalData.EnterpriseId },
    }).then(res => {
        var obj = res.data;
        for (let i in obj) {
          for (let j = 0; j < obj[i].length; j++) {
            obj[i][j].Compressed = app.globalData.rootUrl + obj[i][j].Compressed;
            obj[i][j].Original = app.globalData.rootUrl + obj[i][j].Original;
          }
        }
        that.setData({
          oImageList1: obj.PathList1 ? obj.PathList1 : [],
          Sum1: obj.PathList1 ? obj.PathList1.length : 0,
          oImageList2: obj.PathList2 ? obj.PathList2 : [],
          Sum2: obj.PathList2 ? obj.PathList2.length : 0,
          oImageList3: obj.PathList3 ? obj.PathList3 : [],
          oImageList4: obj.PathList4 ? obj.PathList4 : [],
          oImageList5: obj.PathList5 ? obj.PathList5 : [],
          oImageList6: obj.PathList6 ? obj.PathList6 : [],
        })
    }).done();

    
    // utils.EnterpriseImageRequest({
    //   url: 'GetImages',
    //   method: 'POST',
    //   data: { EnterpriseId: app.globalData.EnterpriseId },
    //   callback: function (res) {
    //     var obj = res.data;

    //     for (let i in obj) {
    //       for (let j = 0; j < obj[i].length; j++) {
    //         obj[i][j].Compressed = app.globalData.rootUrl + obj[i][j].Compressed;
    //         obj[i][j].Original = app.globalData.rootUrl + obj[i][j].Original;
    //       }

    //     }
    //     that.setData({
    //       oImageList1: obj.PathList1 ? obj.PathList1 : [],
    //       Sum1: obj.PathList1 ? obj.PathList1.length : 0,
    //       oImageList2: obj.PathList2 ? obj.PathList2 : [],
    //       Sum2: obj.PathList2 ? obj.PathList2.length : 0,
    //       oImageList3: obj.PathList3 ? obj.PathList3 : [],
    //       oImageList4: obj.PathList4 ? obj.PathList4 : [],
    //       oImageList5: obj.PathList5 ? obj.PathList5 : [],
    //       oImageList6: obj.PathList6 ? obj.PathList6 : [],
    //     })

    //   }
    // })


  },
  ChooseImage1: function (e) {
    var that = this
    wx.chooseImage({
      count: this.data.limitSum1,
      success: function (res) {
        var index = e.currentTarget.dataset.index;
        that.upLoadImage(res.tempFilePaths, 'AddCover', index);  //添加封面图片
      }
    })
  },
  ChooseImage2: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.chooseImage({
      count: this.data.limitSum2,
      success: function (res) {
        that.upLoadImage(res.tempFilePaths, "AddGate", index);  //添加大门图片
      }
    })
  },
  //选择图片
  ChooseImage: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;

    wx.chooseImage({
      count: this.data.panelimitSum,
      success: function (res) {

        if (index == 3) {
          that.upLoadImage(res.tempFilePaths, 'AddProcessingEquipment', index); //添加加工该设备图片

        }
        if (index == 4) {
          that.upLoadImage(res.tempFilePaths, 'AddTestingEquipment', index); //添加检测设备图片

        }
        if (index == 5) {
          that.upLoadImage(res.tempFilePaths, 'AddOffice', index);  //添加办公区域图片
        }
        if (index == 6) {
          that.upLoadImage(res.tempFilePaths, 'AddProduct', index); //添加产品图片
        }

      }
    })
  },
  //删除图片
  removeImage: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var imgId = e.currentTarget.dataset.imgid;

    if (index == 1) {
      if (!imgId) { return; }
      that.delfun('DeleteCover', imgId, function () {
        that.data.oImageList1.splice(id, 1);
        that.setData({
          oImageList1: that.data.oImageList1,
          Sum1: 0
        })
      });
    }

    if (index == 2) {
      if (!imgId) { return; }
      that.delfun('DeleteGate', imgId, function () {
        that.data.oImageList2.splice(id, 1);
        that.setData({
          oImageList2: that.data.oImageList2,
          Sum2: 0
        })
      });
    }

    if (index == 3) {
      if (!imgId) { return; }
      that.delfun('DeleteProcessingEquipment', imgId, function () {
        that.data.oImageList3.splice(id, 1);
        that.setData({
          oImageList3: that.data.oImageList3
        })
      });
    }
    if (index == 4) {

      if (!imgId) { return; }
      that.delfun('DeleteTestingEquipment', imgId, function () {
        that.data.oImageList4.splice(id, 1);
        that.setData({
          oImageList4: that.data.oImageList4
        })
      });
    }
    if (index == 5) {

      if (!imgId) { return; }
      that.delfun('DeleteOffice', imgId, function () {
        that.data.oImageList5.splice(id, 1);
        that.setData({
          oImageList5: that.data.oImageList5
        })
      });
    }
    if (index == 6) {

      if (!imgId) { return; }
      that.delfun('DeleteProduct', imgId, function () {
        that.data.oImageList6.splice(id, 1);
        that.setData({
          oImageList6: that.data.oImageList6
        })
      });
    }

  },
  //预览图片
  previewImage: function (e) {
    var that = this;
    var current = e.currentTarget.dataset.src;
    var index = e.currentTarget.dataset.index;
    var imgIndex = e.currentTarget.dataset.imgindex;
    var arr = [];
    if (index == 1) {
      wx.previewImage({
        current: current,
        urls: [that.data.oImageList1[0].Original]
      })
    }
    if (index == 2) {
      wx.previewImage({
        current: current,
        urls: [that.data.oImageList2[0].Original]
      })
    }
    if (index == 3) {
      for (let i = 0; i < that.data.oImageList3.length; i++) {
        arr.push(that.data.oImageList3[i].Original)
      }

      wx.previewImage({
        current: arr[imgIndex],
        urls: arr
      })
    }
    if (index == 4) {
      for (let i = 0; i < that.data.oImageList4.length; i++) {
        arr.push(that.data.oImageList4[i].Original)
      }
      wx.previewImage({
        current: arr[imgIndex],
        urls: arr
      })
    }
    if (index == 5) {
      for (let i = 0; i < that.data.oImageList5.length; i++) {
        arr.push(that.data.oImageList5[i].Original)
      }
      wx.previewImage({
        current: arr[imgIndex],
        urls: arr
      })
    }
    if (index == 6) {
      for (let i = 0; i < that.data.oImageList6.length; i++) {
        arr.push(that.data.oImageList6[i].Original)
      }
      wx.previewImage({
        current: arr[imgIndex],
        urls: arr
      })
    }

  },
  //右上角删除图标事件
  delImages: function (e) {
    // var index = e.currentTarget.dataset.index;
    // if (index == 3) {
    //   this.setData({
    //     closeflag3: !this.data.closeflag3,
    //   })
    // }
    // if (index == 4) {
    //   this.setData({
    //     closeflag4: !this.data.closeflag4,
    //   })
    // }
    // if (index == 5) {
    //   this.setData({
    //     closeflag5: !this.data.closeflag5,
    //   })
    // }
    // if (index == 6) {
    //   this.setData({
    //     closeflag6: !this.data.closeflag6,
    //   })
    // }

  },
  //上传图片
  upLoadImage: function (arr, url, index) {
    var that = this;
    wx.showLoading({
      title: '上传中...',
      mask: true,
    })
    var cookie = wx.getStorageSync('cookie');
    var rd_session = wx.getStorageSync('rd_session');
    for (let i = 0; i < arr.length; i++) {
      wx.uploadFile({
        url: app.globalData.rootUrl + '/WXApi/EnterpriseImage/' + url,
        filePath: arr[i],
        header: {
          cookie: cookie,
          rd_session: rd_session
        },
        name: 'image',
        success: function (rest) {
          var data = JSON.parse(rest.data);
          if (!data.Succeed) {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: "" + data.ErrorMessage + "",
              showCancel: false,
              confirmText: "知道了"
            })
            return;
          }
          var OriginalUrl = app.globalData.rootUrl + data.Data.Original;
          if (index == 1) {

            that.data.oImageList1 = [{
              Original: OriginalUrl,
              Id: data.Data.Id
            }]
            that.setData({
              oImageList1: that.data.oImageList1,
              Sum1: that.data.oImageList1.length
            })

          }
          if (index == 2) {
            that.data.oImageList2 = [{
              Original: OriginalUrl,
              Id: data.Data.Id
            }]
            that.setData({
              oImageList2: that.data.oImageList2,
              Sum2: that.data.oImageList2.length
            })
          }
          if (index == 3) {
            that.data.oImageList3.push({
              Original: OriginalUrl,
              Id: data.Data.Id
            })
            that.setData({ oImageList3: that.data.oImageList3 })
          }
          if (index == 4) {
            that.data.oImageList4.push({
              Original: OriginalUrl,
              Id: data.Data.Id
            })
            that.setData({ oImageList4: that.data.oImageList4 })
          }
          if (index == 5) {
            that.data.oImageList5.push({
              Original: OriginalUrl,
              Id: data.Data.Id
            })
            that.setData({ oImageList5: that.data.oImageList5 })
          }
          if (index == 6) {
            that.data.oImageList6.push({
              Original: OriginalUrl,
              Id: data.Data.Id
            })
            that.setData({ oImageList6: that.data.oImageList6 })
          }


          //do something
          if (i == arr.length - 1) {
            wx.hideLoading();
          }
        },
        fail: function (res) {
        }
      })
    }
  },
  //删除图片
  delfun: function (url, Id, cb) {

   promisefy.EnterpriseImagePromise({
      url: url,
      method: 'POST',
      data: { id: Id },
   }).then(res => {
      if (res.data.Succeed) {cb && cb();}
   }).done();

    // utils.EnterpriseImageRequest({
    //   url: url,
    //   method: 'POST',
    //   data: { id: Id },
    //   callback: function (res) {
    //     if (res.data.Succeed) {
    //       cb && cb();
    //     }
    //   }
    // })
  }
})