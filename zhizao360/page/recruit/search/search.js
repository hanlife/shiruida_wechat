// page/recruit/search/search.js
var app = getApp();
let  RecruitKeyWord ="";
Page({
  data: {
     placeholder:"搜索公司名称、工种",
     ClearShow: false,
     searchVal:'',
     searchShow: false
  },
  onLoad: function (options) {},
  onShow: function () {
    if (app.globalData.RecruitKeyWord && app.globalData.RecruitKeyWord.length) {
      this.setData({
        searchVal: app.globalData.RecruitKeyWord[0],
        ClearShow: true
      })
    }
    app.globalData.recruitGo = true;
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onReachBottom: function () {},
  onPullDownRefresh: function () {},
  //{  点击取消  }
  NavToRecruit:function(){
    let a =  getCurrentPages()
    wx.navigateBack({ delta: a[a.length-2] })
  },
  //{  输入搜索内容  }
  importFuc:function(e){
    RecruitKeyWord = e.detail.value
    if(e.detail.value){ 
      this.setData({  ClearShow: true, searchShow: true })
      return;
    }
     this.setData({ ClearShow: false, searchShow: false })
  },
  ConfirmFuc:function(){
    
    app.globalData.RecruitKeyWord = [RecruitKeyWord] 
    let a =  getCurrentPages()
    wx.navigateBack({ delta: a[a.length-2] })
  },
  //{  清空搜索内容  }
  ClearTxt: function(){
    this.setData({ 
      ClearShow: false,
      searchVal : ''
    })
  }
})