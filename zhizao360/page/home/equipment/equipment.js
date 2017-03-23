// page/home/equipment/equipment.js
Page({
  data:{
    equipmentArray:[
      {
        name:"是对大几岁（打速度还是）",
        number:32
      },
      {
         name:"ic潇洒基地（十大季度数据）",
         number:10
      },
      {
         name:"大肆地（大苏工待遇）",
         number:20
      }
    ]
  },
  toEquipment:function(){
    //判断是否有添加设备   如果有就跳转到设备信息展示页   没有就跳转到设备添加页
    wx.navigateTo({
      url: '/page/equipment/equipment',
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
  }
})