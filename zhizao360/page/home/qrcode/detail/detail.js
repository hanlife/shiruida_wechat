// page/home/qrcode/detail/detail.js
Page({
  data:{
   companyIntroduceObj:{
      a:"深圳",
      b:"20000m²",
      c:"1500万",
      d:"--",
      e:"模具设计加工",
      f:"打死U盾会啊施工队啊是功大于过打碎的噶是一个多余啊是孤独呀告诉遇到过",
      g:"dsajoidhsu"
    },
      equipmentListArray:[
           {
             a:"三菱机电机",
             b:"0.005-0.01mm",
             c:"闲置数X15",
             d:"铣床",
             e:"总台数X1",
             f:"高宽"
           },
           {
             a:"三菱机电机",
             b:"0.005-0.01mm",
             c:"闲置数X15",
             d:"铣床",
             e:"总台数X1",
             f:"高宽"
           }
      ],
      qrcodeObj:{
       logo:'',
       title:'深圳仕瑞达自动化设备有限公司',
       qrcode:'',
       des:'扫一扫上面的二维码图案，收藏我的公司'
    },
    markers: [{
      iconPath: "/resources/others.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color:"#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '/resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
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