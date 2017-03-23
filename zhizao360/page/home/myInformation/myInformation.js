// page/home/myInformation/myInformation.js
Page({
  data:{
    isChildAccount:false,
    buttonText:"提交申请",
    
  },
   makertap: function(e) { 
        var that = this; 
        var id = e.markerId; 
        that.showSearchInfo(wxMarkerData, id); 
    }, 
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this; 
        // 新建百度地图对象 
        var BMap = new bmap.BMapWX({ 
            ak: 'oPufGCXIP6BGyj67bBO3KVsG5G7Qa9G4' 
        }); 
        var fail = function(data) { 
            console.log(data) 
        }; 
        var success = function(data) { 
            wxMarkerData = data.wxMarkerData; 
            that.setData({ 
                markers: wxMarkerData 
            }); 
            that.setData({ 
                latitude: wxMarkerData[0].latitude 
            }); 
            that.setData({ 
                longitude: wxMarkerData[0].longitude 
            }); 
        } 
        // 发起regeocoding检索请求 
        BMap.regeocoding({ 
            fail: fail, 
            success: success, 
            iconPath: '../../img/marker_red.png', 
            iconTapPath: '../../img/marker_red.png' 
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
  switchChange:function(){

  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    // wx.request({
    //     url: 'test.php', //仅为示例，并非真实的接口地址
    //     data:  e.detail.value,
    //     header: {
    //         'content-type': 'json'
    //     },
    //     success: function(res) {
    //       console.log(res.data)
    //     }
    // })
   
    wx.showModal({
      title: '提交成功',
      content: '子账号申请提交成功，等待主账号审核通过',
      showCancel:false,
      confirmText:"知道了",
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.switchTab({
            url: '/page/ordinarylist/index/index',
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
        }
      }
})
  },
  modalConfirm:function(){
   wx.navigateTo({
     url: '/page/ordinarylist/index/index',
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

  }
  
})