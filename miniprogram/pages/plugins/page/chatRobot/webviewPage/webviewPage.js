Page({
    data: {
        url: ""
    },
    onLoad: function(n) {
        this.setData({
            url: n.url
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function(n) {
        var o = this.data.url;
        return n.from, {
            title: "微信对话开放平台",
            path: "/pages/webviewPage/webviewPage?url=" + o,
            imageUrl: ""
        };
    },
    onPageScroll: function() {},
    onTabItemTap: function(n) {}
});