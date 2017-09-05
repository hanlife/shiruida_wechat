var app = require('../app.js');
var appInstance = getApp(); //获取全局对象

function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

var rootUrl = appInstance.globalData.rootUrl + '/wxapi/';
function request(obj) {
  // var  obj = {         参数格式
  //     url:obj.url ,
  //     method:obj.method,
  //     data:obj.data,
  //     callback:obj.callback
  // } 
  var cookie = wx.getStorageSync('cookie');
  var code = wx.getStorageSync('code');
  var rd_session = wx.getStorageSync('rd_session');
  wx.request({
    url: obj.url,
    method: obj.method || 'GET',
    data: obj.data || {},
    header: obj.header || {
      cookie: cookie,
      'X-WX-Code': code,
      rd_session: rd_session
    },
    success: function (res) {
      if (res.statusCode != 200) {
        wx.showModal({
          title: '提示',
          content: '异常错误，点击确认返回首页',
          showCancel: false,
          success: function () {
            wx.switchTab({
              url: '/page/supplier/supplier',
            })
          }
        })
      }
      if (res.data.isImLogin != undefined && !res.data.isImLogin) {
        wx.redirectTo({
          url: '/page/member/login',
        })
      }
      else {
        typeof obj.callback == 'function' && obj.callback(res);
      }
    },
    fail: function (error) {
      wx.showToast({
        title: '异常错误',
        icon: 'loading'
      })
    }
  })
}

// BaseData/ 基础数据
function BaseDataRequest(obj) {
  obj.url = rootUrl + 'BaseData/' + obj.url;
  request(obj)
}

// Device/
function DeviceRequest(obj) {
  obj.url = rootUrl + 'Device/' + obj.url;
  request(obj)
}

// User/
function UserRequest(obj) {
  obj.url = rootUrl + 'User/' + obj.url;
  request(obj);
}

// Enterprise/
function EnterpriseRequest(obj) {
  obj.url = rootUrl + 'Enterprise/' + obj.url;
  request(obj);
}

// EnterpriseImage/
function EnterpriseImageRequest(obj) {
  obj.url = rootUrl + 'EnterpriseImage/' + obj.url;
  request(obj);
}

// MemberInfo/
function MemberInfoRequest(obj) {
  obj.url = rootUrl + 'MemberInfo/' + obj.url;
  request(obj);
}

// Enquiry/
function EnquiryRequest(obj) {
  obj.url = rootUrl + 'Enquiry/' + obj.url;
  request(obj);
}

//循环保留距离一位小数。循环取主营行业。循环判断是否有工厂图片
function distanc(data, header) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].Distance != 0) {
      data[i].Distance = parseFloat(data[i].Distance).toFixed(1);
    }
    //闲置数量
    if (header.pageId == 1) {
      for (var j = 0; j < data[i].Devices.length; j++) {
        if (data[i].Devices[j].Amount > 999) {
          data[i].Devices[j].Amount = "999+"
        }
        if (data[i].Devices[j].NotBusyQty > 999) {
          data[i].Devices[j].NotBusyQty = "999+"
        }
        if (DataTime(data[i].Devices[j].NotBusyQtyUpdateTime)) {
          data[i].Devices.splice(j, 1);     //删除发布超过三天
        }
      }
      if (data[i].Devices.length == 0) {
        data.splice(i, 1);  //删除没有限制产能
      }
    }
    if (header.pageId == 2) {
      //主营行业
      if (data[i].MainIndesutry != null) {
        //根据二级行业ID找一级二级行业名称
        for (var j = 0; j < header.MainIndustryArray.length; j++) {
          for (var k = 0; k < header.MainIndustryArray[j].SubIndustries.length; k++) {
            if (data[i].MainIndesutry == header.MainIndustryArray[j].SubIndustries[k].Id) {
              data[i].MainIndesutry = header.MainIndustryArray[j].Name + ">" + header.MainIndustryArray[j].SubIndustries[k].Name;
            }
          }
        }
      }
      //企业工厂图片
      if (data[i].FactoryCover == '') {
        data[i].FactoryCover = '../../icon/supplier-img.png';
      } else {
        data[i].FactoryCover = appInstance.globalData.rootUrl + data[i].FactoryCover;
      }
    }
  }
  return data;
}

function DataTime(UpdateTime) {
  var EndTime = 3 * 24 * 60 * 60 * 1000;//3天
  var nowTime = new Date();
  var Seconds = nowTime.getTime();
  var time = UpdateTime.replace("/Date(", "").replace(")/", "");
  if ((Seconds - time) > EndTime) {
    return true;
  } else {
    return false;
  }
}

function TipModel(content) {
  wx.showModal({
    title: '提示',
    content: content,
    showCancel: false,
  })
}

function ChangeDateFormat(cellval) {
  var date = new Date(parseInt(cellval.replace("/Date(", "").replace(")/", ""), 10));
  var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return date.getFullYear() + "-" + month + "-" + currentDate;
}

function fmt() {
  /**      
   * 对Date的扩展，将 Date 转化为指定格式的String      
   * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符      
   * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)      
   * eg:      
   * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423      
   * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
   * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
   * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
   * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18      
   */
  Date.prototype.pattern = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1, //月份          
      "d+": this.getDate(), //日          
      "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时          
      "H+": this.getHours(), //小时          
      "m+": this.getMinutes(), //分          
      "s+": this.getSeconds(), //秒          
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度          
      "S": this.getMilliseconds() //毫秒          
    };
    var week = {
      "0": "/u65e5",
      "1": "/u4e00",
      "2": "/u4e8c",
      "3": "/u4e09",
      "4": "/u56db",
      "5": "/u4e94",
      "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }
  // result = (eval(value.replace(/ \/Date\ ( ( \ d+) \ ) \ / / gi, "new Date($1)"))).pattern("yyyy-M-d");
}

//获取两个经纬度的距离
function getFlatternDistance(lat1, lng1, lat2, lng2) {
  if (lat1 == lat2 && lng1 == lng2){
    return 0;
  }
  var EARTH_RADIUS = 6378137.0;    //单位M
  var PI = Math.PI;
  function getRad(d) {
    return d * PI / 180.0;
  }
  var f = getRad((lat1 + lat2) / 2);
  var g = getRad((lat1 - lat2) / 2);
  var l = getRad((lng1 - lng2) / 2);

  var sg = Math.sin(g);
  var sl = Math.sin(l);
  var sf = Math.sin(f);

  var s, c, w, r, d, h1, h2;
  var a = EARTH_RADIUS;
  var fl = 1 / 298.257;

  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;

  s = sg * (1 - sl) + (1 - sf) * sl;
  c = (1 - sg) * (1 - sl) + sf * sl;

  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  d = 2 * w * a;
  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;

  return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
}

function Time(time, Seconds, Hours) {
  var EndTime = parseFloat(Hours) * 60 * 60 * 1000;
  var ShortTime = EndTime - (Seconds - time)
  if (ShortTime <= 0) {
    return false;
  }
  var leftSec = ShortTime / 1000;
  var H = Math.floor(leftSec / 3600);
  var M = Math.floor((leftSec - (H * 3600)) / 60);
  var S = Math.floor(leftSec - (H * 3600) - (M * 60));
  if (H < 10) {
    H = "0" + H;
  }
  if (M < 10) {
    M = "0" + M;
  }
  if (S < 10) {
    S = "0" + S;
  }
  return (H + ":" + M + ":" + S)
}

module.exports = {
  formatTime: formatTime,
  formatLocation: formatLocation,

  request: request,
  BaseDataRequest: BaseDataRequest,
  DeviceRequest: DeviceRequest,
  UserRequest: UserRequest,
  EnterpriseRequest: EnterpriseRequest,
  MemberInfoRequest: MemberInfoRequest,
  EnquiryRequest: EnquiryRequest,
  EnterpriseImageRequest: EnterpriseImageRequest,
  distanc: distanc,
  TipModel: TipModel,
  ChangeDateFormat: ChangeDateFormat,
  fmt: fmt,
  getFlatternDistance: getFlatternDistance,
  Time: Time
}