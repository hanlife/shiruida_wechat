// page/recruit/recruitInfo/recruitInfo/verify.js
var promisefy = require('../../../../utils/promise.js');
var Id = null;


Page({
  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    JobName: '',
    JobNameId: '',
    disabled_mobile: false,
    hid: false,
    disabled_code: true,
    Code: '',
    code_txt: '获取验证码',
    MobileInput: '',
    Mobile: '',
    ResultBtn: true
  },
  //工种选择
  bindPickerChange: function (e) {
    var index = e.detail.value;
    var JobName = this.data.array[index].Name;
    var JobNameId = this.data.array[index].Id;
    this.setData({
      JobName: JobName,
      JobNameId: JobNameId
    })
    CheckResultBtn(this);
  },
  //手机号输入
  EventInput: function (e) {
    var value = e.detail.value;
    var disabled_code = true;
    if (value.length == 11) {
      var disabled_code = false;
    }
    this.setData({
      Mobile: value,
      disabled_code: disabled_code
    })
    CheckResultBtn(this);
  },
  //获取验证码
  EventGetAuthcode: function () {
    var that = this;
    if (!CheckMobile(that)) {
      return false;
    }
    promisefy.UserPromise({
      url: 'SendAuthCode',
      method: 'GET',
      data: {
        mobile: that.data.Mobile
      },
    }).then(res => {
      countDown(that);
    }).done();
  },
  //输入验证码
  EventInputCode: function (e) {
    var value = e.detail.value;
    this.setData({
      Code: value
    })
    CheckResultBtn(this);
  },
  //查看联系方式按钮
  EventResult: function () {
    var input = {
      Authcode: this.data.Code,
      Mobile: this.data.Mobile,
      JobNameId: this.data.JobNameId,
      JobName: this.data.JobName
    }
    promisefy.EnterpriseJobPromise({
      url: 'BindJobMobile',
      method: 'POST',
      data: {
        input: input
      },
    }).then(res => {
      if (res.data.Succeed) {
        wx.showToast({
          title: '验证成功',
          icon: 'success',
          duration: 2000
        })
        wx.redirectTo({
          url: '/page/recruit/recruitInfo/recruitInfo?id=' + Id
        })
      }else{
        wx.showModal({
          title: '提示',
          content: res.data.ErrorMessage,
          showCancel:false
        })
      }
    }).done();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    Id = options.id;
    wx.showLoading({
      title: '加载中',
    })
    //{  获取工种  }
    promisefy.BaseDataPromise({
      url: 'GetJobName',
      method: 'GET'
    }).then(res => {
      wx.hideLoading();
      var hid = wx.getStorageSync('isImLogin') ? true : false;
      var mobile = '';
      var disabled_mobile = false;
      if (hid) {
        promisefy.MemberInfoPromise({   //企业认证
          url: 'Index',
          method: 'POST'
        }).then(data => {
          mobile = data.data.Mobile;
          disabled_mobile = true;
          that.setData({
            array: res.data.Data,
            hid: hid,
            MobileInput: mobile,
            Mobile: mobile,
            disabled_mobile: disabled_mobile
          })
        })
      }else{
        that.setData({
          array: res.data.Data,
          hid: hid
        })
      }
    }).done();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

//倒计时
function countDown(that) {
  var countdown = 60;
  that.setData({
    disabled_code: true
  })
  var Time = setInterval(Run, 1000);//计时器
  function Run() {
    countdown--;
    if (countdown == 0) {
      that.setData({
        disabled_code: false,
        code_txt: '重新获取'
      })
      clearInterval(Time);
    } else {
      that.setData({
        code_txt: '已发送' + countdown + 's'
      })
    }
  }
}

//验证手机号
function CheckMobile(that) {
  var mobile = that.data.Mobile;
  var ismobile = /^1[3|4|5|7|8]\d{9}$/;
  var bool = true;
  if (!ismobile.test(mobile)) {
    bool = false;
    wx.showModal({
      title: '提示',
      content: '请输入正确手机号',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          that.setData({
            MobileInput: ''
          })
        }
      }
    })
  }
  return bool;
}

function CheckResultBtn(that) {
  var bool = true;
  if (that.data.hid) {
    if (that.data.JobNameId != '') {
      bool = false;
    }
  } else {
    if (that.data.JobNameId != '' && that.data.Mobile.length == 11 && that.data.Code.length == 4) {
      bool = false;
    }
  }

  that.setData({
    ResultBtn: bool
  })
}