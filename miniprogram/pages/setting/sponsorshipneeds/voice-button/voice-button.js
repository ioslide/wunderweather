
Component({
  properties: {
    buttonDisabled: {
      type: Boolean,
      value: false
    },
  },

  data: {
    button: {
      buttonText: '中文',
      lang: 'zh_CN',
      lto: [ "en_US", ],
      msg: "长按说话",
      buttonType: 'normal',
    }
  },

  ready: function () {
  },

  methods: {
    streamRecord(e) {
      if(this.data.buttonDisabled) {
        return
      }
      wx.getBackgroundAudioManager().stop()
      let currentButtonConf = e.currentTarget.dataset.conf
      console.log("currentButtonConf", currentButtonConf)
      this.triggerEvent('recordstart', {
        buttonItem: currentButtonConf
      })

    },
    endStreamRecord(e) {
      let currentButtonConf = e.currentTarget.dataset.conf
      console.log("currentButtonConf", currentButtonConf)
      this.triggerEvent('recordend', {
        buttonItem: currentButtonConf
      })
    }
  }
});