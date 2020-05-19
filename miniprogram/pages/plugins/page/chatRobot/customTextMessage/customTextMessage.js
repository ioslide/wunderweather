var t = requirePlugin("chatRobot"), s = getApp();

Component({
  properties: {
    msg: Object
  },
  data: {
    imageArray: [{
      url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/openaiplugin/img/bg1.png"
    }, {
      url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/openaiplugin/img/bg2.png"
    }, {
      url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/openaiplugin/img/bg3.png"
    }, {
      url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/openaiplugin/img/bg4.png"
    }, {
      url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/openaiplugin/img/bg5.png"
    }],
    imgArr: [{
      url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/openaiplugin/img/btn1.png"
    }, {
      url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/openaiplugin/img/btn2.png"
    }, {
      url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/openaiplugin/img/btn3.png"
    }],
    url: "",
    flag: !1,
    listMR: [],
    score: 0,
    answer: "",
    list: [],
    isRich: !1,
    showSlot: !1,
    showFromLocation: !1,
    showToLocation: !1,
    candidates: [],
    fromArray: [],
    toArray: [],
    fromValue: "",
    toValue: "",
    fromIndex: -1,
    toIndex: -1,
    disabled: !1
  },
  lifetimes: {
    ready: function () {
      var e = this, i = {
        qqface: ["微笑", "撇嘴", "色", "发呆", "得意", "流泪", "害羞", "闭嘴", "睡", "大哭", "尴尬", "发怒", "调皮", "呲牙", "惊讶", "难过", "酷", "冷汗", "抓狂", "吐", "偷笑", "愉快", "白眼", "傲慢", "饥饿", "困", "惊恐", "流汗", "憨笑", "悠闲", "奋斗", "咒骂", "疑问", "嘘", "晕", "疯了", "衰", "骷髅", "敲打", "再见", "擦汗", "抠鼻", "鼓掌", "糗大了", "坏笑", "左哼哼", "右哼哼", "哈欠", "鄙视", "委屈", "快哭了", "阴险", "亲亲", "吓", "可怜", "菜刀", "西瓜", "啤酒", "篮球", "乒乓", "咖啡", "饭", "猪头", "玫瑰", "凋谢", "嘴唇", "爱心", "心碎", "蛋糕", "闪电", "炸弹", "刀", "足球", "瓢虫", "便便", "月亮", "太阳", "礼物", "拥抱", "强", "弱", "握手", "胜利", "抱拳", "勾引", "拳头", "差劲", "爱你", "NO", "OK", "爱情", "飞吻", "跳跳", "发抖", "怄火", "转圈", "磕头", "回头", "跳绳", "投降", "激动", "乱舞", "献吻", "左太极", "右太极"]
      }, o = this.properties.msg, a = this.properties.msg.content, r = t.getChatComponent(), n = o.content.replace(/.*评分\s*[:：]\s*(\d*)/, "$1");
      if ("预订火车票" === this.properties.msg.res.title) {
        this.properties.msg.res && this.properties.msg.res.options && r.setGuideList([]),
          this.setData({
            reserve: !0
          });
        var p = !1, l = [], c = !1, m = !1;
        if (this.properties.msg.res.slots_info) {
          var g = this.properties.msg.res.slots_info[0];
          if (g) {
            var h = g.slot_name, d = g.slot_value.split(":")[0];
            if ("_call_back_" == h && "SlotAsk" == d) {
              var u = this.properties.msg.res.slots_info[1];
              "_stoask_" == u.slot_name && "目的地" == u.slot_value ? m = !0 : "_stoask_" == u.slot_name && "出发地" == u.slot_value && (c = !0),
                /^已为您预/.test(this.properties.msg.content) && (m = !1, c = !1);
            } else if ("_call_back_" == h && "DynamicListSelection" == d) {
              var w = this.properties.msg.res.slots_info[1];
              p = !!(l = JSON.parse(w.slot_value).data_list_candidates).length;
            } else /^已为您预/.test(this.properties.msg.content) && (m = !1, c = !1);
          }
        }
        /\[([^\]]*)\]/.test(a) && (a = a.replace(/\[([^\]]*)\]/g, function (t, s) {
          var o = i.qqface.indexOf(s);
          return o > -1 ? '<span class="ai-qqemoji" style="background-position: ' + e.getFacePosition(o) + '">' + s + "</span>" : t;
        })), /<a.*>|<span.*>/.test(a) ? this.setData({
          isRich: !0,
          answer: a,
          showSlot: p,
          candidates: l,
          showToLocation: m,
          showFromLocation: c
        }) : p ? this.setData({
          isRich: !1,
          showSlot: p,
          candidates: l,
          showToLocation: !1,
          showFromLocation: !1
        }) : c ? this.setData({
          isRich: !1,
          showSlot: !1,
          showToLocation: !1,
          showFromLocation: !0
        }) : m ? this.setData({
          isRich: !1,
          showSlot: !1,
          showToLocation: !0,
          showFromLocation: !1
        }) : this.setData({
          isRich: !1,
          answer: a,
          showSlot: p,
          candidates: l,
          showToLocation: m,
          showFromLocation: c
        }, function () {
          t.getChatComponent().scrollToNew();
        });
      }
      if (this.properties.msg && this.properties.msg.res && "写诗" === this.properties.msg.res.title && "小微写诗" === s.getData()) {
        var f = a.split("\n"), _ = [];
        f.forEach(function (t, s) {
          0 === s && (t = "<img class='marks1' src='http://res.wx.qq.com/mmspraiweb_node/dist/static/xieshi/symbol_left.png'></img>" + t),
            s === f.length - 1 && (t += "<img class='marks2' src='http://res.wx.qq.com/mmspraiweb_node/dist/static/xieshi/symbol_right.png'></img>"),
            _.push(t);
        }), this.setData({
          arr: _,
          query: this.properties.msg.res.slots_info[1].slot_value,
          xiaoweiValue: !0
        });
      }
      /\[([^\]]*)\]/.test(a) && (a = a.replace(/\[([^\]]*)\]/g, function (t, s) {
        var o = i.qqface.indexOf(s);
        return o > -1 ? '<span class="ai-qqemoji" style="background-position: ' + e.getFacePosition(o) + '">' + s + "</span>" : t;
      }));
      var q = [];
      if (/<a.*href=["']http(s)?:\/\/.*["']>.*<\/a>/g.test(a) && (a = a.replace(/(<a.*?href=["'](https?[^"']*).*?>([^<]*?)<\/a>)/g, function (t, s, e, i) {
        return q.push({
          name: i,
          href: e
        }), "<a>" + i + "</a>";
      }), this.setData({
        linkArr: q
      })), this.properties.msg && this.properties.msg.res && this.properties.msg.res.options && this.setData({
        optionsValue: !0,
        options: this.properties.msg.res.options
      }), console.log("content", a), /<a.*>|<span.*>/.test(a) && this.setData({
        isRitch: !0,
        answer: a
      }), -1 !== o.content.indexOf("评分")) return -1 !== o.content.indexOf("100") ? e.setData({
        flag: !0,
        url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/openaiplugin/img/win.png",
        score: 100
      }) : e.setData({
        flag: !0,
        url: "https://res.wx.qq.com/mmspraiweb_node/dist/static/openaiplugin/img/dead.png",
        score: n
      }), void r.scrollToNew();
      o.res && o.res.options && 0 !== o.res.options.length && "末日生存测试" === o.res.title && (o.res.options.forEach(function (t, s) {
        t.url = e.data.imgArr[s].url;
      }), e.setData({
        flag: !0,
        url: e.data.imageArray[Math.floor(Math.random() * e.data.imageArray.length)].url,
        listMR: o.res.options
      })), r.scrollToNew();
    }
  },
  methods: {
    choose: function (s) {
      t.getChatComponent().send(s.currentTarget.dataset.title);
    },
    getFacePosition: function (t) {
      var s = Math.floor(t / 15);
      return -24 * (t - 15 * s) + "px " + -24 * s + "px";
    },
    tap: function (t) {
      var s = t.currentTarget.dataset.weburl;
      wx.navigateTo({
        url: "/pages/webviewPage/webviewPage?url=" + s
      });
    },
    sendMsg: function (s) {
      if (!this.data.disabled) {
        var e = s.currentTarget.dataset.index;
        t.getChatComponent().send(e + 1, {
          silence: !0
        }), this.setData({
          disabled: !0
        });
      }
    },
    bindFromPickerChange: function (s) {
      this.setData({
        fromIndex: s.detail.value,
        fromArray: s.detail.value
      });
      t.getChatComponent().send(this.data.fromArray[1])
    },
    bindToPickerChange: function (s) {
      this.setData({
        toIndex: s.detail.value,
        toArray: s.detail.value
      });
      t.getChatComponent().send(this.data.toArray[1])
    },
    choosemicroVision: function (s) {
      t.getChatComponent().send(s.currentTarget.dataset.title);
    }
  }
});