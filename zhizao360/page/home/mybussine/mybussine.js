// page/home/mybussine/mybussine.js
Page({
  data: {
    companyIntroduce: {
      a: "深圳",
      b: "20000m²",
      c: "1500万",
      d: "--",
      e: "模具设计加工",
      f: "打死U盾会啊施工队啊是功大于过打碎的噶是一个多余啊是孤独呀告诉遇到过",
      g: "dsajoidhsu"
    },
    swiperNavArray: ["封面图片", "厂房大门", "办公场所", "常规设备", "产品图片"],
    pictrue: [
      ['/icon/icon_add.png','/icon/icon_heart.png','/icon/icon_heartT.png' ],//厂房大门
      ['/icon/icon_heart.png','/icon/icon_heart.png','/icon/icon_heartT.png'],//办公场所
      ['/icon/icon_heartT.png','/icon/icon_heart.png','/icon/icon_heartT.png'],//常规设备
      ['/icon/icon_add.png','/icon/icon_heart.png','/icon/icon_heartT.png'] //产品图片
    ],
    pictrueIndex: 0, //控制显示那个模块的图片
    titleNavArray: ["公司介绍", "设备清单", "联系我们"],
    titleShowIndex: 0,
    content1: false,
    content2: true,
    content3: true,
    //设备清单数据数组
    equipmentListArray: [
      {
        a: "三菱机电机",
        b: "0.005-0.01mm",
        c: "闲置数",
        num: '5',
        d: "铣床",
        e: "总台数",
        totalNum: '10',
        f: "高宽"
      },
      {
        a: "三菱机电机",
        b: "0.005-0.01mm",
        c: "闲置数",
        num: '6',
        d: "铣床",
        e: "总台数X1",
        totalNum: '11',
        f: "高宽"
      }
    ],
    //联系我们数据数组
    contactArray: [
      {
        name: "张三",
        phone: "18794561201",
        QQ: "66666666",
        wechat: ""
      },
      {
        name: "李四",
        phone: "99999999",
        QQ: "11111111",
        wechat: ""
      }
    ],
    background: ['green', 'red', 'yellow'],
    doorArray: [], //厂房大门
    workArray: [], //办公场所
    equipmentArray: [], //常规设备
    productArray: [], //产品图片
    indicatorDots: false, //是否显示面板指示点
    vertical: false,      // 左右还是上下
    autoplay: false,
    interval: 3000,
    duration: 1000,
    currentNum: 1, //显示的是第几张图片
    totalNum: 200,  //图片的总数
    collectFlag: false  //图片是否收藏
    
  },
  switchNav: function (e) {
    var that = this ;
    console.log(e.currentTarget.dataset.index);
    this.setData({
      pictrueIndex: e.currentTarget.dataset.index,
      totalNum: that.data.pictrue[e.currentTarget.dataset.index].length
    })
  },
  selectTitle: function (e) {
    console.log(e.currentTarget.dataset.index)
    var content1 = true,
      content2 = true,
      content3 = true,
      index = e.currentTarget.dataset.index;
    console.log(e)
    console.log(index)
    if (index == 0) {
      content1 = false
    } else if (index == 1) {
      content2 = false
    } else {
      content3 = false
    }

    this.setData({
      content1: content1,
      content2: content2,
      content3: content3,
      titleShowIndex: index
    })
    console.log(content1, content2, content3)

  },
  BtnCollect: function () {
         
         this.setData({
              collectFlag: !this.data.collectFlag
         })
  },
  makePhoneCall: function (e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })
  },
  swiperImg:function(e){
    var currentNum =  ++e.detail.current;
    console.log(currentNum);
    this.setData({
      currentNum : currentNum
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})