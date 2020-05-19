Component({
  properties: {
      msg: Object,
      robotHeader: String,
      userName: String
  },
  data: {
      list: []
  },
  lifetimes: {
      ready: function() {
          var t = this.properties.msg.content;
          (function(t) {
              return "[object Array]" == Object.prototype.toString.call(t);
          })(t) && this.setData({
              welcomeArray: !0,
              list: t
          });
      },
      methods: {}
  }
});