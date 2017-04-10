// page/home/photoMannage/photoMannage.js
var utils = require('../../../utils/util.js');
var app = getApp();

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
    ImageList1: [],
    oImageList1: [],
    ImageList2: [],
    oImageList2: [],
    ImageList3: [],
    oImageList3: [],
    ImageList4: [],
    oImageList4: [],
    ImageList5: [],
    oImageList5: [],
    ImageList6: [],
    oImageList6: [],
    imitSum: 100,
    closeflag3: true,
    closeflag4: true,
    closeflag5: true,
    closeflag6: true,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;


    //相册管理
    utils.EnterpriseImageRequest({
      url: 'GetImages',
      method: 'POST',
      data: { EnterpriseId: app.globalData.EnterpriseId },
      callback: function (res) {
        var obj = res.data;

        for (let i in obj) {
          for (let j = 0; j < obj[i].length; j++) {
            obj[i][j].Compressed = app.globalData.rootUrl + obj[i][j].Compressed;
            obj[i][j].Original = app.globalData.rootUrl + obj[i][j].Original;
          }

        }
        that.setData({
          ImageList1: obj.PathList1 ? obj.PathList1 : [],
          Sum1: obj.PathList1 ? obj.PathList1.length : 0,
          ImageList2: obj.PathList2 ? obj.PathList2 : [],
          Sum2: obj.PathList2 ? obj.PathList2.length : 0,
          ImageList3: obj.PathList3 ? obj.PathList3 : [],
          ImageList4: obj.PathList4 ? obj.PathList4 : [],
          ImageList5: obj.PathList5 ? obj.PathList5 : [],
          ImageList6: obj.PathList6 ? obj.PathList6 : [],
        })

      }
    })


  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  ChooseImage1: function (e) {
    var that = this
    wx.chooseImage({
      count: this.data.panel1limitSum,
      success: function (res) {
        that.upLoadImage(res.tempFilePaths, 'AddCover');  //添加封面图片
        res.tempFilePaths = [{
          Compressed: res.tempFilePaths[0],
          Original: res.tempFilePaths[0]
        }]
        that.setData({
          Sum1: res.tempFilePaths.length,
          ImageList1: res.tempFilePaths
        })
      }
    })
  },
  ChooseImage2: function (e) {
    var that = this
    wx.chooseImage({
      count: this.data.panel1limitSum,
      success: function (res) {
        that.upLoadImage(res.tempFilePaths, "AddGate");  //添加大门图片
        res.tempFilePaths = [{
          Compressed: res.tempFilePaths[0],
          Original: res.tempFilePaths[0]
        }]
        that.setData({
          Sum2: res.tempFilePaths.length,
          ImageList2: res.tempFilePaths
        })

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
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            that.data.ImageList3.push({
              Compressed: res.tempFilePaths[i],
              Original: res.tempFilePaths[i]
            });
          }
          that.setData({
            ImageList3: that.data.ImageList3,
            delflag3: false
          })

          that.upLoadImage(res.tempFilePaths, 'AddProcessingEquipment'); //添加加工该设备图片

        }
        if (index == 4) {
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            that.data.ImageList4.push({
              Compressed: res.tempFilePaths[i],
              Original: res.tempFilePaths[i]
            });
          }
          that.setData({
            ImageList4: that.data.ImageList4,
            delflag4: false
          })
          that.upLoadImage(res.tempFilePaths, 'AddTestingEquipment'); //添加检测设备图片

        }
        if (index == 5) {
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            that.data.ImageList5.push({
              Compressed: res.tempFilePaths[i],
              Original: res.tempFilePaths[i]
            });
          }
          that.setData({
            ImageList5: that.data.ImageList5,
            delflag5: false
          })
          that.upLoadImage(res.tempFilePaths, 'AddOffice');  //添加办公区域图片
        }
        if (index == 6) {
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            that.data.ImageList6.push({
              Compressed: res.tempFilePaths[i],
              Original: res.tempFilePaths[i]
            });
          }
          that.setData({
            ImageList6: that.data.ImageList6,
            delflag6: false
          })
          that.upLoadImage(res.tempFilePaths, 'AddProduct'); //添加产品图片
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

    if (index == 3) {
      that.data.ImageList3.splice(id, 1);
      that.setData({
        ImageList3: that.data.ImageList3
      })
      if (!imgId) { return; }
      that.delfun('DeleteProcessingEquipment', imgId, function () { });
    }
    if (index == 4) {
      that.data.ImageList4.splice(id, 1);
      that.setData({
        ImageList4: that.data.ImageList4
      })
      if (!imgId) { return; }
      that.delfun('DeleteTestingEquipment', imgId, function () {

      });
    }
    if (index == 5) {
      that.data.ImageList5.splice(id, 1);
      that.setData({
        ImageList5: that.data.ImageList5
      })
      if (!imgId) { return; }
      that.delfun('DeleteOffice', imgId, function () {

      });
    }
    if (index == 6) {
      that.data.ImageList6.splice(id, 1);
      that.setData({
        ImageList6: that.data.ImageList6
      })
      if (!imgId) { return; }
      that.delfun('DeleteProduct', imgId, function () {

      });
    }

  },
  //预览图片
  previewImage: function (e) {
    var current = e.currentTarget.dataset.src;
    var index = e.currentTarget.dataset.index;
    var imgIndex = e.currentTarget.dataset.imgindex;
    var arr = [];
    if (index == 1) {
      wx.previewImage({
        current: current,
        urls: [this.data.ImageList1[0].Original]
      })
    }
    if (index == 2) {
      wx.previewImage({
        current: current,
        urls: [this.data.ImageList2[0].Original]
      })
    }
    if (index == 3) {

      for (let i = 0; i < this.data.ImageList3.length; i++) {
        arr.push(this.data.ImageList3[i].Original)
      }
      wx.previewImage({
        current: arr[imgIndex],
        urls: arr
      })
    }
    if (index == 4) {
      for (let i = 0; i < this.data.ImageList4.length; i++) {
        arr.push(this.data.ImageList4[i].Original)
      }
      wx.previewImage({
        current: arr[imgIndex],
        urls: arr
      })
    }
    if (index == 5) {
      for (let i = 0; i < this.data.ImageList5.length; i++) {
        arr.push(this.data.ImageList5[i].Original)
      }
      wx.previewImage({
        current: arr[imgIndex],
        urls: arr
      })
    }
    if (index == 6) {
      for (let i = 0; i < this.data.ImageList6.length; i++) {
        arr.push(this.data.ImageList6[i].Original)
      }
      wx.previewImage({
        current: arr[imgIndex],
        urls: arr
      })
    }

  },
  //右上角删除图标事件
  delImages: function (e) {
    var index = e.currentTarget.dataset.index;
    if (index == 3) {
      this.setData({
        closeflag3: !this.data.closeflag3,
      })
    }
    if (index == 4) {
      this.setData({
        closeflag4: !this.data.closeflag4,
      })
    }
    if (index == 5) {
      this.setData({
        closeflag5: !this.data.closeflag5,
      })
    }
    if (index == 6) {
      this.setData({
        closeflag6: !this.data.closeflag6,
      })
    }

  },
  //上传图片
  upLoadImage: function (arr, url) {
    var cookie = wx.getStorageSync('cookie');
    var rd_session = wx.getStorageSync('rd_session');
    wx.showLoading({
      title: '上传中...',
      mask: true,
    })
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
    utils.EnterpriseImageRequest({
      url: url,
      method: 'POST',
      data: { id: Id },
      callback: function (res) {
        if (res.data.Succeed) {
          cb && cb();
        }
      }
    })
  }
})