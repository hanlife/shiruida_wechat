// page/home/body/body.js
Page({
  data:{
    nickName:"",  //微信名称
    avatarUrl:"", //微信头像Url
    pickerArray:["采购商","供应商"],
    pickerIndex:0,   
    equipmentUrlFlag:true   //判断是否有添加设备信息  有则跳转设备信息页面  没则添砖添加设备页面
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
     wx.getUserInfo({    
        success: function(res) {
          console.log(res);
          var userInfo = res.userInfo
          var nickName = userInfo.nickName
          var avatarUrl = userInfo.avatarUrl
          that.setData({
               nickName : nickName,
               avatarUrl: avatarUrl
          })
        }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  bindPickerChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      pickerIndex: e.detail.value
    })
  } ,
  toEquipment:function(){
      var equipmentUrl = null;
      if(this.data.equipmentUrlFlag){ //已有添加设备信息
        equipmentUrl = '/page/home/equipment/equipment';
      }else{ //没有添加设备信息
        equipmentUrl = '/page/home/equipment/detail/detail';
      }
      wx.navigateTo({
        url: equipmentUrl,
        success: function(res){
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
  },
  relieveBind:function(){
        console.log(111111)
        wx.navigateTo({
          url: '/page/member/login',
          success: function(res){
            // success
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
  },
  QRcodeTap:function(){
        wx.navigateTo({
      url: '/page/home/qrcode/qrcode',
      success: function(res){
        console.log("这是二维码")
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  toMyInfo:function(){
    wx.navigateTo({
      url: '/page/home/myInformation/myInformation',
      success: function(res){
        console.log("这是基本资料")
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  } 

})