"use strict";
var transHexOtTgb = require("../../assets/lib/transHexOrRgb/transHexOrRgb");
var scRippleBehaviors = require("../sc-ripple-behaviors/sc-ripple-behaviors.js");

var log = console.log.bind(console)

Component({
  options: { multipleSlots: !0 },
  behaviors: [scRippleBehaviors],

  properties:
  {
    iconValue:{type:String,value:null},
    subHeader: { type: String },
    checked: { type: Boolean, value: !1 },
    disabled: { type: Boolean, value: !1 },
    label: { type: String },
    value: { type: null },
    color: { type: String, value: "#FEBE55" },
    reverse: { type: Boolean, value: !1 },
    ripple: { type: Boolean, value: !0 }
  },
  data: { checked: !1, clicked: !1, showRipple: !1, disabled: !1, value: null,iconValue:null },
  ready: function () {
    this.setData({
      iconValue:"https://weather.ioslide.com/weather/icon/all" + this.properties.iconValue + ".svg",
      checked:
        this.properties.checked,
      disabled: this.properties.disabled,
      value: this.properties.value
    })
  },
  relations: {
    "../scRadioGroup/sc-radio-group": { type: "parent" },
    "../scCellGroup/sc-cell-group": { type: "parent" }
  },
  externalClasses: ["sc-class", "sc-class", "left-icon", "right-icon"],
  methods: {

    _tap: function (e) {
      this._addRipple_(e)
      var t = this
      t.store.data.modalName = null
    },
    _longPress: function (e) {
      this._longPress_(e)
    },
    _rippleAnimationEnd: function () {
      this._rippleAnimationEnd_()
    },
    _touchEnd: function () {
      this._touchEnd_()
    },
    _changeRadio: function (e) {
      // log(e)
      var t = this
      if (t.data.checked == !1) {
        t.setData(
          {
            checked: !0, clicked: !0, showRipple: !0
          }
        ),
          t.triggerEvent("radiochange",
            {
              value: t.properties.value
            },
            { bubbles: !0, composed: !0 })
      } else {
        t.setData(
          {
            checked: !1, clicked: !1, showRipple: !1
          }
        ),
          t.triggerEvent("radiochange",
            {
              value: t.properties.value
            },
            { bubbles: !1, composed: !1 })
      }
    },
    _animationend: function () {
      this.setData({ showRipple: !1 })
    }
  }
});