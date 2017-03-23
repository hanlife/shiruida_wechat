// page/home/body/body.js
Page({
  data:{
    height: 20,
    focus: false,
    pickerIndex:0,
    pickerArray:["采购商","供应商"],
    textLength:0,
    array:[
      {
        message:"企业认证",
        url:"/pages/home/mybussine/mybussine"
      },
      {
        message:"企业信息",
        url:"/pages/home/mybussine/mybussine"

      },
      {
        message:"账号类型",
        url:"/pages/home/mybussine/mybussine"
      },
      {
        message:"行业信息",
        url:"/pages/home/mybussine/mybussine"
      },
     
      ],
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
        console.log(e.detail.value)
        this.setData({
             pickerIndex:e.detail.value
        })
  },
  bindButtonTap: function() {
    this.setData({
      focus: true
    })
  },
  bindTextAreaBlur: function(e) {
    console.log(e.detail.value)
  },
  bindFormSubmit: function(e) {
    console.log(e.detail.value.textarea)
  },
  bindinput:function(e){
     console.log(e.detail.value)
     this.setData({
           textLength:    e.detail.value.length 
     })
  }
})