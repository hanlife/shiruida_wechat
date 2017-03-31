// page/ordinarylist/release/release.js
var appInstance = getApp();
var utils = require('../../../utils/util.js');

var deviceList = [  //添加设备列表
  {
    deviceName: "",
    deviceNum: 0,
    deviceId: '',
    Amount: 0,
    Id: ''
  }
];
var deviceArray = null  //闲置设备名称

Page({
  data: {
    deviceArray: [],
    device_list: deviceList,
    deleteDevice: true,
    addDevice: false,
  },
  //减少
  num_Reduce: function (e) {
    var i = e.target.dataset.index;
    if (deviceList[i].deviceNum <= 0) {
      return false;
    } else {
      deviceList[i].deviceNum--;
      this.setData({
        device_list: deviceList,
      })
    }
  },
  //增加
  num_Add: function (e) {
    var i = e.target.dataset.index;
    if (deviceList[i].deviceNum >= deviceList[i].Amount) {
      return false;
    } else {
      deviceList[i].deviceNum++;
      // deviceArray[deviceList[i].Id].Amount--;
      this.setData({
        device_list: deviceList,
        deviceArray: deviceArray
      })
    }
  },
  //添加设备
  device_add: function () {
    if (deviceList.length >= 3) {
      return;
    } else {
      deviceList.push({
        deviceName: "",
        deviceNum: 0,
        deviceId: '',
        Amount: 0,
        Id: ''
      })
      check(this);
      //设备列表只有2个时
      if (deviceArray.length == deviceList.length) {
        this.setData({
          addDevice: true,
        })
      }
    }
  },
  //删除设备
  device_delete: function (e) {
    var i = e.target.dataset.index;
    deviceList.splice(i, 1);
    check(this);
  },
  bindPickerChange: function (e) {
    console.log(e)
    var value = e.detail.value;
    var i = e.target.dataset.index;
    var bool = false;     //是否已经添加
    deviceList[i].deviceNum = 0;

    for (var j = 0; j < deviceList.length; j++) {
      if (deviceList[j].Id == value) {
        wx.showModal({
          title: '提示',
          content: '该设备已经添加，请选择其他设备',
          showCancel: false,
          success: function (res) {

          }
        })
        bool = true;
        break;
      }
    }
    //是否已经添加
    if (!bool) {
      console.log(bool)
      deviceList[i].deviceName = deviceArray[value].Name;
      deviceList[i].deviceId = deviceArray[value].Id;
      deviceList[i].Amount = deviceArray[value].Amount;
      deviceList[i].Id = value;

      this.setData({
        deviceArray: deviceArray,
        device_list: deviceList
      })
    }

  },
  Eventbinding: function () {
    var input = [];
    for (var i = 0; i < deviceList.length; i++) {
      if (deviceList[i].deviceId == 0 || deviceList[i].deviceNum == "") {
        continue;
      }
      var obj = {
        DeviceId: deviceList[i].deviceId,
        Qty: deviceList[i].deviceNum
      }
      input.push(obj);
    }
    if (input.length == 0) {
      return;
    } else {
      // 发布
      utils.DeviceRequest({
        url: "PublicCapacity",
        method: "post",
        data: { input: input },
        callback: function (res) {
          //清空
          deviceList = [
            {
              deviceName: "",
              deviceNum: 0,
              deviceId: '',
              Amount: 0,
              Id: ''
            }
          ]
          console.log(res)
          if (res.data.Succeed) {
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              wx.hideToast();
              wx.switchTab({
                url: '/page/ordinarylist/index/index'
              })
            }, 2000)
          }
        }
      })

    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    //获取用户设备信息
    utils.DeviceRequest({
      url: "GetDevices",
      method: "post",
      callback: function (res) {
        deviceArray = res.data;
        that.setData({
          deviceArray: deviceArray,
          device_list: deviceList,
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
  }
})

function check(t) {
  if (deviceList.length == 3) {
    t.setData({
      addDevice: true,
    })
  } else {
    t.setData({
      addDevice: false,
    })
  }
  if (deviceList.length > 1) {
    t.setData({
      device_list: deviceList,
      deleteDevice: false
    })
  } else {
    t.setData({
      device_list: deviceList,
      deleteDevice: true
    })
  }
}