// page/recruit/publish/publish.js
var promisefy = require('../../../utils/promise.js');
var utils = require('../../../utils/util.js');
var app = getApp();
var starInterval = null;
var endInterval = null;
var Hours = 24;
var EnabledTime = '';
var EnabledTime_end = '';


var JobRequest = {
  //onload函数
  onloadFn: function (that, bool) {  // bool true：初次进入页面，false：操作刷新数据
    var activeFlag = that.data.activeFlag;
    JobRequest.getJobList(function (data) {
      if (!data.starData.length && data.endData.length > 0) {
        activeFlag = false;
      };
      if (data.starData.length > 0 && !data.endData.length) {
        activeFlag = true;
      };
      // if (!data.starData.length && !data.endData.length){
      //   wx.redirectTo({
      //     url: '/page/recruit/publish/publish',
      //   })
      // }
      if (bool) {
        that.setData({
          startArray: data.starData,
          endArray: data.endData,
          activeFlag: activeFlag,
          chooseStartList: data.checkStar,    //CheckBox集合
          chooseEndList: data.checkEnd,  //CheckBox集合
        })
      } else {
        JobRequest.temp.StartTotal = 0;
        JobRequest.temp.EndTotal = 0;
        that.setData({
          startArray: data.starData,
          endArray: data.endData,
          activeFlag: activeFlag,
          chooseStartList: data.checkStar,    //CheckBox集合
          chooseEndList: data.checkEnd,  //CheckBox集合
          StarBtn: false,   //按钮控制
          StarBtnReferch:false,
          StarRefershTxt:'更新',
          EndBtn: false,
          EndBtnReferch: false,
          EndRefershTxt:'更新',
          allStarFlag: false,    //全选是否勾选
          allEndFlag: false
        })
      }
    });
  },
  //获取企业招聘列表
  getJobList: function (callback) {
    promisefy.MemberInfoPromise({   //基础资料
      url: 'Index',
      method: 'POST'
    }).then(res => {
      promisefy.EnterpriseJobPromise({
        url: 'GetEnterpriseJob?enterpriseId=' + res.data.EnterpriseId,
        method: 'GET'
      }).then(res => {
        var dataList = this.checkJobList(res.data.Data);
        callback(dataList);
      })
    }).done();
  },
  //更新+停止
  RefreshJob: function (objData, cb) {
    wx.showLoading({
      title: '请求中',
    })
    //停止
    promisefy.EnterpriseJobPromise({   //基础资料
      url: 'RefreshJob',
      method: 'POST',
      data: { input: objData }
    }).then(res => {
      wx.hideLoading();
      cb(res);
    }).done();
  },
  //删除职位
  DeteleJob: function (objData, cb) {
    wx.showLoading({
      title: '删除中',
    })
    //停止
    promisefy.EnterpriseJobPromise({   //基础资料
      url: 'DelJob',
      method: 'POST',
      data: { Ids: objData }
    }).then(res => {
      wx.hideLoading();
      cb(res);
    }).done();
  },
  //检查职位状态
  checkJobList: function (data) {
    var obj = {
      starData: [],
      endData: [],
      checkStar: [],
      checkEnd: []
    }
    for (var i = 0; i < data.length; i++) {
      data[i].freshTime = this.checkFresh(data[i].LastUpdateTime); //增加freshTime判断是否能更新
      if (!data[i].IsProcessing) {
        if (data[i].StateDes != "审核通过") {
          data[i].LastUpdateTimeDes = data[i].StateDes;
        }
        obj.endData.push(data[i]);
        obj.checkEnd.push({ id: 0, time: 0, checked: false })
      } else {
        if (data[i].StateDes != "审核通过") {
          data[i].LastUpdateTimeDes = data[i].StateDes;
        }
        obj.starData.push(data[i]);
        obj.checkStar.push({ id: 0, time: 0, checked: false })
      }
    }
    return obj;
  },
  //判断是否能更新
  checkFresh: time => {
    var day = 24 * 60 * 60 * 1000;
    var nowDate = new Date().getTime();
    var date = time.replace("/Date(", "").replace(")/", "");
    if (nowDate - date < day) {
      return date
    } else {
      return 0;
    }
  },
  //获取选中职位的ID集合
  getData: function (bool, that) {
    var arr = {
      Ids: [],
      Stoped: bool
    };
    var list = that.data.activeFlag ? that.data.chooseStartList : that.data.chooseEndList;
    for (var i = 0; i < list.length; i++) {
      if (list[i].checked) {
        arr.Ids.push(list[i].id);
      }
    }
    return arr;
  },
  //判断底部EventStop按钮
  checkBtn: (that) => {
    if (that.data.activeFlag) {
      if (!that.data.StarBtn) {
        return false
      }
    } else {
      if (!that.data.EndBtn) {
        return false
      }
    }
    return true;
  },
  //判断底部EventRefresh按钮
  checkRefreshBtn: (that) => {
    if (that.data.activeFlag) {
      if (!that.data.StarBtnReferch) {
        return false
      }
    } else {
      if (!that.data.EndBtnReferch) {
        return false
      }
    }
    return true;
  },
  //正在招聘倒计时显示
  Countdown: function (time, that) {
    var nowTime = new Date();
    var Seconds = nowTime.getTime();
    clearInterval(starInterval);
    starInterval = setInterval(function () {
      time = time - 1000;
      if (time <= 0) {
        clearInterval(starInterval);
        that.setData({
          StarRefershTxt: '更新',
          StarBtnReferch: true
        })
      }
      EnabledTime = utils.Time(time, Seconds, Hours);
      if (!EnabledTime) {
        clearInterval(starInterval)
        that.setData({
          StarRefershTxt: '更新',
          StarBtnReferch: true
        })
      } else {
        that.setData({
          StarRefershTxt: EnabledTime,
          StarBtnReferch: false
        })
      }
    }, 1000)
  },
  //停止招聘倒计时显示
  CountdownEnd: function (time, that) {
    var nowTime = new Date();
    var Seconds = nowTime.getTime();
    clearInterval(endInterval);
    endInterval = setInterval(function () {
      time = time - 1000;
      if (time <= 0) {
        clearInterval(endInterval);
        that.setData({
          EndRefershTxt: '更新',
          EndBtnReferch: true
        })
      }
      EnabledTime_end = utils.Time(time, Seconds, Hours);
      if (!EnabledTime_end) {
        clearInterval(endInterval)
        that.setData({
          EndRefershTxt: '更新',
          EndBtnReferch: true
        })
      } else {
        that.setData({
          EndRefershTxt: EnabledTime_end,
          EndBtnReferch: false
        })
      }
    }, 1000)
  },
  //全选与不选
  checkAll: function (bool, that) {
    if (that.activeFlag) {
      var arry = that.startArray;
      var checkList = that.chooseStartList;
    } else {
      var arry = that.endArray;
      var checkList = that.chooseEndList;
    }
    for (var i = 0; i < that.arry.length; i++) {
      checkList[i].checked = bool;
    }
    return checkList;
  },
  //勾选判断
  checkStude: function (arr) {
    var time = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].checked) {
        if (arr[i].time == 0) {
          time = 0;
          break;
        } else {
          time = time == 0 ? arr[i].time : time;
          if (time > arr[i].time) {
            time = arr[i].time;
          }
        }
      }
    }
    return time;
  },
  //存储招聘选中ID
  EndDataId: [],
  //判断全选反选
  temp: {
    StartTotal: 0,
    EndTotal: 0
  },
  //请求后提示
  TipFn: (res, tipText) => {
    if (res.data.Succeed) {
      wx.showToast({
        title: tipText,
        icon: 'success',
        duration: 2000
      })
    } else {
      wx.showModal({
        title: '提示',
        content: res.data.ErrorMessage,
        showCancel: false
      })
    }
  }
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeFlag: true,  //当前显示的信息栏  true为正在招聘
    startArray: [],     //正在招聘列表
    endArray: [],       //停止招聘
    chooseStartList: [],    //CheckBox集合
    chooseEndList: [],  //CheckBox集合
    StarBtn: false,   //按钮控制
    StarBtnReferch: false,
    EndBtn: false,
    EndBtnReferch: false,
    allStarFlag: false,    //全选是否勾选
    allEndFlag: false,
    StarRefershTxt: '更新',
    EndRefershTxt: '更新'
  },
  //更新职位
  EventRefresh: function () {
    if (!JobRequest.checkRefreshBtn(this)) {
      return false;
    }
    var that = this;
    var activeFlag = this.data.activeFlag;
    var objData = JobRequest.getData(false, this);

    wx.showModal({
      title: '确认',
      content: '确定更新所选职位',
      success: function (res) {
        if (res.confirm) {
          JobRequest.RefreshJob(objData, function (res) {
            JobRequest.onloadFn(that, false);  //刷新数据
            JobRequest.TipFn(res, '更新成功');
          })
        }
      }
    })
  },
  //停止招聘
  EventStop: function () {
    if (!JobRequest.checkBtn(this)) {
      return false;
    }
    var that = this;
    if (this.data.activeFlag) {
      var objData = JobRequest.getData(true, this);
      wx.showModal({
        title: '确认',
        content: '确定停止所选招聘信息',
        success: function (res) {
          if (res.confirm) {
            JobRequest.RefreshJob(objData, function (res) {
              clearInterval(starInterval);
              JobRequest.onloadFn(that, false);  //刷新数据
              JobRequest.TipFn(res, '操作成功');
            })
          }
        }
      })
    } else {
      //删除
      var arr = [];
      var data = that.data.chooseEndList;
      for (var i = 0; i < data.length; i++) {
        if (data[i].checked) {
          arr.push(data[i].id);
        }
      }
      wx.showModal({
        title: '确认',
        content: '确定删除所选招聘信息',
        success: function (res) {
          if (res.confirm) {
            JobRequest.DeteleJob(arr, (res) => {
              clearInterval(endInterval);
              JobRequest.onloadFn(that, false);  //刷新数据
              JobRequest.TipFn(res, '删除成功');
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    JobRequest.onloadFn(this, true);
    
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
    app.globalData.recruitGo = false;
    if(app.globalData.publishToRecruitDetail){ //如果是发布页面发布后返回 则刷新数据
      JobRequest.onloadFn(this, true);
    }
  },

  //{  切换信息栏  }
  switchFuc: function (e) {
    if (e.currentTarget.dataset.tab == 0) {
      this.setData({ activeFlag: true });
      return;
    }
    if (e.currentTarget.dataset.tab == 1) {
      this.setData({ activeFlag: false });
      return;
    }
  },
  //{  添加招聘信息  }
  addRecuitInfoFuc: function () {
    wx.navigateTo({ url: '/page/recruit/publish/publish' });
  },
  //{  查看详情页  }
  NavToDetail: function (e) {
    wx.navigateTo({ url: '/page/recruit/publish/publish?id=' + e.currentTarget.dataset.id });
  },
  //{  勾选正在招聘信息  }
  chooseStartInfo: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var time = e.currentTarget.dataset.time;
    var arr = this.data.chooseStartList;

    if (arr[index].checked) {
      arr[index] = { id: id, time: time, checked: false };
      JobRequest.temp.StartTotal--;
    } else {
      arr[index] = { id: id, time: time, checked: true };
      JobRequest.temp.StartTotal++;
    }
    var allFlag = JobRequest.temp.StartTotal == arr.length ? true : false;
    var disable = JobRequest.temp.StartTotal > 0 ? true : false;

    var minTime = JobRequest.checkStude(arr);
    if (minTime != 0) {
      var StarRefershTxt = JobRequest.Countdown(minTime, this);
      this.setData({
        chooseStartList: arr,
        allStarFlag: allFlag,
        StarBtn: disable
      })
    } else {
      clearInterval(starInterval);
      this.setData({
        chooseStartList: arr,
        allStarFlag: allFlag,
        StarBtn: disable,
        StarRefershTxt: '更新',
        StarBtnReferch: disable
      })
    }

  },
  //{  勾选停止招聘信息  }
  chooseEndInfo: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var time = e.currentTarget.dataset.time;
    var arr = this.data.chooseEndList;

    if (arr[index].checked) {
      arr[index] = { id: id, time: time, checked: false };
      JobRequest.temp.EndTotal--;
    } else {
      arr[index] = { id: id, time: time, checked: true };
      JobRequest.temp.EndTotal++;
    }
    var allFlag = JobRequest.temp.EndTotal == arr.length ? true : false;
    var disable = JobRequest.temp.EndTotal > 0 ? true : false;

    var minTime = JobRequest.checkStude(arr);
    if (minTime != 0) {
      var StarRefershTxt = JobRequest.CountdownEnd(minTime, this);
      this.setData({
        chooseEndList: arr,
        allEndFlag: allFlag,
        EndBtn: disable,
      })
    } else {
      clearInterval(endInterval);
      this.setData({
        chooseEndList: arr,
        allEndFlag: allFlag,
        EndBtn: disable,
        EndRefershTxt: '更新',
        EndBtnReferch: disable
      })
    }
  },
  //{  点击全选  }
  allBtnFuc: function () {
    var starList = this.data.startArray;
    var endList = this.data.endArray;
    if (this.data.activeFlag) {
      var bool = this.data.allStarFlag;
      var chooseStartList = this.data.chooseStartList;
      if (chooseStartList.length == 0) {
        return
      }
      for (var i = 0; i < starList.length; i++) {
        chooseStartList[i].checked = !bool;
        chooseStartList[i].time = starList[i].freshTime;
        chooseStartList[i].id = bool ? 0 : starList[i].Id;
      }
      bool ? JobRequest.temp.StartTotal = 0 : JobRequest.temp.StartTotal = starList.length;

      var minTime = JobRequest.checkStude(chooseStartList);
      if (minTime != 0) {
         JobRequest.Countdown(minTime, this);
        this.setData({
          chooseStartList: chooseStartList,
          allStarFlag: !bool,
          StarBtn: !bool,
        })
      } else {
        clearInterval(starInterval);
        this.setData({
          chooseStartList: chooseStartList,
          allStarFlag: !bool,
          StarBtn: !bool,
          StarRefershTxt: '更新',
          StarBtnReferch: !bool
        })
      }
    } else {
      var bool = this.data.allEndFlag;
      var chooseEndList = this.data.chooseEndList;
      if (chooseEndList.length == 0) {
        return
      }
      for (var i = 0; i < endList.length; i++) {
        chooseEndList[i].checked = !bool;
        chooseEndList[i].time = endList[i].freshTime;
        chooseEndList[i].id = bool ? 0 : endList[i].Id;
      }
      bool ? JobRequest.temp.EndTotal = 0 : JobRequest.temp.EndTotal = endList.length;

      var minTime = JobRequest.checkStude(chooseEndList);
      if (minTime != 0) {
        JobRequest.CountdownEnd(minTime, this);
        this.setData({
          chooseEndList: chooseEndList,
          allEndFlag: !bool,
          EndBtn: !bool,
        })
      } else {
        clearInterval(endInterval);
        this.setData({
          chooseEndList: chooseEndList,
          allEndFlag: !bool,
          EndBtn: !bool,
          EndRefershTxt: '更新',
          EndBtnReferch: !bool
        })
      }

    }
  }
})