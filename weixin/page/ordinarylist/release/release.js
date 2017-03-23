// page/ordinarylist/release/release.js
var deviceList = [
  {
    deviceName: "",
    deviceNum: 0,
  }
];
var deviceArray = [
  {
    index: 0,
    name: "设备名称一"
  }, {
    index: 1,
    name: "设备名称二"
  }, {
    index: 2,
    name: "设备名称三"
  }
]

Page({
  data: {
    deviceArray: deviceArray,
    device_list: deviceList,
    deleteDevice: true,
    addDevice: false,
  },
  //增加
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
  //减少
  num_Add: function (e) {
    var i = e.target.dataset.index;
    if (deviceList[i].deviceNum >= 10) {
      return false;
    } else {
      deviceList[i].deviceNum++;
      this.setData({
        device_list: deviceList,
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
      })
      check(this);
    }
  },
  //删除设备
  device_delete: function (e) {
    var i = e.target.dataset.index;
    deviceList.splice(i, 1);
    check(this);
  },
  bindPickerChange: function (e) {
    var value = e.detail.value;
    var i = e.target.dataset.index;
    deviceList[i].deviceName = deviceArray[value].name;
    this.setData({
      device_list: deviceList,
    })
  },
  Eventbinding:function(){
    console.log(deviceList);
    console.log(this.data.device_list);
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