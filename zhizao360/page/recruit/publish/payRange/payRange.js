// page/recruit/publish/payRange/payRange.js
var promisefy = require('../../../../utils/promise.js');
var app = getApp();
var objPay = {};
var payArray = [];
let cachediyStart ='';
let cachediyEnd ='';
Page({
  data: {
    array: [],
    diyStart: '',
    diyEnd: '',
    payArray: [],
    payIndex: 0,
    diyPayFlag: false,
    diyPayName: '',
    diyPayId: ''
  },
  onLoad: function (options) {
    promisefy.BaseDataPromise({
      url: 'GetMoeny',
      method: 'GET'
    }).then(res => {
      payArray[0] = true;
      this.setData({
        array: res.data.Data,
        payArray: payArray,
        diyPayName: res.data.Data[0].Name,
        diyPayId: res.data.Data[0].Id
      })
    })
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  //{  自定义起始输入框  }
  diyStartFuc: function (e) {
    if(e.detail.value == '-' || e.detail.value == '+' || e.detail.value == '/' || e.detail.value == '*' ){
      e.detail.value = "";
    }
    let val = e.detail.value <0 ? 0 : e.detail.value  ;
    let maxVal = cachediyEnd ? parseFloat(cachediyEnd) : 0;
    
    // this.setData({ diyStart: val })
    cachediyStart = val;
    if( cachediyStart.indexOf(".") != -1 ){
     let strArr =  cachediyStart.split('.');
      if(strArr[1].length > 1){
        cachediyStart = strArr[0] + '.' + strArr[1].substring(0,1);
        this.setData({ diyStart: cachediyStart })
      }
    }
    if (cachediyStart >= maxVal) {
      maxVal = cachediyStart
      this.setData({ diyEnd: maxVal })
      cachediyEnd = maxVal;
    }
  },
  //{  结束输入框  }
  diyEndFuc: function (e) {
    let val = e.detail.value < 0 ? 0 : e.detail.value;
    let minVal = cachediyStart ? parseFloat(cachediyStart) : 0;
   
    this.setData({ diyEnd: val })
    cachediyEnd = val;
    if( cachediyEnd.indexOf(".") != -1 ){
       let strArr =  cachediyEnd.split('.');
      if(strArr[1].length > 1){
        cachediyEnd = strArr[0] + '.' + strArr[1].substring(0,1);
        this.setData({ diyEnd: cachediyEnd })
      }
    }
     if (cachediyEnd < minVal) {
      minVal = cachediyEnd
      this.setData({ diyStart: minVal })
      cachediyStart = minVal
    }
  },
  //{  自定义薪资范围  }
  chooseDiyPay: function () {
    this.setData({
      diyPayFlag: !this.data.diyPayFlag,
      payArray: []
    })
  },
  //{  选择薪资  }
  choosePay: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    for (let i = 0; i < payArray.length; i++) {
      payArray[i] = false;
    }
    payArray[index] = true
    this.setData({
      payArray: payArray,
      payIndex: index,
      diyPayName: name,
      diyPayId: id,
      diyPayFlag: false
    })

  },
  //{  确定薪资  }
  confirmPay: function () {
    let SalaryObj = {};
    if (!this.data.diyPayFlag && !this.data.diyPayName) {
      wx.showModal({
        title: '提示',
        content: '请选择薪资范围',
        cancelText: '知道了',
        showCancel: false,
        success: function (res) {
        }
      })
      return;
    }
    if (this.data.diyPayFlag) {
      if (!cachediyEnd) {
        wx.showModal({
          title: '提示',
          content: '请填写自定义薪资',
          cancelText: '知道了',
          showCancel: false,
          success: function (res) {
          }
        })
        return;
      }
      cachediyStart ? cachediyStart : 0;
      SalaryObj = { name: parseFloat(cachediyStart)  + "K-" + parseFloat(cachediyEnd)  + "K/月" }
    } else {
      SalaryObj = {
        name: this.data.diyPayName,
        id: this.data.diyPayId
      }
    }
    let arr = ['-', '<', '＜', '≤', '>', '＞', '≥'];
    let symbol = '';
    let nameArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (SalaryObj.name.indexOf(arr[i]) > -1) {
        symbol = arr[i];
        nameArr = SalaryObj.name.split(arr[i]);
        break;
      }
    }
    let SalaryMin = nameArr[0] ? nameArr[0].replace(/[^0-9] | [^\.]/ig, "") : '';
    let SalaryMax = nameArr[1] ? nameArr[1].replace(/[^0-9] | [^\.]/ig, "") : '';

     if( symbol == arr[4] || symbol == arr[5] || symbol == arr[6] ){
         SalaryMin = SalaryMax;
         SalaryMax = '';
       }
    SalaryMin = SalaryMin ? parseFloat(SalaryMin) : '';
    SalaryMax = SalaryMax ? parseFloat(SalaryMax) : '';

     if( SalaryMin && SalaryMax &&  SalaryMin ==  SalaryMax){
       SalaryObj.name = SalaryMin + "k/月"
     }
   
    SalaryObj.SalaryMin = SalaryMin;
    SalaryObj.SalaryMax = SalaryMax;

    app.globalData.SalaryObj = SalaryObj;
    app.globalData.SalaryObjFlag = true;
    let webpage = getCurrentPages()
    wx.navigateBack({ delta: webpage[webpage.length - 2] })
  }
})