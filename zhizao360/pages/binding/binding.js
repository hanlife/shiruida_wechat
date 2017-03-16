var app = getApp();

// pages/login/login.js
Page({
  data:{
    number:'',
    importCode:'',
    verifyCode:'',
    noLogin:false,
    noRecord:false,
    TypeArray:["采购商","供应商"],
    TypeIndex:0,
    codeText:"发送验证码",
    disabled:false
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
     var _this = this; 
     var code =  parseInt( Math.random()*10 ) + "w" +   parseInt( Math.random()*10 )  + "s";
      console.log("发送验证码"+ code);
      console.log("判断isLogin？")   
     var _noLogin = false;
     var time = 60; 
     var downTime = setInterval(downTime,1000);  

      function downTime(){
        time--;
        if(time < 1){
          clearInterval(downTime);
          _this.setData({
            codeText:"重新发送",
            disabled:false
          })

        }else{
           _this.setData({
            codeText:"已发送" + time + "s",
            disabled:true
          })
        }
      }
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

   wx.switchTab({
       url: '/pages/idleProduct/idleProduct'
    })

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
   bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      TypeIndex: e.detail.value
    })
  }
})