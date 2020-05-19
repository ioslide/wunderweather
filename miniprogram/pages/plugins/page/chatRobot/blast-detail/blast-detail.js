function t(t) {
    if (Array.isArray(t)) {
        for (var e = 0, a = Array(t.length); e < t.length; e++) a[e] = t[e];
        return a;
    }
    return Array.from(t);
}

var e = getApp();

Page({
    data: {
        value: "",
        words: [],
        checked: !1,
        choosePOSs: 0,
        flag: !0
    },
    onLoad: function(t) {
        var e = this, a = this;
        requirePlugin("myPlugin").init({
            appid: "VEgbxLa9kYqzGOzstdeSF3xDbkS9zK",
            success: function() {},
            fail: function(t) {}
        }), wx.getSystemInfo({
            success: function(t) {
                var a = 0;
                a = t.system.indexOf("iOS") > -1 ? 44 : 48, e.setData({
                    windowWidth: t.windowWidth - 110,
                    backgroundHeight: t.windowHeight,
                    status: t.statusBarHeight,
                    navHeight: a,
                    statusBarHeight: t.statusBarHeight + a
                }, function() {
                    e.setData({
                        show: !0
                    });
                });
            }
        });
        var n = "微信AI团队推出了“微信对话开放平台”";
        this.setData({
            value: n
        }), a.getData(n);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function(t) {
        return t.from, {
            title: "大爆炸",
            path: "/pages/blast-detail/blast-detail",
            imageUrl: "https://res.wx.qq.com/mmspraiweb_node/dist/static/nlpapi/bigBangBg.png"
        };
    },
    onPageScroll: function() {},
    onTabItemTap: function(t) {},
    chooseP: function(t) {
        this.setData({
            choosePOSs: t.currentTarget.dataset.code,
            flag: !0
        });
    },
    chooseW: function(t) {
        this.setData({
            choosePOSs: t.currentTarget.dataset.code,
            currentIndex: t.currentTarget.dataset.index,
            flag: !1
        });
    },
    back: function() {
        !0 !== e.globalData.scene ? wx.navigateBack({}) : wx.reLaunch({
            url: "/pages/home/home",
            success: function() {}
        });
    },
    bindconfirm: function(t) {
        var e = this;
        if ("" === e.data.value) return !1;
        e.getData(t.detail.value);
    },
    bindinput: function(t) {
        this.setData({
            value: t.detail.value
        });
    },
    btn: function() {
        var t = this;
        if ("" === t.data.value) return !1;
        t.getData(t.data.value);
    },
    getData: function(e) {
        var a = this;
        requirePlugin("myPlugin").api.tokenize(e).then(function(n) {
            var i = !1;
            0 !== n.entities.length && (i = !0);
            var s = [];
            n.words.forEach(function(t, e) {
                " " === t && (t = "空格"), s.push({
                    date: n.POSs[e],
                    data: t
                });
            });
            var o = [];
            n.words_mix.forEach(function(t, e) {
                " " === t && (t = "空格"), o.push({
                    date: n.POSs_mix[e],
                    data: t
                });
            });
            var r = {
                entities: n.entities,
                entity_types: n.entity_types
            }, c = [].concat(t(r.entity_types)), u = [].concat(t(r.entities)), h = {};
            c.forEach(function(t, e) {
                h[t] ? h[t].push(u[e]) : (h[t] = new Array(), h[t].push(u[e]));
            });
            var d = [];
            for (var f in h) d.push({
                date: f,
                data: h[f]
            });
            var l = [].concat(t(new Set(n.POSs))), g = [].concat(t(new Set(n.POSs_mix)));
            a.setData({
                choosePOSs: a.data.checked ? n.POSs_mix[0] : n.POSs[0],
                terms_top_border: !0,
                value: e,
                words: s,
                words_mix: o,
                POSs: l,
                POSs_mix: g,
                entities: n.entities,
                entity_type: n.entity_types,
                properNoun: d,
                entitiesBoolean: i
            });
        });
    },
    change: function(t) {
        t.detail.value ? this.setData({
            checked: t.detail.value,
            choosePOSs: this.data.POSs_mix[0],
            flag: !0
        }) : this.setData({
            checked: t.detail.value,
            choosePOSs: this.data.POSs[0],
            flag: !0
        });
    }
});