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
    drawerModalName: null,
    modalName: "",
    use: [
      'themeValue',
      'languageValue'
    ]
  },
  properties: {
    drawerModalName: {
      type: String,
      value: null,
      observer: function () {
        log(this)
      }
    },
  },
  methods: {
    hideDrawerModal(e) {
      log('[hideModal]',e)
      log(this)
      const t = this
      t.setData({
        drawerModalName: null
      })
      let eventDetail  = {
        drawerModalName: t.data.drawerModalName
      } 
      let eventOption = {} 
      this.triggerEvent('hideDrawerModal', eventDetail ,eventOption)
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
    navWechatsi() {
      wx.navigateTo({
        url: '../plugins/pages/wechatsi/wechatsi'
      });
    },
    onDev() {
      const t = this
      wx.showModal({
        title: t.store.data.languageValue == 'zh_TW' ?'沒錢開發中':t.store.data.languageValue == 'zh_CN'?'没钱开发中':'No money',
        content: t.store.data.languageValue == 'zh_TW' ?'不要期待':t.store.data.languageValue == 'zh_CN'?'不要期待':'Do not expect'
      })
    },
  }
})