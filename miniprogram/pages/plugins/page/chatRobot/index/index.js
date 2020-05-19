var n = requirePlugin("chatRobot");

Page({
    data: {
        list: [ {
            text: "对话"
        }, {
            text: "设置"
        } ],
        guideList: [ "北京天气怎么样", "上海今天有雨吗", "中午吃啥呢", "你知道如何排解压力吗", "法国国土面积是多少", "世界最高峰" ]
    },
    onLoad: function() {},
    onShareAppMessage: function() {
        console.log("onShareAppMessage");
    },
    bindtapOpenHaveUI: function(t) {
        n.setGuideList(this.data.guideList), wx.navigateTo({
            url: "../pluginChat/pluginChat",
            success: function(n) {},
            fail: function(n) {},
            complete: function(n) {}
        });
    },
    bindtapOpenNoUI: function(n) {
        wx.navigateTo({
            url: "../noUI/noUI",
            success: function(n) {},
            fail: function(n) {},
            complete: function(n) {}
        });
    }
});