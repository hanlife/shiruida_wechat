// page/recruit/filter/filter.js 
var promisefy = require('../../../utils/promise.js');
var bmap = require('../../../utils/bmap-wx.min.js');
var app = getApp();
//{  所属区域数据  }
var cityItem = [];

//{  工种类型数据  }
var prifession = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinces: [],
    province: "",
    provinceId: '',
    citys: ["", ""],
    city: "",
    cityId: '',
    countys: ["", ""],
    county: '',
    countyId: '',
    longitude: "",
    latitude: "",
    condition: false,
    value: [0, 0, 0],
    values: [0, 0, 0],   //{   默认显示的省市县  }
    imageUrl: {
      iconArrow: "/icon/icon_arrow.png"
    },
    professionIndex: 0,    //{  工种的索引  
    professionArray: [],   //{  工种类型  
    professionId: '',      //{  工种Id
    professiondes: '',
    payArray: [],          //{  薪资要求     
    payIndex: 0,           //{  薪资索引
    payId: '',             //{  薪资Id
    payName: '',
    payMin: '',
    payMax: '',
    Salarydes: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({ ak: 'oPufGCXIP6BGyj67bBO3KVsG5G7Qa9G4' });
    var fail = function (data) { };
    var success = function (data) {
      var wxMarkerData = data.wxMarkerData[0];
      addressAnalyze(wxMarkerData);
    }
    //发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success
    });
    function addressAnalyze(res) {
      let isprovince = res.address.indexOf('省');
      let iscity = res.address.indexOf('市');
      let iscounty = res.address.indexOf('区');

      let province = '', provinceId, city = '', cityId, county, countyId, provinceArray, cityArray, detail;

      if (isprovince > -1) {
        province = res.address.substring(0, isprovince + 1) + " "
      }
      if (iscity > -1) {

        city = res.address.substring(isprovince + 1, iscity + 1) + " "
        cityArray = res.address.substring(iscity + 1);
      }
      if (cityArray.indexOf("县") != -1) {
        county = cityArray.substring(0, cityArray.indexOf("县") + 1);
        detail = cityArray.split("县", 2)[1];
      }
      if (cityArray.indexOf("区") != -1) {
        county = cityArray.substring(0, cityArray.indexOf("区") + 1);
        detail = cityArray.split("区", 2)[1];
      }

      //{  获取选项的省市县  }
      if (app.globalData.cityItem) {
        cityItem = app.globalData.cityItem
        citySelect();
      } else {
        promisefy.wxRequest({
          url: "http://www.im360b2b.com/Content/js/Area.js",
          method: 'GET'
        }).then(response => {
          cityItem = response.data[0].children[0].children;
           citySelect();
        })
      }
      function citySelect() {
        let cityData = cityItem;
        const provinces = [];
        const citys = [];
        const countys = [];
        province = province.replace(/(^\s*)|(\s*$)/g, "");
        city = city.replace(/(^\s*)|(\s*$)/g, "");
        county = county.replace(/(^\s*)|(\s*$)/g, "");
        //省
        for (let i = 0; i < cityData.length; i++) {
          if (province.replace(/(^\s*)|(\s*$)/g, "") == cityData[i].text) {
            provinceId = cityData[i].id
          };
          provinces.push({
            name: cityData[i].text,
            id: cityData[i].id
          });
          
        }
        //市
          for (let j = 0; j < cityData[0].children.length; j++) {

            if (city.replace(/(^\s*)|(\s*$)/g, "") == cityData[0].children[j].text) {
              cityId = cityData[0].children[j].id
            };
            citys.push({
              name: cityData[0].children[j].text,
              id: cityData[0].children[j].id
            })
          }
          //县
            for (let k = 0; k < cityData[0].children[0].children.length; k++) {
              if (county.replace(/(^\s*)|(\s*$)/g, "") == cityData[0].children[0].children[k].text) {
                countyId = cityData[0].children[0].children[k].id
              };
              countys.push({
                name: cityData[0].children[0].children[k].text,
                id: cityData[0].children[0].children[k].id
              })
            }
        that.setData({
          provinces: provinces,
          citys: citys,
          countys: countys,
          province: province,
          provinceId: provinceId,
          city: city,
          cityId: cityId,
          county: '',
          countyId: countyId,
          longitude: res.longitude,
          latitude: res.latitude,
        })
      }

    }



    //{  获取工种  }
    promisefy.BaseDataPromise({
      url: 'GetJobName',
      method: 'GET'
    }).then(res => {
      // res.data.Data 
      res.data.Data.unshift({Name:"不限",Index:"",Id:""})
      if (res.data.Succeed) {
        this.setData({
          professionArray: res.data.Data,
          professionId: res.data.Data[0].Id
        })
      }
    }).done();


    //{  获取薪资要求列表  }
    promisefy.BaseDataPromise({
      url: 'GetMoeny',
      method: 'GET'
    }).then(res => {
      if (res.data.Succeed) {
        res.data.Data.unshift({Name:"不限",Index:"",Id:""});
        this.setData({
          payArray: res.data.Data,
          payId: res.data.Data[0].Id
        })
      }
    })


    // var cityData = that.data.cityData;

  },
  onReady: function () {

  },
  onShow: function () {
    app.globalData.recruitGo = true;
  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  //{  选择所属区域  }
  bindChange: function (e) {
    var val = e.detail.value;   //{  存放当前列值的索引 }   
    var t = this.data.values;   //{  显示的省市县   }
    var cityData = cityItem;


    if (val[0] != t[0]) {   //{ 选中的省 不等于 显示的省  }
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].children.length; i++) {
        citys.push({
          name: cityData[val[0]].children[i].text,
          id: cityData[val[0]].children[i].id
        })
      }
      for (let i = 0; i < cityData[val[0]].children[0].children.length; i++) {
        countys.push({
          name: cityData[val[0]].children[0].children[i].text,
          id: cityData[val[0]].children[0].children[i].id
        })
      }

      this.setData({
        province: this.data.provinces[val[0]].name,
        provinceId: this.data.provinces[val[0]].id,
        city: citys[0].name,
        cityId: citys[0].id,
        citys: citys,
        county: countys[0].name,
        countyId: countys[0].id,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {    //{  选中的市  不等于  显示市   }
      const countys = [];

      // for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
      //   countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      // }
      for (let i = 0; i < cityData[val[0]].children[val[1]].children.length; i++) {
        countys.push({
          name: cityData[val[0]].children[val[1]].children[i].text,
          id: cityData[val[0]].children[val[1]].children[i].id
        })
      }

      this.setData({
        city: this.data.citys[val[1]].name,
        cityId: this.data.citys[val[1]].id,
        county: countys[0].name,
        countyId: countys[0].id,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {    //{  选中的县  不等于  显示县   }
      this.setData({
        county: this.data.countys[val[2]].name,
        countyId: this.data.countys[val[2]].id,
        values: val
      })
      return;
    }

  },
  //{  选择应聘工种  }
  ProfessionPickerChange: function (e) {
    this.setData({
      professionIndex: e.detail.value,
      professionId: this.data.professionArray[e.detail.value].Id
    })
  },
  //{  选择薪资要求  }
  PayPickerChange: function (e) {
    let payName = this.data.payArray[e.detail.value].Name;
    let arr = ['-', '<', '＜', '≤', '>', '＞', '≥'];
    let nameArr = [];
    let symbol = '';
    for (let i = 0; i < arr.length; i++) {
      if (payName.indexOf(arr[i]) > -1) {
        symbol = arr[i];
        nameArr = payName.split(arr[i]);
        break;
      }
    }
  
    let payMin  = nameArr[0] ? nameArr[0].replace(/[^0-9] | [^\.]/ig, "") : '';
    let payMax  = nameArr[1] ? nameArr[1].replace(/[^0-9] | [^\.]/ig, "") : '';

    payMin = payMin ?  parseFloat(payMin) : '';
    payMax = payMax ?  parseFloat(payMax) : '';

     if( symbol &&  (symbol == arr[4] || symbol == arr[5] || symbol == arr[6] ) ){
         payMin = payMax;
         payMax = '';
       }
    if(this.data.payArray[e.detail.value].Name == '面议'){
      payMin = 0;
      payMax = 0;
    }   
    this.setData({
      payIndex: e.detail.value,
      payId: this.data.payArray[e.detail.value].Id,
      payName: this.data.payArray[e.detail.value].Name,
      payMin: payMin === '' ? null : payMin,
      payMax: payMax === '' ? null : payMax
    })
  },
  //{  重置  }
  ResetFuc: function () {
    this.setData({
      province: '',
      city: '',
      county: '',
      professionIndex: -1,
      payIndex: -1,
      Longitude: '',
      Latitude: '',
      professionId: '',
      payMin: '',
      payMax: ''
    })

  },
  //{  确定  }
  ConfirmFuc: function () {
    app.globalData.filterWeb = this.data;
    let a = getCurrentPages()
    wx.navigateBack({ delta: a.length - 2 })
  }

})