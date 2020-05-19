var t = requirePlugin("chatRobot"), e = getApp();

Component({
    properties: {
        focus: Boolean,
        recording: Boolean,
        inputText: String,
        inputing: Boolean,
        height: Number
    },
    data: {
        inputing: !1,
        inputText: ""
    },
    lifetimes: {
        ready: function() {
            this.properties.focus && this.setData({
                focus: this.properties.focus,
                inputing: !0
            });
        },
        attached: function() {}
    },
    methods: {
        bindInput: function(t) {
            this.setData({
                inputText: t.detail.value
            });
        },
        chooseType: function(t) {
            "voice" == t.currentTarget.dataset.type ? this.setData({
                inputing: !1
            }) : this.setData({
                inputing: !0
            });
        },
        bindconfirmInput: function(t) {
            var e = this, n = t.detail.value;
            e.triggerEvent("bindInput", n), e.setData({
                inputText: ""
            });
        },
        showGuideView: function() {
            e.setData("difference", ""), !0 !== e.globalData.scene ? this.triggerEvent("back") : wx.reLaunch({
                url: "/pages/home/home",
                success: function() {
                    e.setData("scene", !1);
                }
            });
        },
        inputVoiceStart: function() {
            t.getChatComponent().inputVoiceStart();
        },
        inputVoiceEnd: function() {
            t.getChatComponent().inputVoiceEnd();
        }
    }
});