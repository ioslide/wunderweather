"use strict";
var radioGroupCount = 1;
import create from '../../../utils/create'
import store from '../../../store/index'

create.Component(store,{
  properties: {
    name: {
      type: String
    },
    direction: {
      type: String,
      value: "row"
    }
  },
  data: {
    value: null,
    use: ['themeValue']
  },
  relations: {
    "../scRadio/sc-radio": {
      type: "child"
    },
    "../scForm/sc-form": {
      type: "parent"
    }
  },
  externalClasses: ["sc-class"],
  ready: function () {
    this.items = this._getAllRadios(), this.setData({
      name: this.properties.name || "radioGroup" + radioGroupCount++
    });
    var t = !0,
      a = !1,
      e = void 0;
    try {
      for (var r, i = this.items[Symbol.iterator](); !(t = (r = i.next()).done); t = !0) {
        var o = r.value;
        o.data.checked && this.setData({
          value: o.data.value
        })
      }
    } catch (t) {
      a = !0, e = t
    } finally {
      try {
        !t && i.return && i.return()
      } finally {
        if (a) throw e
      }
    }
  },
  methods: {
    _getAllRadios: function () {
      return this.getRelationNodes("../scRadio/sc-radio")
    },
    _radioChange: function (t) {
      var a = !0,
        e = !1,
        r = void 0;
      try {
        for (var i, o = this.items[Symbol.iterator](); !(a = (i = o.next()).done); a = !0) {
          var s = i.value;
          if (s.data.clicked) {
            s.setData({
              clicked: !1
            });
            var n = this.data.value = s.data.value;
            this.triggerEvent("change", {
              value: n
            })
          } else s.data.disabled || s.setData({
            checked: !1
          })
        }
      } catch (t) {
        e = !0, r = t
      } finally {
        try {
          !a && o.return && o.return()
        } finally {
          if (e) throw r
        }
      }
    }
  }
});