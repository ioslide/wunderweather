"use strict";
var checkboxGroupCount = 1;
Component({
  properties: {},
  data: {
    value: []
  },
  relations: {
    "../scCell/sc-cell": {
      type: "child"
    }
  },
  externalClasses: ["sc-class"],
  ready: function () {
    this.items = this._getAllCheckboxs()
  },
  methods: {
    _getAllCheckboxs: function () {
      return this.getRelationNodes("../scCell/sc-cell")
    }
  }
});