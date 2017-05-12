// page/home/equipment/detail/detail.js
// var utils = require('../../../../utils/util.js');
var promisefy = require('../../../../utils/promise.js');
var app = getApp();
var pagedata = wx.getStorageSync('equipmentDetailData');
Page({
  data: {
    imageUrl: {
      iconArrow: "/icon/icon_arrow.png"
    },
    buttonText: "",        //按钮文字
    pageFlag: '',          //0是修改页面 其他是添加页面
    Type: [{}, {}, {}],    //设备类型数组
    TypeIndex: 0,          //选中类型的索引
    TypeName: pagedata.TypeName || '',          //设备类型名称
    name: pagedata.Name,              //设备名称
    brand: pagedata.Brand,             //品牌
    Density: [{}, {}, {}], //密度
    DensityName: pagedata.PreciseLevel || '',       //密度名称
    number: pagedata.Amount || 1,             //设备数量 
    produceRange: pagedata.ProduceRange,      //加工行程
    id: ''                  //设备Id
  },
  onLoad: function (options) {

    // 页面初始化 options为页面跳转所带来的参数
    var that = this;

    //获取设备类型
    promisefy.BaseDataPromise({
      url: 'GetDeviceTypeDic',
    }).
      then(res => {
        this.setData({ Type: res.data })
      }).done();

    // utils.BaseDataRequest({
    //   callback: function (res) {
    //     that.setData({
    //       Type: res.data
    //     })
    //   }
    // })

    //获取设备精度

    promisefy.BaseDataPromise({
      url: 'GetPreciseDic',
      method: "POST"
    }).
      then(res => {
        this.setData({ Density: res.data })
      }).done();
    // utils.BaseDataRequest({
    //   url: 'GetPreciseDic',
    //   method: "POST",
    //   callback: function (res) {
    //     that.setData({
    //       Density: res.data
    //     })
    //   }
    // })

    var title = '',
      buttonText = '';

    if (options.pageFlag == 0) {   //显示设备修改页面
      title = '修改设备';
      buttonText = '修改';
      wx.setNavigationBarTitle({
        title: title,
      })
      that.setData({
        pageFlag: options.pageFlag,
        buttonText: buttonText,
        id: options.id
      })

      wx.showLoading({
        title: 'Loading...',
        mask: true
      })
      //获取详情
      promisefy.DevicePromise({
        url: 'GetDeviceById',
        method: 'POST',
        data: { id: options.id },
      }).then(res => {
           
          this.setData({
            DeviceType: res.data.DeviceType,
            TypeName: res.data.DeviceTypeName,
            name: res.data.Name,
            brand: res.data.Brand,
            DensityName: res.data.PreciseLevel,
            number: res.data.Amount,
            produceRange: res.data.ProduceRange
          })
          wx.hideLoading();
      }).done();

      // utils.DeviceRequest({
      //   url: 'GetDeviceById',
      //   method: 'POST',
      //   data: { id: options.id },
      //   callback: function (res) {

      //     that.setData({
      //       DeviceType: res.data.DeviceType,
      //       TypeName: res.data.DeviceTypeName,
      //       name: res.data.Name,
      //       brand: res.data.Brand,
      //       DensityName: res.data.PreciseLevel,
      //       number: res.data.Amount,
      //       produceRange: res.data.ProduceRange
      //     })
      //     wx.hideLoading({
      //       title: 'Loading',
      //       mask: true,

      //     })
      //   }
      // })


    } else {                 //显示设备添加页面
      title = '添加设备';
      buttonText = '添加';
      wx.setNavigationBarTitle({
        title: title,
      })
      that.setData({
        pageFlag: options.pageFlag,
        buttonText: buttonText
      })

    }

  },
  ChangeType: function (e) {   //选择类型
    this.setData({
      // TypeIndex: e.detail.value,
      DeviceType: this.data.Type[e.detail.value].Id,
      TypeName: this.data.Type[e.detail.value].Name
    })
  },
  ChangeDensity: function (e) {  //选择密度
    this.setData({
      DensityName: this.data.Density[e.detail.value].Name
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
  //添加设备 或 修改设备
  addORamend: function (e) {
    var that = this;
    var val = e.detail.value;
    var message = '';

    if (!that.data.TypeName) {
      message += "设备类型不能为空；"
    }
    if (!val.name) {
      message += "设备名称不能为空；"
    }
    if (!val.brand) {
      message += "设备品牌不能为空；"
    }
    if (!parseInt(val.amount)) {
      message += "设备数量不能为空；"
    }
    if (!val.preciseLevel) {
      message += "设备密度不能为空；"
    }

    if (message && true) {
      wx.showModal({
        title: '提示',
        content: message,
        showCancel: false,
        confirmText: "知道了",
        success: function (res) {
        }
      })
      return;
    }
    wx.showToast({
      title: 'Loading...',
      icon: 'loading',
      duration: 5000,
      mask: true
    })
    val.amount > 9999 ? val.amount = 9999 : val.amount;
    var obj = {
      Id: that.data.id,                //设备Id
      Name: val.name,                 //设备名称
      DeviceType: that.data.DeviceType,         //设备类型编号
      Brand: val.brand,               //设备品牌
      Amount: val.amount,             //设备数量
      PreciseLevel: val.preciseLevel, //精密程度
      ProduceRange: val.produceRange  //加工行程
    }

    if (that.data.pageFlag == 0) {    //修改
      promisefy.DevicePromise({
          url: 'UpdateDevice',
        method: 'POST',
        data: { model: obj }
      }).then(res => {
        if (res.data.Succeed) {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1000,
              mask: true,
              success: function () {
                var pageArr = getCurrentPages();
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }
      }).done();

      // utils.DeviceRequest({
      //   url: 'UpdateDevice',
      //   method: 'POST',
      //   data: { model: obj },
      //   callback: function (res) {
      //     if (res.data.Succeed) {
      //       wx.showToast({
      //         title: '修改成功',
      //         icon: 'success',
      //         duration: 1000,
      //         mask: true,
      //         success: function () {
      //           var pageArr = getCurrentPages();
      //           wx.navigateBack({
      //             delta: 1
      //           })
      //         }
      //       })
      //     }
      //   }
      // })

    } else {                        //添加
      promisefy.DevicePromise({
        url: 'AddDevice',
        method: 'POST',
        data: { model: obj },
      }).then( res => {
           wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000,
            mask: true,
            success: function () {
              var pageArr = getCurrentPages();
              wx.navigateBack({
                delta: 1
              })
            }
          })
      }).done();

      // utils.DeviceRequest({
      //   url: 'AddDevice',
      //   method: 'POST',
      //   data: { model: obj },
      //   callback: function (res) {
      //     wx.showToast({
      //       title: '添加成功',
      //       icon: 'success',
      //       duration: 1000,
      //       mask: true,
      //       success: function () {
      //         var pageArr = getCurrentPages();
      //         wx.navigateBack({
      //           delta: 1
      //         })
      //       }
      //     })
      //   }
      // })
    }

  },



})