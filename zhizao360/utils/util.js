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
var rootUrl = 'http://www.im360b2b.com/wxapi/';
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
    header:obj.header ||  {
      cookie: cookie,
      'X-WX-Code':code,
      rd_session: rd_session
    },
    success: function (res) {
      typeof obj.callback == 'function' && obj.callback(res);
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

// MemberInfo/
function MemberInfoRequest(obj) {
  obj.url = rootUrl + 'MemberInfo/' + obj.url;
  request(obj);
}

module.exports = {
  formatTime: formatTime,
  formatLocation: formatLocation,

  request: request,
  BaseDataRequest: BaseDataRequest,
  DeviceRequest: DeviceRequest,
  UserRequest: UserRequest,
  EnterpriseRequest: EnterpriseRequest,
  MemberInfoRequest: MemberInfoRequest
}