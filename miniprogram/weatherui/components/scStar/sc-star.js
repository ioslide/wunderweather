var t = function(t) {
    if (t && t.__esModule) return t;
    var a = {};
    if (null != t) for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (a[n] = t[n]);
    return a.default = t, a;
}(require("../../../utils/wxapi.js"))
const n = getApp();

Component({
    props: {},
    data: {
        windowWidth: n.globalData.windowWidth,
        navigationHeight: n.globalData.navigationHeight,
        menuInfo: n.globalData.menuInfo,
        display: !1
    },
    attached: function() {
        this.calc(), 
        this.getStorage();
    },
    methods: {
        calc: function() {
            console.log('calc')
            var a = this;
            t.getSystemInfo().then(function(t) {
                var n = wx.getMenuButtonBoundingClientRect(), 
                e = 2 * n.top + n.height - t.statusBarHeight + 3;
                a.setData({
                    navigationHeight: e,
                    windowWidth: t.windowWidth,
                    menuInfo: n
                });
            });
        },
        getStorage: function() {
            var t = this;
            wx.getStorage({
                key: "star",
                success: function(a) {
                    a.data ? t.setData({
                        display: !1
                    }) : t.setData({
                        display: !0
                    });
                },
                fail: function(a) {
                    console.log(a), t.setData({
                        display: !0
                    });
                }
            });
        },
        setStorage: function() {
            var a = this;
            t.setStorage("star", !0).then(function(t) {
                a.setData({
                    display: !1
                });
            });
        }
    }
});