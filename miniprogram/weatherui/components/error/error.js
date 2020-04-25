// !function(t) {
//     if (t && t.__esModule) return t;
//     var e = {};
//     if (null != t) for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
//     e.default = t;
// }(require("../../utils/wxapi.js"));

// var t = require("../common/component"), e = getApp();

// (0, t.MyComponent)({
//     props: {
//         icon: String,
//         title: String,
//         buttonText: String
//     },
//     data: {
//         darkMode: null
//     },
//     watch: {
//         change: function() {
//             console.log(this.data.change), this.data.change && this.set({
//                 darkMode: e.globalData.darkMode,
//                 change: !1
//             });
//         }
//     },
//     mounted: function() {
//         console.log(e.globalData), this.set({
//             darkMode: e.globalData.darkMode
//         });
//     },
//     pageLifetimes: {
//         show: function() {
//             this.set({
//                 darkMode: e.globalData.darkMode
//             });
//         }
//     },
//     methods: {
//         event: function() {
//             this.triggerEvent("event");
//         }
//     }
// });