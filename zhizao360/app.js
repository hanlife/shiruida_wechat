var code = null;

App({
  globalData: {
    userInfo: null,
    //用户信息
    code: code,
    addLog: {},
    rootUrl: 'http://www.im360b2b.com',
    RegisterLocation: '',
    EnterpriseId: '',
    myInformationData: '',
    Id: '',
    shareTitle: {},
    IsMainMember: '',
    EnterpriseNatures: '',
    errorPage:false,
    
    OrdinaryKeyword:'',
    OrdinaryBool:false,
    SupplierKeyword:'',
    SupplierBool:false,
    EnquiryKeyword: '',
    EnquiryBool: false
  },
  onLaunch: function () {
    var _t = this;
    // wx.checkSession({
    //   success: function () {
    //     //session 未过期，并且在本生命周期一直有效
    //   },
    //   fail: function () {
    //     //登录态过期

    //   }
    // })
    //网络连接
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        if (networkType == "none") {
          wx.showModal({
            title: '提示',
            content: '无网络连接，请检查网络！',
            success: function (res) {
            }
          })
        }
      }
    })
    _t.getUserInfo(); //重新登录
    //获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        _t.globalData.addLog.Model = res.model;
        _t.globalData.addLog.Pixelratio = res.pixelRatio;
        _t.globalData.addLog.Windowwidth = res.windowWidth;
        _t.globalData.addLog.Windowheight = res.windowHeight;
        _t.globalData.addLog.Language = res.language;
        _t.globalData.addLog.Version = res.version;
        _t.globalData.addLog.Platform = res.platform;
        _t.globalData.addLog.System = res.system
      }
    })
    //获取网络类型
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        _t.globalData.addLog.Networktype = res.networkType;
      }
    })
    //获取微信名称，微信头像
    wx.getUserInfo({
      success: function (res) {
        _t.globalData.addLog.Iv = res.iv;
        _t.globalData.addLog.EncryptedData = res.encryptedData;
        _t.globalData.addLog.Nickname = res.userInfo.nickName;
        _t.globalData.addLog.City = res.userInfo.city;
        _t.globalData.addLog.Country = res.userInfo.country;
        _t.globalData.addLog.Gender = res.userInfo.gender;
        _t.globalData.addLog.Language = res.userInfo.language;
        _t.globalData.addLog.Province = res.userInfo.province;
        _t.globalData.addLog.Avatarurl = res.userInfo.avatarUrl;
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        setStorage('nickName', nickName);
        setStorage('avatarUrl', avatarUrl);
        setStorage("guide", 'true');
      },
      fail: function () {
        wx.redirectTo({
          url: '/page/error/index',
        })
      }
    })
    //获取当前的地理位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        _t.globalData.addLog.Latitude = res.latitude;
        _t.globalData.addLog.Longitude = res.longitude;
        setStorage("guide", 'true');
      },
      fail: function (res) {
        wx.redirectTo({
          url: '/page/error/index',
        })
      }
    })
    //请求分享数据
    _t.reqGet("BaseData/GetNatures", function (res) {
      _t.globalData.EnterpriseNatures = res;
    })
  },
  //当小程序启动，或从后台进入前台显示
  onShow: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 2000
    })
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (loginres) {
          code = loginres.code;
          setStorage("code", loginres.code);
          var iv, encryptedData;
          wx.getUserInfo({
            success: function (res) {
              iv = res.iv;
              encryptedData = res.encryptedData;
              var userInfo = res.userInfo
              var nickName = userInfo.nickName
              var avatarUrl = userInfo.avatarUrl
              setStorage('nickName', nickName);
              setStorage('avatarUrl', avatarUrl);
              wx.request({
                url: that.globalData.rootUrl + '/wxapi/user/login',
                header: {
                  'X-WX-Code': loginres.code,
                  'X-WX-Encrypted-Data': encryptedData,
                  'X-WX-IV': iv
                },
                success: function (res) {
                  if (res.data.Succeed) {
                    var cookie = res.data.Data.ASPXAUTH.Name + "=" + res.data.Data.ASPXAUTH.Value + ";" + res.data.Data.NET_SessionId.Name + "=" + res.data.Data.NET_SessionId.Value;
                    setStorage("cookie", cookie);
                    setStorage("rd_session", res.data.Data.rd_session);
                    setStorage("IsWxBind", res.data.Data.IsWxBind); //手机号是否绑定
                    setStorage("IsWxLogin", res.data.Data.IsWxLogin); //code换session_key是否成功
                    setStorage("isImLogin", res.data.Data.isImLogin); //平台是否登录成功
                    cb && cb(res.data);
                  }
                },
                fail: function () { },
                complete: function(){
                  wx.hideToast();
                  wx.stopPullDownRefresh();
                }
              })
            },
            fail: function () {
             
            }
          })
        }
      })
    }
  },
  //Get数据请求
  reqGet: function (url, cb, data, header) {
    var _t = this;
    var rootDocment = this.globalData.rootUrl + '/wxapi/';//你的域名
    wx.request({
      url: rootDocment + url,
      data: data || {},
      method: "get",
      header: header || { 'content-type': 'application/json', 'X-WX-Code': code },
      success: function (res) {
        if (res.data.isImLogin != undefined && !res.data.isImLogin) {
          wx.redirectTo({
            url: '/page/member/login',
          })
        }
        else {
          return typeof cb == "function" && cb(res.data);
        }
      },
      fail: function (res) {
        return typeof cb == "function" && cb(false)
      }
    })
  },
  //Post数据请求
  reqPost: function (url, cb, data, header) {
    var _t = this;
    var rootDocment = this.globalData.rootUrl + '/wxapi/';//你的域名
    wx.request({
      url: rootDocment + url,
      data: data || {},
      method: "post",
      header: header || { 'content-type': 'application/json', 'X-WX-Code': code },
      success: function (res) {
        if (res.data.isImLogin != undefined && !res.data.isImLogin) {
          wx.redirectTo({
            url: '/page/member/login',
          })
        }
        else {
          return typeof cb == "function" && cb(res.data);
        }
      },
      fail: function (res) {
        return typeof cb == "function" && cb(false)
      }
    })
  },
  GetAddress: function (address) {
    var provincesIndex = address.indexOf("省");
    var obj = {
      province: '',
      city: ''
    };
    if (provincesIndex > 0) {
      obj.province = address.substring(0, provincesIndex + 1);
      address = address.substring(provincesIndex + 1);
    }
    var cityIndex = address.indexOf("市");
    if (cityIndex > 0) {
      obj.city = address.substring(0, cityIndex + 1);
    }
    return obj
  }
});

function setStorage(key, val) {
  wx.setStorageSync(key, val);
}