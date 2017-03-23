// page/home/industiyInfor/industiyInfor.js
var provinceItems = ['province1', 'province2', 'province3', 'province4','province5', 'province6'];
var cityItems     = ['city1','city2','city3','city4','city5','city6'];
var countyItems   = ['county1','county2','county3','county4','county5','county6'];
var status = ["待提交","待审核","审核通过","审核不通过"];
var pageObject = {
  data: {
    companyName:"",
    clearFlag:true,
    provinceHidden: true,
    cityHidden: true,
    countyHidden: true,
    provinceItems: provinceItems,
    cityItems:cityItems,
    countyItems:countyItems,
    hasAddress:true,
    address:"",
    addressDetail:"",
    province:"",
    city:"",
    county:"",
    photoArray:[],
    latitude: '', 
    longitude: '', 
    buttonText:"提交审核"
  },
  bindinput:function(e){
      if(e.detail.value.length > 0){
              this.setData({
                clearFlag:false
              })
      }else{
            this.setData({
                clearFlag:true
              })
      }     
  },
  clearText:function(){
      this.setData({
        companyName:""
      })
  },
  chooseLocation:function(){
     wx.chooseLocation({
      success: (res)=> {
        var provinceArray = res.address.split("省",2);
        console.log(provinceArray)
        var cityArray = provinceArray[1].split("市",2);
        console.log(cityArray)
        if(cityArray[1].indexOf("县") != -1){
            var county = cityArray[1].substring(0,cityArray[1].indexOf("县")+1);
            var detail = cityArray[1].split("县",2)[1];
        }
        if(cityArray[1].indexOf("区") != -1){
            var county = cityArray[1].substring(0,cityArray[1].indexOf("区")+1);
            var detail = cityArray[1].split("区",2)[1];
        }
        var province = provinceArray[0];
        var city = cityArray[0];

        console.log(res)
        this.setData({
            address: province +"省 " + city + "市 " + county ,
            addressDetail: detail +" "+ res.name,
            province:province +"省",
            city: city + "市",
            county: county 
        })
      }
    })
  },
  actionSheetChange: function(e) {
    this.setData({
      provinceHidden: !this.data.provinceHidden
    })
  },
  chooseImage:function(){
    var that = this;
       wx.chooseImage({
         count: 1, // 最多可以选择的图片张数，默认9
         success: function(res){
           // success
           that.setData({
             photoArray:res.tempFilePaths
           })
           wx.uploadFile({
                url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
                filePath: res.tempFilePaths[0],
                name: 'file',
                formData:{
                  'user': 'test'
                },
                success: function(res){
                  var data = res.data
                  //do something
                }
            })
         },
         fail: function() {
           // fail
         },
         complete: function() {
           // complete
         }
       })

  },
  previewImage:function(e){
    wx.previewImage({
            current: e.currentTarget.dataset.src,
            urls: this.data.photoArray
         })
  }
}

for (var i = 0; i < provinceItems.length; ++i) {
  (function(itemName) {
    pageObject['bind' + itemName] = function(e) {
      this.setData({
           provinceHidden: !this.data.provinceHidden,
           cityHidden:!this.data.countyHidden,
           province:e.currentTarget.dataset.id
      })
      console.log('click' + itemName, e)
    }
  })(provinceItems[i])
}

for (var i = 0; i < cityItems.length; ++i) {
  (function(itemName) {
    pageObject['bind' + itemName] = function(e) {
      this.setData({
           cityHidden:!this.data.cityHidden,
           countyHidden: !this.data.countyHidden,
           city:e.currentTarget.dataset.id
      })
      console.log('click' + itemName, e)
    }
  })(cityItems[i])
}

for (var i = 0; i < countyItems.length; ++i) {
  (function(itemName) {
    pageObject['bind' + itemName] = function(e) {
      this.setData({
           countyHidden: !this.data.countyHidden,
           county:e.currentTarget.dataset.id,
           hasAddress:true

      })
      console.log('click' + itemName, e)
    }
  })(countyItems[i])
}
Page(pageObject)


