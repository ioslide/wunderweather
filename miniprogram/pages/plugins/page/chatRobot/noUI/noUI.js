var n = requirePlugin("chatRobot");

Page({
    data: {
        answer: "",
        question: ""
    },
    send: function(t) {
        var e = this;
        console.log(t.detail.value), n.send({
            query: t.detail.value,
            success: function(n) {
                e.setData({
                    answer: n.answer
                });
            }
        }), console.log("apinlp", n.api), n.api.tokenize(t.detail.value).then(function(n) {
            console.log("all", n);
        });
    },
    focus: function(n) {
        this.setData({
            answer: "",
            question: ""
        });
    },
    onLoad: function(n) {
        var t = this;
        wx.getSystemInfo({
            success: function(n) {
                var e = 0;
                e = n.system.indexOf("iOS") > -1 ? 44 : 48, t.setData({
                    status: n.statusBarHeight,
                    navHeight: e,
                    statusBarHeight: n.statusBarHeight + e
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    back: function(n) {
        wx.navigateBack({
            delta: 1
        });
    }
});