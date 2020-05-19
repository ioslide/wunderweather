var i = getApp();

Page({
    data: {
        list: [ {
            url: "https://developers.weixin.qq.com/doc/aispeech/miniprogram/tokenize.html",
            title: "词法分析",
            description: "分词和词性标注，并可根据选项抽取人名、地名、机构名等实体短语",
            imgUrl: "https://res.wx.qq.com/mmspraiweb_node/dist/static/nlpagain/image/icon11.png"
        }, {
            url: "https://developers.weixin.qq.com/doc/aispeech/miniprogram/ner.html",
            title: "数字日期时间识别",
            description: "实体识别，目前支持数字和4种时间类型实体，更多实体开发中",
            imgUrl: "https://res.wx.qq.com/mmspraiweb_node/dist/static/nlpagain/image/icon22.png"
        }, {
            url: "https://developers.weixin.qq.com/doc/aispeech/miniprogram/sentencesim.html",
            title: "文本相似度",
            description: "句子相似度计算。输入是两个句子，输出是两个句子的相似度 举例： 输入：上海的天气不错啊；北京的天气还可以呢 输出：0.0601554401",
            imgUrl: "https://res.wx.qq.com/mmspraiweb_node/dist/static/nlpagain/image/icon33.png"
        }, {
            url: "https://developers.weixin.qq.com/doc/aispeech/miniprogram/gec.html",
            title: "文本纠错",
            description: '文本纠错。输入是一个句子，输出是错误的字的position以及纠正后的词 举例： 输入：我们去学小上学 输出："pos": 4, "corrections": 校 tip: pos的下标是从0开始的',
            imgUrl: "https://res.wx.qq.com/mmspraiweb_node/dist/static/nlpagain/image/icon44.png"
        }, {
            url: "https://developers.weixin.qq.com/doc/aispeech/miniprogram/findsimilarwords.html",
            title: "寻找相似单词",
            description: "寻找相似单词。输入是一个单词，输出是与该单词相似的单词列表 举例： 输入：上海 输出：上海浦东, 天津, 上海市, 杭州, 苏州",
            imgUrl: "https://res.wx.qq.com/mmspraiweb_node/dist/static/nlpagain/image/icon55.png"
        }, {
            url: "https://developers.weixin.qq.com/doc/aispeech/miniprogram/wordsim.html",
            title: "词意相似度",
            description: "单词相似度计算。输入是两个单词，输出是两个单词的相似度 举例： 输入：上海；北京 输出：0.6184172034263611",
            imgUrl: "https://res.wx.qq.com/mmspraiweb_node/dist/static/nlpagain/image/icon66.png"
        }, {
            url: "https://developers.weixin.qq.com/doc/aispeech/miniprogram/cityservice.html",
            title: "服务检索",
            description: "接口的功能是提供查询语句返回符合要求的服务号信息列表，参数编码为utf8；返回结果为JSON格式，utf-8编码。 比如: 北京挂号",
            imgUrl: "https://res.wx.qq.com/mmspraiweb_node/dist/static/nlpagain/image/icon77.png"
        } ]
    },
    onLoad: function(i) {
        var t = this;
        wx.getSystemInfo({
            success: function(i) {
                var e = 0;
                e = i.system.indexOf("iOS") > -1 ? 44 : 48, t.setData({
                    windowWidth: i.windowWidth - 110,
                    backgroundHeight: i.windowHeight,
                    status: i.statusBarHeight,
                    navHeight: e,
                    statusBarHeight: i.statusBarHeight + e
                }, function() {
                    t.setData({
                        show: !0
                    });
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
    onShareAppMessage: function(i) {
        return i.from, {
            title: "NLP语义接口",
            path: "/pages/nlpSemantics/nlpSemantics",
            imageUrl: "https://res.wx.qq.com/mmspraiweb_node/dist/static/nlpapi/NLPBg.png"
        };
    },
    back: function() {
        !0 !== i.globalData.scene ? wx.navigateBack({
            delta: 1
        }) : wx.reLaunch({
            url: "/pages/home/home",
            success: function() {}
        });
    },
    goBlastDetail: function(i) {
        var t = i.currentTarget.dataset.item.url;
        wx.navigateTo({
            url: "/pages/webviewPage/webviewPage?url=" + t,
            success: function(i) {},
            fail: function(i) {},
            complete: function(i) {}
        });
    }
});