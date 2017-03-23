var app = function () {
    return {
        //消息提示框
        showToast: function (title, icon, duration) {
            wx.showToast({
                title: title || '成功',
                icon: icon || "success",
                duration: duration || 2000
            })
            setTimeout(function () {
                wx.hideToast()
            }, 2000)
        },
        //显示模态弹窗
        showModal: function (obj) {
            wx.showModal({
                title: obj.title || '提示',
                content: obj.content,
                success: function (res) {
                    if (res.confirm) {
                        obj.callback
                    }
                }
            })
        },
        //数据请求
        request: function (obj) {
            wx.request({
                url: obj.url, //仅为示例，并非真实的接口地址
                data: obj.data || null,
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    obj.success()
                }
            })
        },
        share: function () {

        },
        getSystemInfo: function () {
            var SystemInfo = null;
            wx.getSystemInfo({
                success: function (res) {
                    SystemInfo= res;
                }
            })
            return SystemInfo;
        }
    }
}();
module.exports = { app }