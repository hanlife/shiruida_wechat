// page/home/equipment/equipment.js
var utils = require('../../../utils/util.js');
var app = getApp();
Page({
  code: '',
  data: {
    equipmentArray: [],  //设备信息数组
    iconDeleteUrl: '/icon/icon_delete.png'
  },
  //删除设备
  removeEquipment: function (e) {
    var that = this;

    wx.showModal({
      title: '提示',
      content: '确定删除此设备？',
      success: function (res) {
        if (res.confirm) {
          var index = e.currentTarget.dataset.index;
          that.data.equipmentArray.splice(index, 1);
          that.setData({
            equipmentArray: that.data.equipmentArray
          })
          utils.DeviceRequest({
            url: 'DelDevice',
            method: 'POST',
            data: { id: e.currentTarget.dataset.id },
            callback: function (res) {
              if (res.data.Succeed) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                })
              }
            }
          })
        }
      }
    })

  },
  toEquipmentDetail: function (e) {
    wx.navigateTo({
     url: '/page/home/equipment/detail/detail?pageFlag=' + e.currentTarget.dataset.pageflag + "&id=" + e.currentTarget.dataset.id,
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    var that = this;
    var isImLogin = wx.getStorageSync('isImLogin');
    if (!isImLogin) {
      app.getUserInfo(equipmentInfo);
    }else{
      equipmentInfo();
    }

    function equipmentInfo() {
      wx.showLoading({
        title: 'Loading',
        mask: true
      })
      //获取用户设备信息
      utils.DeviceRequest({
        url: "GetDevices",
        method: 'POST',
        callback: function (res) {
          that.setData({
            equipmentArray: res.data
          })
          wx.hideLoading();
        }
      })
    }

  }

})