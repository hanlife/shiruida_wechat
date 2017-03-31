// page/home/myInformation/myInformation.js
var utils = require('../../../utils/util.js');

Page({
  data: {
    isChildAccount: false,
    EnterpriseId: '',  //有值是子账号 
    Id: '',
    IsShow: false,
    Mobile: '',
    Name: '',
    QQ: '',
    Wechat: ''
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var data = e.detail.value;

    utils.MemberInfoRequest({
      url: 'SaveMember',
      method: 'POST',
      data: {
        member: {
          EnterpriseId: that.data.EnterpriseId,
          Id: that.data.Id,
          IsShow: data.IsShow,
          Mobile: data.Mobile,
          Name: data.Name,
          QQ: data.QQ,
          Wechat: data.Wechat,
        }
      },
      callback: function (res) {
        if (res.data.Succeed) {

          if (that.data.isChildAccount) {   
            wx.showToast({
              title: "保存成功",
              icon: 'success',
              duration: 1000
            })
          } else {
            wx.showModal({
              title: '提交成功',
              content: '子账号申请提交成功，等待主账号审核通过',
              showCancel: false,
              confirmText: "知道了",
              success: function (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '/page/ordinarylist/index/index',
                  })
                }
              }
            })
          }
        }

      }

    })


  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    utils.MemberInfoRequest({
      url: 'Index',
      method:'POST',
      callback: function (res) {
        var isChildAccount = '';
        var nickName = wx.getStorageSync('nickName');
        if (res.data.EnterpriseId && true) {
          isChildAccount = true;
        }

        that.setData({
          isChildAccount: isChildAccount,
          Id: res.data.Id,
          IsShow: res.data.IsShow,
          Mobile: res.data.Mobile,
          Name: res.data.Name || nickName,
          QQ: res.data.QQ,
          Wechat: res.data.Wechat,
          EnterpriseId: res.data.EnterpriseId
        })
        console.log(res)
      }
    })

  },
  onReady: function () {
    // 页面渲染完成
  }
})