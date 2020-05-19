var t = requirePlugin("chatRobot"), e = wx.getBackgroundAudioManager(), i = getApp();

Page({
    data: {
        title: "微信对话开放平台",
        info: "微信对话开放平台是以对话交互为核心, 为有客服需求的个人、企业和组织提供智能业务服务与用户管理能力的技能配置平台, 技能开发者可利用我们提供的工具自主完成客服机器人的搭建。",
        weatherCardList: [ {
            title: "北京天气"
        }, {
            title: "北京今日防晒指数"
        }, {
            title: "上海天气"
        }, {
            title: "北京今日空气质量"
        }, {
            title: "北京今日风向"
        }, {
            title: "北京今日防晒指数"
        }, {
            title: "上海今日防晒指数"
        } ],
        cardList: [ {
            title: "聊天",
            content: "中午吃啥呢 你知道如何排解压力吗",
            url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/pluginimage/chatIcon.png"
        }, {
            title: "天气",
            content: "查询国内外主要城市的温度、风力、污染",
            url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/pluginimage/weatherIcon.png"
        }, {
            title: "百科",
            content: "北京今天天气如何 今天有雨吗",
            url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/pluginimage/encyclopedias.png"
        }, {
            title: "小微写诗",
            content: "一起畅游诗歌的海洋",
            url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/pluginimage/idiom.png"
        }, {
            title: "预订火车票",
            content: "",
            url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/huoche/image/trainicon.png"
        }, {
            title: "查询电影评分",
            content: "",
            url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/veishi/searchmovie.png"
        } ],
        queryBMIList: [ {
            url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/pluginimage/iconOne.png",
            title: "“我想测体质指数”"
        }, {
            url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/pluginimage/HealthyIcon.png",
            title: "“算一下我的BMI体质指数是多少”"
        }, {
            url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/pluginimage/iconTwo.png",
            title: "“我的身高175BMI体质指数是多少”"
        } ],
        weatherGuideList: [ "北京天气", "上海天气", "广州天气", "深圳天气", "沈阳天气", "杭州天气" ],
        chatGuideList: [ "你早上吃什么", "你在干嘛", "想我了吗", "你知道如何排解压力吗" ],
        encyclopediasGuideList: [ "珠穆朗玛峰", "喜马拉雅山", "长江", "黄河", "中国的面积" ],
        idiomGuideList: [ {
            title: "开怀畅饮"
        }, {
            title: "一了百了"
        }, {
            title: "李白桃红"
        }, {
            title: "热肠古道"
        }, {
            title: "道傍苦李"
        }, {
            title: "十全十美"
        }, {
            title: "事败垂成"
        }, {
            title: "成败得失"
        }, {
            title: "九牛一毛"
        } ],
        defaultGuideList: [ "北京天气怎么样", "上海今天有雨吗", "中午吃啥呢", "你知道如何排解压力吗", "法国国土面积是多少", "世界最高峰" ],
        garbageCardList: [ {
            title: "垃圾分类查询"
        }, {
            title: "苹果是什么垃圾"
        }, {
            title: "干垃圾"
        }, {
            title: "珍珠奶茶是什么垃圾"
        }, {
            title: "笔记本电脑是什么垃圾"
        }, {
            title: "秋裤是什么垃圾"
        }, {
            title: "水杯是什么垃圾"
        } ],
        gameList: [ {
            url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/pluginimage/iconOne.png",
            title: "“玩末日生存游戏”"
        }, {
            url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/pluginimage/HealthyIcon.png",
            title: "“我想玩猜拳游戏”"
        }, {
            url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/pluginimage/iconTwo.png",
            title: "“我想写诗”"
        } ],
        chatTitle: {
            title: "chat"
        },
        encyclopediasTitle: {
            title: "encyclopedias"
        },
        background: [ {
            bgUrl: "https://res.wx.qq.com/mmspraiweb_node/dist/static/pluginimage/bannerCard.png"
        }, {
            bgUrl: "https://res.wx.qq.com/mmspraiweb_node/dist/static/pluginimage/iconTwo.png"
        } ],
        xiaoweixieshiTitle: {
            title: "xiaoweixieshi"
        }
    },
    onLoad: function(t) {
        var e = this;
        wx.getSystemInfo({
            success: function(t) {
                var i = 0;
                i = t.system.indexOf("iOS") > -1 ? 44 : 48, e.setData({
                    windowHeight: t.windowHeight,
                    infoheight: 277 * t.windowWidth / 375,
                    weatherheight: 235 * (t.windowWidth - 34) / 341,
                    status: t.statusBarHeight,
                    navHeight: i,
                    statusBarHeight: t.statusBarHeight + i
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        e.stop();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function(t) {
        return t.from, {
            title: "示例小程序",
            path: "/pages/home/home",
            imageUrl: "https://res.wx.qq.com/mmspraiweb_node/dist/static/openaiplugin/img/forward.png"
        };
    },
    goChat: function(t) {
        console.log(t), "聊天" === t.currentTarget.dataset.item.title || "chat" === t.currentTarget.dataset.item.title ? this.goChatCard(t) : "天气" === t.currentTarget.dataset.item.title ? this.goWeatherCard(t) : "小微写诗" === t.currentTarget.dataset.item.title ? this.goXiaoWeiXieShi(t) : "百科" === t.currentTarget.dataset.item.title || "encyclopedias" === t.currentTarget.dataset.item.title ? this.goEncyclopedias(t) : "xiaoweixieshi" === t.currentTarget.dataset.item.title ? this.goXiaoWeiXieShi(t) : "预订火车票" === t.currentTarget.dataset.item.title ? this.reserve(t) : "查询电影评分" === t.currentTarget.dataset.item.title && this.goSearchMovie(t);
    },
    gotoPure: function(t) {
        wx.navigateTo({
            url: "../pure/pure",
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    gotoChat: function(e) {
        console.log(e), "keyboard" === e.currentTarget.dataset.item ? this.jump("keyboard") : this.jump(), 
        t.setGuideList(this.data.defaultGuideList), t.setTextToSpeech(!0);
    },
    gotoChatNoUI: function() {
        wx.navigateTo({
            url: "../noUI/noUI",
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    gotoChatcloseVoice: function() {
        t.setGuideList(this.data.defaultGuideList), t.setTextToSpeech(!0), this.jump("switch");
    },
    goWebview: function() {
        wx.navigateTo({
            url: "../about/about",
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    gotoChatCom: function(e) {
        this.jump(), t.setTextToSpeech(!0), t.setGuideList(this.data.defaultGuideList);
    },
    goImageCom: function() {
        this.jump("image"), t.setTextToSpeech(!0), t.setGuideList(this.data.defaultGuideList);
    },
    goweatherCom: function() {
        this.jump("weather"), t.setTextToSpeech(!0), t.setGuideList(this.data.defaultGuideList);
    },
    jump: function(t, e) {
        if (t) {
            var i = "";
            t && !e ? i = "../pluginChat/pluginChat?data=" + t : t && e && (i = "../pluginChat/pluginChat?data=" + t + "&data2=" + e), 
            wx.navigateTo({
                url: i,
                success: function(t) {},
                fail: function(t) {},
                complete: function(t) {}
            });
        } else wx.navigateTo({
            url: "../pluginChat/pluginChat",
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    goChatCard: function(e) {
        this.jump("聊天"), t.setGuideList(this.data.chatGuideList), t.setTextToSpeech(!0);
    },
    goWeatherCard: function(e) {
        var i = [ "北京天气", "北京今日防晒指数", "上海天气", "北京今日空气质量", "北京今日风向", "上海今日空气质量", "上海今日防晒指数" ];
        this.data.weatherCardList.find(function(t) {
            if (t.title === e.currentTarget.dataset.item.title) return !0;
        }) ? (t.setGuideList(i), this.jump("天气", e.currentTarget.dataset.item.title), t.setTextToSpeech(!0)) : (t.setGuideList(i), 
        this.jump("天气"));
    },
    goBMI: function(e) {
        if (this.data.queryBMIList.find(function(t) {
            if (t.title === e.currentTarget.dataset.item.title) return !0;
        })) {
            var i = "", a = [ "我想测体质指数", "算一下我的BMI体质指数是多少", "我的身高175BMI体质指数是多少" ];
            "“我想测体质指数”" === e.currentTarget.dataset.item.title && (i = "我想测体质指数"), "“算一下我的BMI体质指数是多少”" === e.currentTarget.dataset.item.title && (i = "算一下我的BMI体质指数是多少"), 
            "“我的身高175BMI体质指数是多少”" === e.currentTarget.dataset.item.title && (i = "我的身高175BMI体质指数是多少"), 
            this.jump(i), t.setGuideList(a), t.setTextToSpeech(!0);
        }
    },
    goGarbage: function(e) {
        if (this.data.garbageCardList.find(function(t) {
            if (t.title === e.currentTarget.dataset.item.title) return !0;
        })) {
            var i = [ "垃圾分类查询", "退出垃圾分类查询", "苹果是什么垃圾", "干垃圾", "珍珠奶茶是什么垃圾", "笔记本电脑是什么垃圾", "秋裤是什么垃圾", "水杯是什么垃圾", "退出垃圾分类查询" ];
            t.setGuideList(i), this.jump("垃圾分类查询", e.currentTarget.dataset.item.title), t.setTextToSpeech(!0);
        }
    },
    goGame: function(e) {
        if (this.data.gameList.find(function(t) {
            if (t.title === e.currentTarget.dataset.item.title) return !0;
        })) {
            var a = "";
            "“玩末日生存游戏”" === e.currentTarget.dataset.item.title && (i.setData("mori", "mori"), 
            a = "玩末日生存游戏", t.setGuideList([ "玩末日生存游戏" ])), "“我想玩猜拳游戏”" === e.currentTarget.dataset.item.title && (a = "猜拳", 
            t.setGuideList([ "剪刀", "石头", "布", "不玩了", "猜拳" ])), "“我想写诗”" === e.currentTarget.dataset.item.title && (a = "小微写诗", 
            t.setGuideList([ "请用朋友写一首诗", "帮我用白羊座写一首诗", "能不能用故乡写一首诗", "可以用北京写一首诗" ]), i.setData("difference", "小微写诗")), 
            this.jump(a), t.setTextToSpeech(!0);
        }
    },
    goIdiom: function(e) {
        if (this.data.idiomGuideList.find(function(t) {
            if (t.title === e.currentTarget.dataset.item.title) return !0;
        }) || "成语接龙" === e.currentTarget.dataset.item.title) {
            var i = [ "准备好了", "退出游戏", "开怀畅饮", "一了百了", "李白桃红", "热肠古道", "道傍苦李", "十全十美", "事败垂成", "成败得失", "九牛一毛" ];
            t.setGuideList(i), this.jump("成语接龙"), t.setTextToSpeech(!0);
        }
    },
    goEncyclopedias: function(e) {
        t.setGuideList(this.data.encyclopediasGuideList), this.jump("百科"), t.setTextToSpeech(!0);
    },
    catchtapdooms: function(e) {
        console.log("---------------------");
        i.setData("mori", "mori"), t.setGuideList([ "玩末日生存游戏" ]), this.jump("玩末日生存游戏"), 
        t.setTextToSpeech(!0);
    },
    goXiaoWeiXieShi: function(e) {
        t.setGuideList([ "请用朋友写一首诗", "帮我用白羊座写一首诗", "能不能用水果写一首诗", "可以用北京写一首诗" ]), i.setData("difference", "小微写诗"), 
        this.jump("小微写诗"), t.setTextToSpeech(!0);
    },
    reserve: function(e) {
        t.setGuideList([ "预订火车票" ]), i.setData("reserveTrain", !0), this.jump("预订火车票"), 
        t.setTextToSpeech(!1);
    },
    goNLP: function() {
        wx.navigateTo({
            url: "/pages/nlpSemantics/nlpSemantics",
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    goBlast: function() {
        wx.navigateTo({
            url: "/pages/blast-detail/blast-detail",
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    goMicroVision: function() {
        t.setGuideList([ "我想看视频", "有什么好玩的短视频", "去北京旅游怎么样", "哈尔滨怎么样", "我想看王宝强的短视频" ]), this.jump("微视短视频"), 
        t.setTextToSpeech(!1);
    },
    goSearchMovie: function() {
        t.setGuideList([ "帮我查一下中国机长的电影评分", "我想查询流浪地球的评分" ]), this.jump("查询电影评分"), t.setTextToSpeech(!1);
    }
});