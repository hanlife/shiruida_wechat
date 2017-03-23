// page/home/body/body.js
Page({
  data:{
  pickerArray:["采购商","供应商"],
  pickerIndex:0,
  equipmentUrlFlag:true   //判断是否有添加设备信息
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
 
  bindPickerChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      pickerIndex: e.detail.value
    })
  } ,
   toEquipment:function(){
    //判断是否有添加设备信息   如果有就跳转到设备信息展示页   没有就跳转到设备添加页
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
       console.log("解绑退出")
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