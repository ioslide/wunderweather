Component({
    properties: {
        msg: Object
    },
    data: {},
    lifetimes: {
        ready: function() {}
    },
    methods: {
        reserve: function() {
            wx.navigateToMiniProgram({
                appId: this.properties.msg.data.appid,
                path: this.properties.msg.data.pagepath,
                extraData: {},
                envVersion: "",
                success: function(e) {}
            });
        }
    }
});