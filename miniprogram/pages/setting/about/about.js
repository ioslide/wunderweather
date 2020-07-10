const app = getApp();
const log = console.log.bind(console)
import create from '../../../utils/create'
import store from '../../../store/index'
create(store, {
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    use:[
      'themeValue',
      'languageValue'
    ]
  },
  handleContact(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },
  hideDrawerModal(e){
    log('[hideDrawerModal]')
    const t = this
    let drawerModalName = e.detail.drawerModalName
    wx.showToast({
      title: t.store.data.languageValue == 'zh_TW' ? '感謝':t.store.data.languageValue == 'zh_CN'? '感谢':'Thanks',
    })
    t.setData({
      drawerModalName: drawerModalName
    })
  },
  backPage() {
    wx.navigateBack({
      delta: 1
    });
  },
  showDrawerModal(e){
    const t = this
    t.setData({
      drawerModalName: e.currentTarget.dataset.target
    })
  },
  onShareAppMessage(a) {
    return {
      title: '奇妙天气',
      imageUrl: 'https://weather.ioslide.com/shareimg.png',
      path: "/pages/index/index"
    };
  },
  donate(){
    wx.navigateTo({
      url: '../sponsorshipneeds/sponsorshipneeds',
    })
  }
})