// pages/login/login.js
Page({
  data:{
    number:'',
    importCode:'',
    verifyCode:'',
    noLogin:false,
    noRecord:false,
    type:""
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
  verifyNumber:function(e){
      e.detail.value = e.detail.value.replace(/\D/g,'');
      this.setData({
        phoneNumber:e.detail.value
      })
  },
  sendCode:function(){
     var code =  parseInt( Math.random()*10 ) + "w" +   parseInt( Math.random()*10 )  + "s";
      console.log("发送验证码"+ code);
      console.log("判断isLogin？")   
     var _noLogin = false;

      this.setData({
        verifyCode:code,
        noLogin:_noLogin
      })
  },
  getImportCode:function(e){
    this.setData({
          importCode : e.detail.value
    })
  },
  binding:function(){

    console.log("用户的输入的验证码" + this.data.importCode)
    console.log(this.data.verifyCode)
    var pattern = new RegExp(this.data.verifyCode);
    console.log(!pattern.test(this.data.importCode))
    
     if( !pattern.test(this.data.importCode)){
        console.log("验证码错误，请重新输入");
        return false ;
     }
     console.log("验证成功！")

     console.log("判断公司名称isRecord？")
     var _noRecord = false;
     this.setData({
       noRecord:_noRecord
     })
  },
  bindChange:function(e){
         console.log(e.detail.value)
         var type = e.detail.value[0]
         if( type == 0){
           this.setData({
             type:"采购商"
           })
         }else if ( type == 1 ){
           this.setData({
             type:"供应商"
           })
         }else if( type == 2 ){
            this.setData({
             type:"采购商 + 供应商"
           })
         }
  }
})