// page/home/photoMannage/photoMannage.js
var app = getApp();

Page({
  data: {
    arr:[
      {
        text:"7777777",
        sum: 'Sum1'
      },
       {
        text:"8888888",
         sum: 'Sum2'
      },
       {
        text:"9999999"
      }

    ],
    eventObj: {
      ChooseImage1: "ChooseImage1",
      ChooseImage2: "ChooseImage2",
      ChooseImage: "ChooseImage"
    },
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
    ImageList2: [],
    ImageList3: [],
    ImageList4: [],
    ImageList5: [],
    ImageList6: [],
    imitSum: 100,
    delflag3: true,
    delflag4: true,
    delflag5: true,
    delflag6: true,
    closeflag3: true,
    closeflag4: true,
    closeflag5: true,
    closeflag6: true,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
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
    console.log(e)
    var that = this
    wx.chooseImage({
      count: this.data.panel1limitSum,
      success: function (res) {
        console.log(res)
        that.upLoadImage(res.tempFilePaths); 
        that.setData({
          panel1Sum: res.tempFilePaths.length,
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
        console.log(res)
        that.upLoadImage(res.tempFilePaths);

        that.setData({
          panel2Sum: res.tempFilePaths.length,
          ImageList2: res.tempFilePaths
        })

      }
    })
  },
  //选择图片
  ChooseImage: function (e) {
    console.log(e)
    var that = this
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;

    wx.chooseImage({
      count: this.data.panelimitSum,
      success: function (res) {
        console.log(res)
        console.log(res.tempFilePaths.length)

       that.upLoadImage(res.tempFilePaths);

        if (index == 3) {
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            that.data.ImageList3.push(res.tempFilePaths[i]);
          }
          that.setData({
            ImageList3: that.data.ImageList3,
            delflag3: false
          })

        }
        if (index == 4) {
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            that.data.ImageList4.push(res.tempFilePaths[i]);
          }
          that.setData({
            ImageList4: that.data.ImageList4,
            delflag4: false
          })

        }
        if (index == 5) {
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            that.data.ImageList5.push(res.tempFilePaths[i]);
          }
          that.setData({
            ImageList5: that.data.ImageList5,
            delflag5: false
          })

        }
        if (index == 6) {
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            that.data.ImageList6.push(res.tempFilePaths[i]);
          }
          that.setData({
            ImageList6: that.data.ImageList6,
            delflag6: false
          })

        }

      }
    })
  },
  //删除图片
  removeImage: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;

    if (index == 3) {
      this.data.ImageList3.splice(id, 1);
      this.setData({
        ImageList3: this.data.ImageList3
      })
    }
    if (index == 4) {
      this.data.ImageList4.splice(id, 1);
      this.setData({
        ImageList4: this.data.ImageList4
      })
    }
    if (index == 5) {
      this.data.ImageList5.splice(id, 1);
      this.setData({
        ImageList5: this.data.ImageList5
      })
    }
    if (index == 6) {
      this.data.ImageList6.splice(id, 1);
      this.setData({
        ImageList6: this.data.ImageList6
      })
    }

  },
  //预览图片
  previewImage: function (e) {
    console.log(e)
    var current = e.currentTarget.dataset.src;
    var index = e.currentTarget.dataset.index;

    if (index == 1) {
      wx.previewImage({
        current: current,
        urls: this.data.ImageList1
      })
    }
    if (index == 2) {
      wx.previewImage({
        current: current,
        urls: this.data.ImageList2
      })
    }
    if (index == 3) {
      wx.previewImage({
        current: current,
        urls: this.data.ImageList3
      })
    }
    if (index == 4) {
      wx.previewImage({
        current: current,
        urls: this.data.ImageList4      })
    }
    if (index == 5) {
      wx.previewImage({
        current: current,
        urls: this.data.ImageList5
      })
    }
    if (index == 6) {
      wx.previewImage({
        current: current,
        urls: this.data.ImageList6
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
  upLoadImage: function (arr) {
    wx.showLoading({
      title: '上传中...',
      mask: true,
    })
    for (let i = 0; i < arr.length; i++) {
      wx.uploadFile({
        url: app.globalData.rootUrl + '/WXApi/Enterprise/Upload',
        filePath: arr[i],
        name: 'image',
        success: function (rest) {
          var data = rest.data
          console.log("++++++++++++++++++")
          //do something
          console.log(i)
          if (i == arr.length - 1) {
            wx.hideLoading();
          }

        }
      })
    }
  }
})