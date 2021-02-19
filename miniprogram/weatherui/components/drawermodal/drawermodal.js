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
    rateIndex: 3,
    currentRate: 0,
    use: [
      'themeValue',
      'languageValue',
      'startScreen',
      'language',
      'unit',
      'unitValue',
      'iconValue',
      'icon',
      'longitude',
      'latitude'
    ]
  },
  properties: {
    drawerModalName: {
      type: String,
      value: null,
      observer: function () {
        const t = this
        t.setData({
          drawerModalName: t.properties.drawerModalName
        })
        if (t.properties.drawerModalName == "DrawerModalL") {
          t.setData({
            historyCityList: wx.getStorageSync('historyCityList')
          })
          console.log('historyCityList',wx.getStorageSync('historyCityList'))
        }
        if (t.properties.drawerModalName == "DrawerModalR") {
          wx.vibrateShort()
        }
        if (t.properties.drawerModalName == "DrawerModalB") {
          t.getQRCode()
        }
      }
    },
  },
  lifetimes: {
    ready: function () {},
    attached: function () {},
  },
  pageLifetimes: {
    show: function () {
      this.setData({
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        windowWidth: app.globalData.windowWidth,
        windowHeight: app.globalData.windowHeight
      })
    },
    hide: function () {}
  },
  onShareAppMessage(a) {
    const t = this
    return {
      title: '奇妙天气',
      path: "/pages/index/index",
      imageUrl: "https://teaimg.ioslide.com/weather/onShareAppMessage.png"
    };
  },
  methods: {
    getQRCode() {
      const t = this
      const formatImg = (base64Img) => {
        let fsm = wx.getFileSystemManager()
        let FILE_BASE_NAME = 'weatherLogo'
        let buffer = wx.base64ToArrayBuffer(base64Img);
        const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.jpg`;
        fsm.writeFile({
          filePath,
          data: buffer,
          encoding: 'binary',
          success: res => {
            log(`[writeFile] => qrImageURL =>`, filePath)
            app.globalData.qrImageURL = filePath
          },
          fail: err => {
            log(`[writeFile] => fail => ${err}`)
            return (new Error('ERROR_BASE64SRC_WRITE'));
          },
        });
      }
      const base64ImgStorage = wx.getStorageSync('qrCodeBase64')
      if (base64ImgStorage) {
        app.globalData.qrImageURL = formatImg(base64ImgStorage)
        console.log(`[get wxacode] from storage ID`)
      } else {
        wx.cloud.callFunction({
          name: 'openapi',
          data: {
            action: 'getWXACode',
          },
          success: res => {
            log(`[getWXACode] =>`, res)
            let base64Img = res.result.wxacodebase64.replace(/[\r\n]/g, "")
            formatImg(base64Img)
            app.saveData('qrCodeBase64', base64Img)
          },
          fail: err => {
            log(`[getWXACode] => ${err}`)
          }
        })
      }
    },
    rateChange: function (e) {
      this.setData({
        rateIndex: e.detail.index,
        currentRate: e.detail.index
      })
    },
    hideDrawerModal(e) {
      log('[hideModal]', e)
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
    navSponsorshipneeds() {
      wx.navigateTo({
        url: '../setting/sponsorshipneeds/sponsorshipneeds'
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
        title: t.store.data.languageValue == 'zh_TW' ? '功能暫未開放' : t.store.data.languageValue == 'zh_CN' ? '功能暂未开放' : t.store.data.languageValue == 'ja' ? '関数はまだ開いていません' : 'Function not open yet',
        content: t.store.data.languageValue == 'zh_TW' ? '敬請期待' : t.store.data.languageValue == 'zh_CN' ? '敬请期待' : t.store.data.languageValue == 'ja' ? '乞うご期待' : 'Do not expect'
      })
    },
    onLive() {
      const t = this
      wx.cloud.callFunction({
        name: 'getLiveRoomLists',
        success: res => {
          log(res)
          let roomId = [5]
          let customParams = encodeURIComponent(JSON.stringify({
            path: 'pages/index/index',
            pid: 1
          }))
          wx.navigateTo({
            url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
          })
        },
        fail: err => {
          log(err)
          wx.showToast({
            title: t.store.data.languageValue == 'zh_TW' ? '還未開播' : t.store.data.languageValue == 'zh_CN' ? '还未开播' : t.store.data.languageValue == 'ja' ? 'まだ放送されていません' : 'Not yet broadcast'
          })
        }
      })

    },
    chooseCropImage(e) {
      let eventDetail = {
        type: e.currentTarget.dataset.type
      }
      this.triggerEvent('chooseCropImage', eventDetail)
    },
    openSubscribeRadioModal() {
      this.triggerEvent('openSubscribeRadioModal')
    },
    setNewWeatherDataByHistory(e) {
      const t = this
      var curCityData = e.currentTarget.dataset.city
      log('[curCityData]',curCityData)
      const changeStorage = () => {
          app.changeStorage('getLocationMethod', 'historyCity')
          t.store.data.getLocationMethod = 'historyCity'
        }
        (async () => {
          let eventDetail = {
            canRefreshChart: true,
            longitude :curCityData.longitude,
            latitude :curCityData.latitude
          }
          await t.triggerEvent('_getWeatherData', eventDetail)
          await changeStorage()
          await t.hideDrawerModal()

        })()
    },
    getNewLocationByManual() {
      const t = this
      t.triggerEvent('getNewLocationByManual')
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
    _scrollTo(e) {
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
      log('[themeRadioChange]', e.detail.value, app.globalData.theme)
      const t = this
      let
        pages = getCurrentPages(),
        prevPage = pages[0];
      const event = () => {
          var themeValue = e.detail.value.toString()
          var theme = {
            themeChecked_auto: false,
            themeChecked_light: false,
            themeChecked_dark: false
          }
          themeValue == 'auto' && app.globalData.theme == 'light' ? (theme['themeChecked_auto'] = true,t.store.data.themeValue = 'light') : themeValue == 'light' ? (theme['themeChecked_light'] = true,t.store.data.themeValue = 'light') : (theme['themeChecked_dark'] = true,t.store.data.themeValue = 'dark')
          // themeValue == 'light' ? theme['themeChecked_light'] = true : theme['themeChecked_dark'] = true
          log('[isChangeSetting]', true)
          t.store.data.theme = theme
          // t.store.data.themeValue = themeValue
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
    iconRadioChange(e) {
      log('[iconRadioChange]', e.detail.value)
      const t = this
      const storeChange = () => {
          let iconValue = e.detail.value.toString(),
            icon = {
              lineIcon: false,
              colorIcon: false,
              solidIcon: false,
              flatIcon: false
            }
          iconValue == 'lineIcon' ? (icon['lineIcon'] = true) : iconValue == 'colorIcon' ? (icon['colorIcon'] = true) : iconValue == 'solidIcon' ? (icon['solidIcon'] = true) : (icon['flatIcon'] = true)
          t.store.data.icon = icon
          t.store.data.iconValue = iconValue
          app.changeStorage('iconValue', iconValue)
          app.changeStorage('icon', icon)
        }
        (async () => {
          await t.hideDrawerModal()
          await storeChange()
        })()
    },
    languageRadioChange(e) {
      const t = this
      const event = () => {
          var language = {
            languageChecked_zh_TW: false,
            languageChecked_zh_CN: false,
            languageChecked_en_US: false,
            languageChecked_en_GB: false,
            languageChecked_ja: false
          }
          var languageValue = e.detail.value.toString()
          log('[languageValue] =>', e.detail.value.toString())
          e.detail.value == 'zh_TW' ? (language['languageChecked_zh_TW'] = true) :
            e.detail.value == 'zh_CN' ? (language['languageChecked_zh_CN'] = true) :
            e.detail.value == 'ja' ? (language['languageChecked_ja'] = true) :
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
  },
})