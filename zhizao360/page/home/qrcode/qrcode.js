// page/home/qrcode/qrcode.js
Page({
  data: {
    qrcodeObj: {
      logo: '/icon/logo.png',
      title: '机械加工定制服务平台',
      qrcode: '',
      des: '微信【扫一扫】即可获得联系方式及公司详细信息'
    }
  },
  onLoad: function (options) {

    var that = this;

    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxa12924b3d5de635a&secret=1ef4b00561f570d0a0a74767f1e01679',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        console.log("获取access_token");
        console.log(res.data.access_token);

        wx.request({
          url: 'http://www.im360b2b.com/wxapi/BaseData/GetQcCode',
          data: { path: "/page/home/mybussine/mybussine", width: 430, token: res.data.access_token },
          method: 'post',
          success: function (res) {
            var imgurl = "http://www.im360b2b.com" + res.data.Data;
            console.log(imgurl);
            that.setData({
              qrcodeObj: {
                logo: '/icon/logo.png',
                title: '机械加工定制服务平台',
                qrcode: imgurl,
                des: '微信【扫一扫】即可获得联系方式及公司详细信息'
              }

            })
            console.log(JSON.stringify(res));
          },
          fail: function () {
          },
          complete: function () {
          }
        })


        // wx.request({
        //   url: 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=' + res.data.access_token,
        //   data: {
        //     path: '/page/home/mybussine/mybussine',
        //     width: '430'
        //   },
        //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //   // header: {}, // 设置请求的 header
        //   success: function (res) {
        //     // success
        //     console.log("获取二维码")
        //     console.log(res)
        //     var blob = this.res;
        //     window.URL.revokeObjectURL(that.data.qrcode);

        //     var src = window.URL.createObjectURL(blob);
        //     console.log(src);



        //     that.setData({
        //       qrcodeObj: {
        //         logo: '/icon/logo.png',
        //         title: '机械加工定制服务平台',
        //         qrcode: 'data:image/png;base64,' + src,
        //         des: '微信【扫一扫】即可获得联系方式及公司详细信息'
        //       }
        //     })
        //     console.log(that.data.qrcodeObj)
        //   },
        //   fail: function () {
        //     // fail
        //   },
        //   complete: function () {
        //     // complete
        //   }
        // })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
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
  },
  generalize: function (e) {
    console.log(1)
    wx.navigateTo({
      url: '/page/home/qrcode/detail/detail'
    })
  },
  draw: function (string, canvas, cavW, cavH, ecc) {
    ecclevel = ecc || ecclevel;
    canvas = canvas || _canvas;
    if (!canvas) {
      console.warn('No canvas provided to draw QR code in!')
      return;
    }

    var size = Math.min(cavW, cavH);

    var frame = this.getFrame(string),
      ctx = wx.createContext(),
      px = Math.round(size / (width + 8));

    var roundedSize = px * (width + 8),
      offset = Math.floor((size - roundedSize) / 2);
    size = roundedSize;
    ctx.clearRect(0, 0, cavW, cavW);
    // ctx.setFillStyle('#ffffff');
    // ctx.rect(0, 0, size, size);
    ctx.setFillStyle('#000000');
    // ctx.setLineWidth(1);
    for (var i = 0; i < width; i++) {
      for (var j = 0; j < width; j++) {
        if (frame[j * width + i]) {
          // ctx.fillRect(px * (4 + i) + offset, px * (4 + j) + offset, px, px);
          ctx.rect(px * (4 + i) + offset, px * (4 + j) + offset, px, px);
        }
      }
    }
    ctx.fill();

    wx.drawCanvas({
      canvasId: canvas,
      actions: ctx.getActions()
    });
  }

})