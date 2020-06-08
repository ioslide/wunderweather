"use strict";
var scRippleBehaviors = require("../sc-ripple-behaviors/sc-ripple-behaviors");
const log = console.log.bind(console)
const app = getApp()
import create from '../../../utils/create'
import store from '../../../store/index'

// Component({
create.Component(store,{
  options: {
    multipleSlots: !0
  },
  data:{
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    use: ['themeValue']
  },
  behaviors: [scRippleBehaviors],
  properties: {
    subHeader: {
      type: String
    },
    themeValue: {
      type: String,
      value: "light"
    },
    switch: {
      type: Boolean,
      value: !1
    },
    subheader1Padding:{
      type:Number,
      value:0
    },
    subbottomPadding:{
      type:Number,
      value:0
    },
    cellHeight:{
      type:Number,
      value:60
    }
    // switchTarget: {
    //   type: String,
    //   value: ''
    // },
    // checked:{
    //   type:Boolean,
    //   value:!0
    // }
  },
  relations: {
    "../scCellGroup/sc-cell-group": {
      type: "parent"
    }
  },
  lifetimes: {
    attached: function () {
      const t = this
      let e = t.properties
      // style = t.store.data.style
      // console.log(e.switchTarget,style[e.switchTarget],t.store.data.style)
      t.setData({
        themeValue: e.themeValue,
        switch: e.switch,
        cellHeight:e.cellHeight,
        subheader1Padding:e.subheader1Padding,
        subbottomPadding:e.subbottomPadding
        // switchTarget: e.switchTarget
        // checked: style[e.switchTarget]
      })
    },
    moved: function () { },
    detached: function () { },
  },
  pageLifetimes: {
    show: function () { 
      log(this.data)
    },
    hide: function () { },
    resize: function () { },
  },
  externalClasses: ["sc-class", "left-icon", "right-icon"],
  methods: {
    _tap: function (e) {
      this._addRipple_(e)
    },
    _longPress: function (e) {
      this._longPress_(e)
    },
    _rippleAnimationEnd: function () {
      this._rippleAnimationEnd_()
    },
    _touchEnd: function () {
      this._touchEnd_()
    }
  }
});