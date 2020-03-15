"use strict";
Component({
  properties: {
    value: {
      type: null
    }
  },
  data: {
    checked: !1,
    clicked: !1,
    showRipple: !1,
    disabled: !1,
    value: null
  },
  ready: function () {
    this.setData({
      checked: this.properties.checked,
      disabled: this.properties.disabled,
      value: this.properties.value
    })
  },
  relations: {
    "../scSelect/sc-select": {
      type: "parent"
    }
  },
  externalClasses: ["sc-class"],
  methods: {}
});