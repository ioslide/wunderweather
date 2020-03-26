const app = getApp();
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  properties: {
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    themeValue:{
      type: String,
      value: ""
    },
    contentText:{
      type: String,
      value: ""
    }
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  attached:function(){
    var e = this.properties
    this.setData({
      themeValue:e.themeValue,
      contentText:e.contentText
    })
  },
  methods: {
    backPage() {
      wx.navigateBack({
        delta: 1
      });
    },
    toHome(){
      wx.reLaunch({
        url: '/pages/index/index',
      })
    },
    onCapTap: function (e) {
      console.log(e)
      let modalName = e.currentTarget.dataset.target
      this.triggerEvent('showModalListener', modalName)
    }
  }
})