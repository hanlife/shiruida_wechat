// page/home/qrcode/qrcode.js
Page({
  data:{
    qrcodeObj:{
       logo:'/icon/logo.png',
       title:'机械加工定制服务平台',
       qrcode:'',
       des:'微信【扫一扫】即可获得联系方式及公司详细信息'
    }
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
  generalize:function(e){
    console.log(1)
        wx.navigateTo({
          url: '/page/home/qrcode/detail/detail'
        })
  }
})