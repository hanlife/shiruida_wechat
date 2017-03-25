// page/home/photoMannage/photoMannage.js
Page({
  data:{
    eventObj:{
         ChooseImage1: "ChooseImage1",
         ChooseImage2: "ChooseImage2",
         ChooseImage:"ChooseImage"
    },
    iconDeleteUrl:"/image/icon_delete.png",
    serviceUrl1:"",
    serviceUrl2:"",
    serviceUrl3:"",
    serviceUrl4:"",
    serviceUrl5:"",
    serviceUrl6:"",
    panel1Sum:0,
    panel2Sum:0,
    panel1limitSum:1,
    panel2limitSum:1,
    panel1ImageList:[],
    panel2ImageList:[],
    panel3ImageList:[],
    panel4ImageList:[],
    panel5ImageList:[],
    panel6ImageList:[],
    panelimitSum:100,
    delflag3:true,
    delflag4:true,
    delflag5:true,
    delflag6:true,
    closeflag3:true,
    closeflag4:true,
    closeflag5:true,
    closeflag6:true,
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
  ChooseImage1: function (e) {
    console.log(e)
    var that = this
    wx.chooseImage({
      count: this.data.panel1limitSum,
      success: function (res) {
        console.log(res)
        that.setData({
          panel1Sum: res.tempFilePaths.length,
          panel1ImageList: res.tempFilePaths
        })
       
      }
    })
  },
  ChooseImage2: function (e) {
    var that = this
    wx.chooseImage({
      count: this.data.panel1limitSum,
      success: function (res) {
        console.log(res)
        that.setData({
          panel2Sum: res.tempFilePaths.length,
          panel2ImageList: res.tempFilePaths
        })
       
      }
    })
  },
 ChooseImage:function(e){
     console.log(e)
     var that = this
     console.log(e.currentTarget.dataset.index)
     var index  = e.currentTarget.dataset.index;
     
    wx.chooseImage({
      count: this.data.panelimitSum,
      success: function (res) {
        console.log(res)
        if( index == 3){
            for(let i =0;i<res.tempFilePaths.length;i++ ){
                  that.data.panel3ImageList.push(res.tempFilePaths[i]);
            }
            that.setData({
                 panel3ImageList: that.data.panel3ImageList,
                 delflag3:false
            })
           
        }
         if( index == 4){
            for(let i =0;i<res.tempFilePaths.length;i++ ){
                  that.data.panel4ImageList.push(res.tempFilePaths[i]);
            }
            that.setData({
                 panel4ImageList: that.data.panel4ImageList,
                 delflag4:false
            })
           
        }
         if( index == 5){
           for(let i =0;i<res.tempFilePaths.length;i++ ){
                  that.data.panel5ImageList.push(res.tempFilePaths[i]);
            }
            that.setData({
                 panel5ImageList: that.data.panel5ImageList,
                 delflag5:false
            })
           
        }
         if( index == 6){
           for(let i =0;i<res.tempFilePaths.length;i++ ){
                  that.data.panel6ImageList.push(res.tempFilePaths[i]);
            }
            that.setData({
                 panel6ImageList: that.data.panel6ImageList,
                 delflag6:false
            })
            
        }
        
      }
    })
  },
  removeImage:function(e){
    console.log(e)
     var id = e.currentTarget.dataset.id;
     var index =  e.currentTarget.dataset.index;
     
      if( index == 3 ){
        this.data.panel3ImageList.splice(id,1);
        this.setData({
           panel3ImageList:this.data.panel3ImageList
        })
      }
      if( index == 4 ){
        this.data.panel4ImageList.splice(id,1);
        this.setData({
           panel4ImageList:this.data.panel4ImageList
        })
      }
      if( index == 5 ){
        this.data.panel5ImageList.splice(id,1);
        this.setData({
           panel5ImageList:this.data.panel5ImageList
        })
      }
      if( index == 6 ){
        this.data.panel6ImageList.splice(id,1);
        this.setData({
           panel6ImageList:this.data.panel6ImageList
        })
      }
   
  },
  previewImage: function (e) {
    console.log(e)
    var current = e.currentTarget.dataset.src;
    var index = e.currentTarget.dataset.index;

    if( index == 1 ){
         wx.previewImage({
            current: current,
            urls: this.data.panel1ImageList
         })
    }
    if( index == 2 ){
         wx.previewImage({
            current: current,
            urls: this.data.panel2ImageList
         })
    }
    if( index == 3 ){
         wx.previewImage({
            current: current,
            urls: this.data.panel3ImageList
         })
    }
    if( index == 4 ){
         wx.previewImage({
            current: current,
            urls: this.data.panel4ImageList
         })
    }
    if( index == 5 ){
         wx.previewImage({
            current: current,
            urls: this.data.panel5ImageList
         })
    }
    if( index == 6 ){
         wx.previewImage({
            current: current,
            urls: this.data.panel6ImageList
         })
    }
   
  },
  delImages:function(e){
     var index = e.currentTarget.dataset.index;
     if(index == 3 ){
       this.setData({
            closeflag3: !this.data.closeflag3,
       })
     }
     if(index == 4 ){
       this.setData({
            closeflag4: !this.data.closeflag4,
       })
     }
     if(index == 5 ){
       this.setData({
            closeflag5: !this.data.closeflag5,
       })
     }
     if(index == 6 ){
       this.setData({
            closeflag6: !this.data.closeflag6,
       })
     }

  }
})