var app = getApp(); //获取全局对象
var rootUrl = app.globalData.rootUrl;
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
        if (res.data.isImLogin != undefined && !res.data.isImLogin) {
         wx.redirectTo({
           url: '/page/member/login',
         })
        }
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
  obj.url = rootUrl + '/wxapi/MemberInfo/' + obj.url;
  return requestPromise(obj);
}

function EnterprisePromise(obj) {
  obj.url = rootUrl + '/wxapi/Enterprise/' + obj.url;
  return requestPromise(obj);
}

function BaseDataPromise(obj) {
  obj.url = rootUrl + '/wxapi/BaseData/' + obj.url;
  return requestPromise(obj);
}

function UserPromise(obj) {
  obj.url = rootUrl + '/wxapi/User/' + obj.url;
  return requestPromise(obj);
}

function DevicePromise(obj) {
  obj.url = rootUrl + '/wxapi/Device/' + obj.url;
  return requestPromise(obj);
}

function EnterpriseImagePromise(obj) {
  obj.url = rootUrl + '/wxapi/EnterpriseImage/' + obj.url;
  return requestPromise(obj);
}

function EnterpriseJobPromise(obj) {
  obj.url = rootUrl + '/wxapi/EnterpriseJob/' + obj.url;
  return requestPromise(obj);
}

var urlAPI = {
  //{  获取工种信息  }
  GetJobName: { url: 'WXApi/BaseData/GetJobName', method: 'GET' },
  //{  获取薪资要求列表  }
  GetMoeny: { url: 'WXApi/BaseData/GetMoeny', method: 'GET' },
  //{  发布职位  }
  AddJob: { url: 'WXApi/EnterpriseJob/AddJob', method: 'POST' },
  //{  刷新职位停止招聘  }
  RefreshJob: { url: 'WXApi/EnterpriseJob/RefreshJob', method: 'GET' },
  //{  删除职位  }
  DelJob: { url: 'WXApi/EnterpriseJob/RefreshJob', method: 'GET' },
  //{  修改职位  }
  UpdateJob: { url: 'WXApi/EnterpriseJob/RefreshJob', method: 'GET' },
  //{  招聘页面列表  }
  GetJobList: { url: 'WXApi/EnterpriseJob/GetjobList', method: 'GET' },
  //{  对应公司的发布的招聘信息  }
  GetEnterpriseJob: { url: 'WXApi/EnterpriseJob/GetEnterpriseJob', method: 'GET' },
  //{  招聘详情  }
  GetJobDetail: { url: 'WXApi/EnterpriseJob/GetJobDetail', method: 'GET' },
  //{  校验是否绑定手机工种信息  }
  CheckJobMobile: { url: 'WXApi/EnterpriseJob/CheckJobMobile', method: 'GET' },
  //{  绑定手机工种信息  }
  CheckJobMobile: { url: 'WXApi/EnterpriseJob/CheckJobMobile', method: 'GET' },
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
  EnterpriseJobPromise: EnterpriseJobPromise
}