Page({
    data: {},
    onLoad: function() {
        var t = this, a = 0, i = wx.getSystemInfoSync(), e = i.system.indexOf("iOS") > -1, n = 0;
        a = (n = e ? 44 : 48) + i.statusBarHeight, requirePlugin("chatRobot").init({
            appid: "VEgbxLa9kYqzGOzstdeSF3xDbkS9zK",
            navHeight: a,
            success: function() {
                t.setData({
                    showChat: !0
                }, function() {
                    t.setData({
                        status: i.statusBarHeight,
                        navHeight: n,
                        statusBarHeight: i.statusBarHeight + n
                    });
                });
            },
            fail: function(t) {}
        });
    },
    getQueryCallback: function(t) {},
    goBackHome: function(t) {
        wx.navigateBack({
            delta: 1
        });
    },
    back: function() {
        this.goBackHome();
    }
});