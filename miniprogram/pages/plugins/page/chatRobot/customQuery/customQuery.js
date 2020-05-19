var t = getApp();

Component({
    properties: {
        msg: Object,
        recording: Boolean
    },
    data: {},
    lifetimes: {
        ready: function() {
            var e = this;
            console.log(t.getData()), "小微写诗" === t.getData() && e.setData({
                flag: !0
            });
        }
    },
    methods: {}
});