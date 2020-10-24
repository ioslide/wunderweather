var t = requirePlugin("chatRobot"), a = getApp();

import create from '../../../../../utils/create'
import store from '../../../../../store/index'

create(store, {
  data: {
    listData: [],
    show: !1,
    StatusBar: a.globalData.StatusBar,
    CustomBar: a.globalData.CustomBar,
    Custom: a.globalData.Custom,
    flag: !1,
    isActive: !0,
    getDataValue: !1,
    title: "",
    dynamicGuideList: !0,
    use:[
      'themeValue',
      'languageValue'
    ]
  },
  getQueryCallback: function (a) {
    var e = this, i = this.data.listData;
    i.push(a.detail), this.setData({
      listData: i
    }, function () {
      1 == e.data.listData.length && !0 === e.data.getDataValue && t.getChatComponent().send(e.data.sendData);
    });
  },
  goBackHome: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  onLoad: function (a) {
    var e = this;
    console.log(a), wx.getSystemInfo({
      success: function (t) {
        console.log(t.statusBarHeight);
        var a = 0;
        a = t.system.indexOf("iOS") > -1 ? 44 : 48, e.setData({
          windowWidth: t.windowWidth - 110,
          backgroundHeight: t.windowHeight,
          status: t.statusBarHeight,
          navHeight: a,
          statusBarHeight: t.statusBarHeight + a
        }, function () {
          e.setData({
            show: !0
          });
        });
      }
    });
    var i = t.getChatComponent();
    if (a && a.data) if (a && "switch" === a.data) this.setData({
      flag: !0,
      title: "语音开关展示"
    }); else if (a && "keyboard" === a.data) i.editFoucs(!0), this.setData({
      title: "默认展示"
    }); else if ("image" === a.data) i.send("图片回复"), this.setData({
      title: "图片"
    }); else if ("预订火车票" === a.data) {
      if (i.send("预订火车票"), this.setData({
        title: "预订火车票"
      }), a.guideList && "" !== a.guideList) {
        var s = JSON.parse(a.guideList);
        t.setGuideList(s);
      }
    } else if ("weather" === a.data) i.send("北京天气"), this.setData({
      title: "天气"
    }); else if ("我想测体质指数" === a.data || "算一下我的BMI体质指数是多少" === a.data || "我的身高175BMI体质指数是多少" === a.data) this.setData({
      title: "BMI"
    }), i.send(a.data); else if ("小微写诗" === a.data) {
      var n = "url('http://res.wx.qq.com/mmspraiweb_node/dist/static/xieshi/xiaoweiBackground.png') no-repeat scroll 0px 0px/100% " + (this.data.backgroundHeight - 120 + "px");
      if (this.setData({
        title: "小微写诗",
        showBackground: !0
      }), i.send(a.data), i.setBackground(n), a.guideList && "" !== a.guideList) {
        var o = JSON.parse(a.guideList);
        t.setGuideList(o);
      }
      a.query && "" !== a.query && this.setData({
        getDataValue: !0,
        sendData: a.query
      });
    } else i.send(a.data), a.data2 ? this.setData({
      flag: !1,
      getDataValue: !0,
      sendData: a.data2,
      title: a.data
    }) : this.setData({
      flag: !1,
      title: a.data
    }); else this.setData({
      flag: !1,
      title: "默认展示"
    });
  },
  onReady: function () { },
  onShow: function (t) { },
  onHide: function () { },
  onUnload: function () {
    a.setData("difference", ""), a.setData("mori", "");
  },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  backPage() {
    wx.navigateBack({
      delta: 1
    });
  },
  onShareAppMessage: function (t) {
    if ("小微写诗" === this.data.title) {
      var a = JSON.stringify(["一江春水连海平", "朋友", "故乡", "小微写诗"]);
      return t.from, {
        title: this.data.title,
        path: "/pages/pluginChat/pluginChat?data=" + this.data.title + "&&guideList=" + a,
        imageUrl:"https://weather.ioslide.com/weather/onShareAppMessage.png"
      };
    }
    if ("预订火车票" === this.data.title) {
      var e = JSON.stringify(["预订火车票"]);
      return t.from, {
        title: this.data.title,
        path: "/pages/pluginChat/pluginChat?data=" + this.data.title + "&&guideList=" + e,
        imageUrl:"https://weather.ioslide.com/weather/onShareAppMessage.png"
      };
    }
    return t.from, {
      title: "奇妙天气",
      path: "/pages/home/home",
      imageUrl:"https://weather.ioslide.com/weather/onShareAppMessage.png"
    };
  },
  open: function () {
    t.setTextToSpeech(!0), this.setData({
      isActive: !0
    });
  },
  close: function () {
    t.setTextToSpeech(!1), this.setData({
      isActive: !1
    });
  },
  back: function (t) {
    !0 !== a.globalData.scene ? this.goBackHome() : wx.reLaunch({
      url: "/pages/home/home",
      success: function () {
        a.setData("scene", !1), a.setData("difference", "");
      }
    });
  }
});