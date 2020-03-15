"use strict";
var scRippleBehaviors = require("../sc-ripple-behaviors/sc-ripple-behaviors");
Component({
  behaviors: [scRippleBehaviors],
  properties: {
    reportSubmit: {
      type: Boolean,
      value: !1
    },
    submitText: {
      type: String
    },
    showSubmit: {
      type: Boolean,
      value: !0
    }
  },
  relations: {
    "../scButton/sc-button": {
      type: "child"
    },
    "../scCheckboxGroup/sc-checkbox-group": {
      type: "child"
    },
    "../scInput/sc-input": {
      type: "child"
    },
    "../scTextarea/sc-textarea": {
      type: "child"
    },
    "../scSwitch/sc-switch": {
      type: "child"
    },
    "../scRadioGroup/sc-radio-group": {
      type: "child"
    }
  },
  data: {
    btnSelector: ".submit-btn-class"
  },
  externalClasses: ["sc-class", "sc-button-class"],
  ready: function () {
    this.formControllers = this._getAllControl()
  },
  methods: {
    _getAllControl: function () {
      return {
        checkboxGroups: this.getRelationNodes("../scCheckboxGroup/sc-checkbox-group"),
        inputs: this.getRelationNodes("../scInput/sc-input"),
        textareas: this.getRelationNodes("../scTextarea/sc-textarea"),
        switchs: this.getRelationNodes("../scSwitch/sc-switch"),
        radioGroups: this.getRelationNodes("../scRadioGroup/sc-radio-group")
      }
    },
    _formSubmit: function (t) {
      var e = this.formControllers,
        s = {
          formId: t.detail.formId
        };
      for (var o in e) e.hasOwnProperty(o) && e[o].length > 0 && e[o].forEach(function (t) {
        s[t.data.name] = t.data.value || null
      });
      this.triggerEvent("submit", {
        value: s
      })
    },
    _tap: function (t) {
      this._addRipple_(t)
    },
    _longPress: function (t) {
      this._longPress_(t)
    },
    _rippleAnimationEnd: function () {
      this._rippleAnimationEnd_()
    },
    _touchEnd: function () {
      this._touchEnd_()
    }
  }
});