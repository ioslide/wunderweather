const log = console.log.bind(console)
const app = getApp()
import create from '../../../utils/create'
import store from '../../../store/index'

create.Component(store, {
  // Component({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    drawerModalName: null,
    rateIndex:3,
    currentRate:0,
    use: [
      'themeValue',
      'languageValue',
      'startScreen',
      'languageValue',
      'language',
      'unit',
      'unitValue',
    ]
  },
  properties: {
    drawerModalName: {
      type: String,
      value: null,
      observer: function () {
        // log(this)
        const t = this
        log('[drawerModalName]',t.properties.drawerModalName)
        if (t.properties.drawerModalName == "DrawerModalL") {
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1]
          var historyCityList = currPage.data.historyCityList
          log('historyCityList',historyCityList)
          t.setData({
            historyCityList: historyCityList
          })
        }
      }
    },
  },
  lifetimes: {
    ready: function () {},
    attached: function () {},
  },
  pageLifetimes: {
    show: function() {
      this.setData({
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        windowWidth: app.globalData.windowWidth,
        windowHeight: app.globalData.windowHeight
      })
    },
    hide: function() {}
  },
  onShareAppMessage(a) {
    const t = this
    return {
      title: '奇妙天气',
      path: "/pages/index/index",
      imageUrl:"https://teaimg.ioslide.com/weather/onShareAppMessage.png"
    };
  },
  methods: {
    rateChange: function (e) {
      this.setData({
        rateIndex: e.detail.index,
        currentRate: e.detail.index
      })
    },
    hideDrawerModal(e) {
      log('[hideModal]',e)
      const t = this
      t.setData({
        drawerModalName: null
      })
      let eventDetail = {
        drawerModalName: null
      }
      let eventOption = {}
      this.triggerEvent('hideDrawerModal', eventDetail, eventOption)
    },
    navChange(e) {
      log(`[navChange] => ${e.currentTarget.dataset.cur}`)
      const cur = e.currentTarget.dataset.cur
      wx.navigateTo({
        url: '../' + cur + '/' + cur
      });
    },
    navRadar() {
      // appid:'wx673e7d2fe4e6a413',  //订阅号
      // appid:'wx7b4bbc2d9c538e84', //服务号
      log('[navRadar]', app.globalData.appid)
      const t = this
      log('[navigateTo]')
      wx.navigateTo({
        url: '../radar/radar?latitude=' + app.globalData.latitude + "&longitude=" + app.globalData.longitude
      })
    },
    navSetting() {
      wx.navigateTo({
        url: '../setting/setting'
      });
    },
    navAbout() {
      wx.navigateTo({
        url: '../setting/about/about'
      });
    },
    navChatRobot() {
      wx.navigateTo({
        url: '../plugins/page/chatRobot/pluginChat/pluginChat'
      });
    },
    onDev() {
      const t = this
      wx.showModal({
        title: t.store.data.languageValue == 'zh_TW' ? '沒錢開發中' : t.store.data.languageValue == 'zh_CN' ? '没钱开发中' : 'No money',
        content: t.store.data.languageValue == 'zh_TW' ? '不要期待' : t.store.data.languageValue == 'zh_CN' ? '不要期待' : 'Do not expect'
      })
    },
    onLive(){
      const t = this
      wx.showToast({
        title: t.store.data.languageValue == 'zh_TW' ? '還未開播' : t.store.data.languageValue == 'zh_CN' ? '还未开播' : 'Not yet broadcast'
      })
      wx.cloud.callFunction({
        name: 'getLiveRoomLists',
        success: res => {
          log(res)
          let roomId = [3]
          let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1 }))
          wx.navigateTo({
              url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
          })
        },
        fail: err => {
          log(err)
        }
      })

    },
    chooseCropImage(e) {
      let eventDetail = {
        type: e.currentTarget.dataset.type
      }
      this.triggerEvent('chooseCropImage',eventDetail)
    },
    openDatePicker() {
      this.triggerEvent('openDatePicker')
    },
    setHistoryCityLocation(e) {
      const t = this
      // log(e)
      var historyCityData = e.currentTarget.dataset.curdetaildata
      let eventDetail = {
        historyCityData: historyCityData
      }
      let eventOption = {}
      t.hideDrawerModal()
      t.triggerEvent('setHistoryCityLocation', eventDetail, eventOption)
    },
    manualGetNewLocation() {
      const t = this
      t.triggerEvent('manualGetNewLocation')
      t.hideDrawerModal()
    },
    savePostImg: function (e) {
      log(e.currentTarget.dataset.target)
      let modalName = e.currentTarget.dataset.target
      let eventDetail = {
        modalName: modalName
      }
      this.triggerEvent('savePostImg', eventDetail)
    },
    _scrollTo(e){
      this.hideDrawerModal()
      log(e.currentTarget.dataset.target)
      let eventDetail = {
        viewId: '#' + e.currentTarget.dataset.target
      }
      this.triggerEvent('_scrollTo', eventDetail)
    },
    onShareAppMessage(a) {
      const t = this
      return {
        title: '奇妙天气',
        path: "/pages/index/index"
      };
    },
    themeRadioChange(e) {
      log('[themeRadioChange]', e.detail.value)
      const t = this
      const event = () => {
        var themeValue = e.detail.value.toString()
        var theme = {
          themeChecked_auto: false,
          themeChecked_light: false,
          themeChecked_dark: false
        }
        themeValue == 'light' ? theme['themeChecked_light'] = true : theme['themeChecked_dark'] = true

        log('[isChangeSetting]', true)
        t.store.data.theme = theme
        t.store.data.themeValue = themeValue
        app.changeStorage('themeValue', themeValue)
        app.changeStorage('theme', theme)
      }
      (async () => {
        await t.hideDrawerModal()
        await event()
      })()
    },
    unitValueRadioChange(e) {
      const t = this
      const event = () => {
        var unit = {
          metric: false,
          SI: false,
          imperial: false
        }
        e.detail.value == 'metric' ? (unit['metric'] = true) : e.detail.value == 'imperial' ? (unit['imperial'] = true) : (unit['SI'] = true)

        log('[isChangeSetting]', true)
        t.store.data.unitValue = e.detail.value.toString()
        t.store.data.unit = unit
        app.changeStorage('unitValue', e.detail.value.toString())
        app.changeStorage('unit', unit)
      }
      (async () => {
        await t.hideDrawerModal()
        await event()
      })()
    },
    languageRadioChange: function (e) {
      const t = this
      const event = () => {
        var language = {
          languageChecked_zh_TW: false,
          languageChecked_zh_CN: false,
          languageChecked_en_US: false,
          languageChecked_en_GB: false
        }
        var languageValue = e.detail.value.toString()
        log('[languageValue] =>', e.detail.value.toString())
        e.detail.value == 'zh_TW' ? (language['languageChecked_zh_TW'] = true) :
          e.detail.value == 'zh_CN' ? (language['languageChecked_zh_CN'] = true) :
          e.detail.value == 'en_US' ? (language['languageChecked_en_US'] = true) : (language['languageChecked_en_GB'] = true)
        t.store.data.languageValue = languageValue
        t.store.data.language = language
        app.changeStorage('language', language)
        app.changeStorage('languageValue', languageValue)
      }
      (async () => {
        await t.hideDrawerModal()
        await event()
      })()
    },
  }
})