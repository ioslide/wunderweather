"use strict";
var scRippleBehaviors = require("../sc-ripple-behaviors/sc-ripple-behaviors");
Component({
  behaviors: [scRippleBehaviors],
  properties: {
    openType: {
      type: String
    },
    size: {
      type: String,
      value: "default"
    },
    plain: {
      type: Boolean,
      value: !1
    },
    disabled: {
      type: Boolean,
      value: !1
    },
    loading: {
      type: Boolean,
      value: !1
    },
    hoverClass: {
      type: String,
      value: ""
    },
    hoverStopPropagation: {
      type: Boolean,
      value: !1
    },
    hoverStartTime: {
      type: Number,
      value: 20
    },
    hoverStayTime: {
      type: Number,
      value: 70
    },
    formType: {
      type: String
    },
    appParameter: {
      type: String
    },
    sessionFrom: {
      type: String
    },
    sendMessageTitle: {
      type: String
    },
    sendMessagePath: {
      type: String
    },
    handleContact: {
      type: String
    },
    sendMessageCard: {
      type: Boolean,
      value: !1
    },
    flat: {
      type: Boolean,
      value: !1
    },
    circle: {
      type: Boolean,
      value: !1
    },
    square:{
      type: Boolean,
      value: !1
    },
    round: {
      type: Boolean,
      value: !1
    },
    raised: {
      type: Boolean,
      value: !1
    },
    fab: {
      type: Boolean,
      value: !1
    },
    icon:{
      type:String,
      value: 'null'
    }
  },
  data: {
    openTypeToBindEvent: {
      getUserInfo: "getuserinfo",
      getphonenumber: "getphonenumber",
      launchApp: "error",
      contact: "contact"
    },
    tap: !1
  },
  relations: {
    "../scForm/sc-form": {
      type: "parent"
    }
  },
  externalClasses: ["sc-class", "sc-ripple-class"],
  methods: {
    _returnEventData: function (e) {
      console.log("" + this.data.openTypeToBindEvent[this.properties.openType], e.detail, {})
      this.properties.disabled || this.triggerEvent("" + this.data.openTypeToBindEvent[this.properties.openType], e.detail, {})
    },
    _tap: function (e) {
      this._addRipple_(e), this.setData({
        tap: !0
      })
    },
    _longPress: function (e) {
      this._longPress_(e), this.setData({
        tap: !0
      })
    },
    _rippleAnimationEnd: function () {
      this._rippleAnimationEnd_()
    },
    _tapNextScreen:function(){

    },
    _touchEnd: function () {
      var e = this;
      this._touchEnd_(), setTimeout(function () {
        e.setData({
          tap: !1
        })
      }, 150)
    }
  }
});