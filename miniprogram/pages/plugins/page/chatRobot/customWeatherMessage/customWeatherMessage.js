var e = requirePlugin("chatRobot"),
    t = require("../base/date.js"),
    i = require("../base/weather.js");

Component({
    properties: {
        msg: Object
    },
    data: {
        weatherDis: {},
        weatherArray: [],
        locationInfo: "",
        dateTime: "",
        weekTime: "",
        weatherImg: "qing",
        mintp: 0,
        maxtp: 0,
        nowtp: 0,
        weatherName: "",
        queryBMIList: [{
            url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/pluginimage/iconOne.png",
            description: "北京今天空气质量"
        }, {
            url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/pluginimage/HealthyIcon.png",
            description: "北京今日防晒指数"
        }, {
            url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/pluginimage/iconTwo.png",
            description: "北京明天的天气"
        }]
    },
    lifetimes: {
        ready: function () {
            console.log(this.properties.msg, "---weather---");
            var e = this.properties.msg,
                r = e.docs,
                s = [],
                a = {},
                o = "";
            this.properties.msg && this.properties.msg.res && this.properties.msg.res.slots_info && 0 !== this.properties.msg.res.slots_info.length ;
            for (var n = 1; n <= 6; n++) s.push(r.data[n]);
            for (var m = 0; m < s.length; m++)
                if (s[m].dateTime = t.dateTimeFormat(s[m].date),
                    s[m].week = t.date2Week(s[m].date), s[m].picture = i.chinese2letter(s[m].condition)) {
                    a.dateTime = t.dateTimeFormat(s[m].date), 
                    a.week = t.date2Week(s[m].date), 
                    a.picture = i.chinese2letter(s[m].condition),
                    a.min_tp = s[m].min_tp, a.max_tp = s[m].max_tp;
                    var p = Math.floor((Number(s[m].min_tp) + Number(s[m].max_tp)) / 2);
                    a.tp = p, a.condition = s[m].condition;
                }
                console.log(s)
            var d = a.min_tp,
                c = a.max_tp,
                h = a.tp,
                g = a.dateTime,
                w = a.week,
                l = a.picture,
                u = a.condition;
            this.setData({
                weatherDis: e,
                weatherArray: s,
                dateTime: g,
                weekTime: w,
                mintp: d,
                maxtp: c,
                nowtp: h,
                weatherName: u,
                weatherImg: l
            });
        }
    },
    methods: {
        send: function (t) {
            e.getChatComponent().send(t.currentTarget.dataset.item.description);
        }
    }
});