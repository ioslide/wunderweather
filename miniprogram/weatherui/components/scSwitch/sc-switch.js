"use strict";
var swicthCount = 1;
Component({
  properties: {
    checked: {
      type: Boolean,
      value: !1
    },
    disabled: {
      type: Boolean,
      value: !1
    },
    name: {
      type: String
    },
    color: {
      type: String,
      value: "#FEBE54"
    },
    ripple: {
      type: Boolean,
      value: !0
    },
    themeValue:{
      type: String,
      value: ""
    }
  },
  data: {
    checked: !1,
    clicked: !1,
    value: null
  },
  attached:function(){
    var e = this.properties
    this.setData({
      themeValue:e.themeValue
    })
  },
  ready: function () {
    var 
      e = this.properties,
      t = e.checked,
      a = e.name,
      c = void 0 === a ? "switch" + swicthCount++ : a;
    this.setData({
      checked: t,
      value: t,
      name: c,
    })
  },
  relations: {
    "../scForm/sc-form": {
      type: "parent"
    }
  },
  externalClasses: ["sc-class"],
  methods: {
    _changeSwitch: function () {
      var e = this.data,
        t = e.checked,
        a = e.name;
      t = !t,
        this.setData({
          checked: t,
          clicked: !0,
          value: t
        }), 
        this.triggerEvent("change", {
          name: a,
          value: t
        }, {
          bubbles: !0
        })
    },
    _animationend: function () {
      this.setData({
        clicked: !1
      })
    }
  }
});