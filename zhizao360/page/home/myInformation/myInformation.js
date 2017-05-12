// page/home/myInformation/myInformation.js
// var utils = require('../../../utils/util.js');
var promisefy = require('../../../utils/promise.js');
var app = getApp();

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
    var that = this;
    var data = e.detail.value;
    var message = '';
    var reg = '^[a-zA-Z\u4e00-\u9fa5]+$';
    if (!data.Name || data.Name.match(reg) == null) {
      message += '请输入正确的姓名'
    }
    if (message) {
      wx.showModal({
        title: '提示',
        content: message,
        showCancel: false,
        confirmText: '知道了'
      })
      return;
    }
    this.setData({
      Name:data.Name,
      Mobile:data.Mobile,
      QQ:data.QQ,
      Wechat: data.Wechat,
      IsShow:data.IsShow
    })
   //保存基本资料
    promisefy.MemberInfoPromise({
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
        },
      },
    }).then( res => {
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
    }).done(); 

    // utils.MemberInfoRequest({
    //   url: 'SaveMember',
    //   method: 'POST',
    //   data: {
    //     member: {
    //       EnterpriseId: that.data.EnterpriseId,
    //       Id: that.data.Id,
    //       IsShow: data.IsShow,
    //       Mobile: data.Mobile,
    //       Name: data.Name,
    //       QQ: data.QQ,
    //       Wechat: data.Wechat,
    //     }
    //   },
    //   callback: function (res) {
    //     if (res.data.Succeed) {

    //       if (that.data.isChildAccount) {
    //         wx.showToast({
    //           title: "保存成功",
    //           icon: 'success',
    //           duration: 1000
    //         })
    //       } else {
    //         wx.showModal({
    //           title: '提交成功',
    //           content: '子账号申请提交成功，等待主账号审核通过',
    //           showCancel: false,
    //           confirmText: "知道了",
    //           success: function (res) {
    //             if (res.confirm) {
    //               wx.switchTab({
    //                 url: '/page/ordinarylist/index/index',
    //               })
    //             }
    //           }
    //         })
    //       }
    //     }

    //   }

    // })


  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var pageData = app.globalData.myInformationData;


   wx.showLoading({
     title:'加载中...',
     mask: true
   })
    //基础资料
    promisefy.MemberInfoPromise({
       url: 'Index',
      method: 'POST',
    }).then( res => {
      var isChildAccount = '';
        var nickName = wx.getStorageSync('nickName');
        if (res.data.EnterpriseId && true) {
          isChildAccount = true;
        }
        that.setData({
          isChildAccount: isChildAccount || false,
          Id: res.data.Id,
          IsShow: res.data.IsShow,
          Mobile: res.data.Mobile,
          Name: res.data.Name || '--',
          QQ: res.data.QQ,
          Wechat: res.data.Wechat,
          EnterpriseId: res.data.EnterpriseId
        })
        wx.hideLoading();
    }).done();
    // utils.MemberInfoRequest({
    //   url: 'Index',
    //   method: 'POST',
    //   callback: function (res) {
    //     var isChildAccount = '';
    //     var nickName = wx.getStorageSync('nickName');
    //     if (res.data.EnterpriseId && true) {
    //       isChildAccount = true;
    //     }
    //     that.setData({
    //       isChildAccount: isChildAccount || false,
    //       Id: res.data.Id,
    //       IsShow: res.data.IsShow,
    //       Mobile: res.data.Mobile,
    //       Name: res.data.Name || '--',
    //       QQ: res.data.QQ,
    //       Wechat: res.data.Wechat,
    //       EnterpriseId: res.data.EnterpriseId
    //     })
    //     wx.hideLoading();
    //   }
    // })

  },
  onReady: function () {
    // 页面渲染完成
  }
})