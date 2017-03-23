// page/home/equipment/detail/detail.js
Page({
  data:{
    Type:["","type1","type2"],
    TypeIndex:0,
    Density:["","密度1","密度2"],
    DensityIndex:0,
    number:0,
    buttonText:"修改"
  },
  onLoad:function(options){
    console.log(options)
    // 页面初始化 options为页面跳转所带来的参数
    var title = '',
        buttonText= '';

     if(options.id == 0 ){   //显示设备修改页面
        title = '修改设备';
        buttonText = '修改';
     }else{   //显示设备添加页面
          title = '添加设备';
           buttonText = '添加';
     }
     wx.setNavigationBarTitle({
          title: title,
     })
     this.setData({
       buttonText:buttonText
       })
        
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
  cutNumber:function(){
      var number =  parseInt(this.data.number);
       number --;
       if(number < 1){
         number = 0;
       }
       this.setData({
           number:number
       })
  },
  numberInput:function(e){
      console.log(e)
      console.log(e.detail.value)
      console.log(parseInt(e.detail.value))
      this.setData({
          number:parseInt(e.detail.value) 
      })
  },
  addNumber:function(){
     var number =  parseInt(this.data.number);
       number ++;
       this.data.number = number;
       this.setData({
         number:number
       })
  }

})