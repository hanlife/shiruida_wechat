var app = getApp(); //获取全局对象
var rootUrl = app.globalData.rootUrl + '/wxapi/';
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
Promise.prototype.done = function (onFulfilled, onRejected) {
  this.then(onFulfilled, onRejected)
    .catch(function (reason) {
      // 抛出一个全局错误
      setTimeout(() => { throw reason }, 0);
    });
};

function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        //成功
        resolve(res)
      }
      obj.fail = function (res) {
        //失败
        reject(res)
      }
      fn(obj)
    })
  }
}

function wxRequest({ url = '', method = 'GET', data = {}, header = { 'content-type': 'application/json' }} = {}) {
  let wxRequest = wxPromisify(wx.request);
  return wxRequest({
    url: url,
    method: method,
    data: data,
    header: header
  })
}

function requestPromise(obj = {}) {
  var cookie = wx.getStorageSync('cookie');
  var code = wx.getStorageSync('code');
  var rd_session = wx.getStorageSync('rd_session');
  obj.header = {
    cookie: cookie,
    'X-WX-Code': code,
    rd_session: rd_session
  }
  return wxRequest(obj)
}

function MemberInfoPromise(obj) {
  obj.url = rootUrl + 'MemberInfo/' + obj.url;
  return requestPromise(obj);
}

function EnterprisePromise(obj) {
  obj.url = rootUrl + 'Enterprise/' + obj.url;
  return requestPromise(obj);
}

function BaseDataPromise(obj) {
  obj.url = rootUrl + 'BaseData/' + obj.url;
  return requestPromise(obj);
}

function UserPromise(obj) {
  obj.url = rootUrl + 'User/' + obj.url;
  return requestPromise(obj);
}

function DevicePromise(obj) {
  obj.url = rootUrl + 'Device/' + obj.url;
  return requestPromise(obj);
}
function EnterpriseImagePromise(obj) {
  obj.url = rootUrl + 'EnterpriseImage/' + obj.url;
  return requestPromise(obj);
}

module.exports = {
  wxRequest: wxRequest,
  requestPromise: requestPromise,
  MemberInfoPromise: MemberInfoPromise,
  EnterprisePromise: EnterprisePromise,
  BaseDataPromise: BaseDataPromise,
  UserPromise: UserPromise,
  DevicePromise: DevicePromise,
  EnterpriseImagePromise: EnterpriseImagePromise,
}