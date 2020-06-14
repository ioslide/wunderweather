const log = console.log.bind(console)
const app = getApp()
const globalData = getApp().globalData
const config = require('../../../weatherui/config/config.js').default
import create from '../../../utils/create'
import store from '../../../store/index'
import _ from '../../../utils/lodash.min.js';

create.Component(store,{
  properties: {
    canloadHeadImage:{
      type: String,
      observer: function () {
        const t = this
        log('[indexHeadImageValue]',t.store.data.indexHeadImageValue)
        t.store.data.indexHeadImageValue == 'Bing' ? t.getBingImage() : 
        t.store.data.indexHeadImageValue == 'NASA' ?  t.getNASAImage() :  
        t.store.data.indexHeadImageValue == 'customize' ?  t.getCustomizeImage(): 
        t.store.data.indexHeadImageValue == 'weather' ?  t.getWeatherImage() : log(t.store.data.indexHeadImageValue)
      }
    }
  },
  data: {
    windowWidth: globalData.windowWidth,
    use: [
      'indexHeadImageValue'
    ]
  },
  lifetimes: {
    // attached: function () {
    //   const t = this
    //   log('[indexHeadImageValue]',t.store.data.indexHeadImageValue)
    //   t.store.data.indexHeadImageValue == 'Bing' ? t.getBingImage() : t.store.data.indexHeadImageValue == 'NASA' ?  t.getNASAImage() :  t.store.data.indexHeadImageValue == 'customize' ?  t.getCustomizeImage(): t.store.data.indexHeadImageValue == 'weather' ?  t.getWeatherImage() : log(t.store.data.indexHeadImageValue)
    // },
    moved: function () { },
    detached: function () { },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
    },
    hide: function () { },
    resize: function () { },
  },

  methods: {
    getCustomizeImage(){
      log('[getCustomizeImage]')
      const t = this
      let cusImageFileID = wx.getStorageSync('cusImageFileID')
      if (cusImageFileID) {
        t.setData({
          cusImage: cusImageFileID,
          hasCusImageFileID: true
        })
        log('hasCusImageFileID,cusImage')
      }
      t.setData({
        headBackgroundAni: true
      })
    },
    getBingImage() {
      log('[getBingImage]')
      const t = this
      wx.request({
        url: config.bingApiHost + '/HPImageArchive.aspx?format=js&idx=0&n=30&nc=1589441449314&pid=hp',
        header: {
          "content-type": "application/json"
        },
        success: res => {
          log('[requestBing]', res.data.images)
          var bingImageLists = res.data.images
          let copyrightlink = 'https://bing.ioslide.com' + bingImageLists[0].copyrightlink
          for(let i = 0;i<bingImageLists.length;i++){
            bingImageLists[i].url = bingImageLists[i].url.replace("1920x1080","900x540")
          }
          log('[bingImageLists]',bingImageLists)
          let bingImage = 'https://cn.bing.com' + bingImageLists[0].url
          t.setData({
            copyrightlink:copyrightlink,
            bingIndex : 0,
            bingImage: bingImage,
            bingImageLists : bingImageLists,
            headBackgroundAni: true
          })
        },
        fail: err => {
          log('requestBing', err)
          t.setData({
            'bingImage': '../../weatherui/assets/images/headbackground.jpg'
          })
        }
      });
    },
    getNASAImage(){
      log('[getNASAImage]')
      const t = this
      wx.request({
        url: 'https://www.nasachina.cn/wp-json/wp/v2/posts?per_page=8&orderby=date&order=desc&page=1&categories=1',
        header: {
          "content-type": "application/json"
        },
        success: res => {
          log('[requestNASA]', res.data)
          let NASAImageLists = res.data
          let NASAImage = NASAImageLists[0].post_large_image
          t.setData({
            NASAIndex : 0,
            NASAImage: NASAImage,
            NASAImageLists : NASAImageLists,
            headBackgroundAni: true
          })
        },
        fail: err => {
          log('requestBing', err)
          t.setData({
            'NASAImage': '../../weatherui/assets/images/headbackground.jpg'
          })
        }
      });
    },
    getWeatherImage(){
        let pages = getCurrentPages()
        let prevPage = pages[pages.length - 1];
        log('[getWeatherImage]',prevPage.data.weatherKeyWord)
        const t = this
        wx.request({
          url: 'https://500px.com.cn/community/searchv2?client_type=1&imgSize=p2%2Cp4&key='+ prevPage.data.weatherKeyWord +'&searchType=photo&page=1&size=20&type=json&avatarSize=a1&resourceType=0%2C2',
          header: {
            "content-type": "application/json"
          },
          success: res => {
            log('[requestWeather]', res.data.data)
            let weatherImageLists = res.data.data
            let weatherIndex = _.random(0,res.data.data.length-1)
            let weatherImage = weatherImageLists[weatherIndex].url.p4
            t.setData({
              weatherIndex : 0,
              weatherImage: weatherImage,
              weatherImageLists : weatherImageLists,
              headBackgroundAni: true
            })
          },
          fail: err => {
            log('requestBing', err)
            t.setData({
              'weatherImage': '../../weatherui/assets/images/headbackground.jpg'
            })
          }
        });
    },
    navChange(e) {
      log(`[navChange] => ${e.currentTarget.dataset.cur}`)
      const cur = e.currentTarget.dataset.cur
      wx.navigateTo({
        url: '../' + cur + '/' + cur
      });
    },
    _showDrawerModal(e){
      log('[showDrawerModal]',e.currentTarget.dataset.target)
      // const t = this
      // t.setData({
      //   drawerModalName: e.currentTarget.dataset.target
      // })
      let eventDetail = {
        drawerModalName: e.currentTarget.dataset.target
      }
      this.triggerEvent('_showDrawerModal',eventDetail)
    },
    hideDrawerModal(e){
      log('[hideDrawerModal]')
      var drawerModalName = e.detail.drawerModalName;
      const t = this
      t.setData({
        drawerModalName: drawerModalName
      })
    },
    navNextBing(){
      // https://cn.bing.com/ImageResolution.aspx?w=375&h=667
      // https://cn.bing.com/th?id=OHR.LofotenIslands_ZH-CN0114482586_480x800.jpg&rf=LaDigue_1920x1080.jpg&pid=hp
      const t = this
      this.animate('#bingImage', [
        { opacity: 1.0, ease:'ease-in' },
        { opacity: 0.0, ease:'ease-out' },
        ], 350, function () {
          let bingIndex = t.data.bingIndex
          if(t.data.bingIndex == 7){
            bingIndex = 0
          }else{
            bingIndex += 1 
          }
          let bingImage = 'https://cn.bing.com' + t.data.bingImageLists[bingIndex].url
          t.setData({
            bingIndex : bingIndex,
            bingImage: bingImage
          })
          this.animate('#bingImage', [
            { opacity: 0, ease:'ease-in' },
            { opacity: 1, ease:'ease-out' },
            ], 350)
      }.bind(this))  
    },
    navPreBing(){
      const t = this
      this.animate('#bingImage', [
        { opacity: 1.0, ease:'ease-in',backgroundColor: '#F5F6F7' },
        { opacity: 0.5, ease:'ease-in',backgroundColor: '#F5F6F7'},
        { opacity: 0.0, ease:'ease-out',backgroundColor: '#F5F6F7' },
        ], 350, function () {
          let bingIndex = t.data.bingIndex
          if(t.data.bingIndex == 0){
            bingIndex = 7
          }else{
            bingIndex -= 1 
          }
          let copyrightlink = 'https://bing.ioslide.com' + t.data.bingImageLists[bingIndex].copyrightlink
          let bingImage = 'https://cn.bing.com' + t.data.bingImageLists[bingIndex].url
          t.setData({
            copyrightlink:copyrightlink,
            bingIndex : bingIndex,
            bingImage: bingImage
          })
          this.animate('#bingImage', [
            { opacity: 0, ease:'ease-in',backgroundColor: '#F5F6F7' },
            { opacity: 0.5, ease:'ease-in',backgroundColor: '#F5F6F7'},
            { opacity: 1, ease:'ease-out',backgroundColor: '#F5F6F7' },
            ], 350)
      }.bind(this))  
    },
    navNextNASA(){
      const t = this
      this.animate('#NASAImage', [
        { opacity: 1.0, ease:'ease-in' },
        { opacity: 0.0, ease:'ease-out' },
        ], 350, function () {
          let NASAIndex = t.data.NASAIndex
          if(t.data.NASAIndex == 7){
            NASAIndex = 0
          }else{
            NASAIndex += 1 
          }
          let NASAImage = t.data.NASAImageLists[NASAIndex].post_thumbnail_image_624
          t.setData({
            NASAIndex : NASAIndex,
            NASAImage: NASAImage
          })
          this.animate('#NASAImage', [
            { opacity: 0, ease:'ease-in' },
            { opacity: 1, ease:'ease-out' },
            ], 350)
      }.bind(this))  
    },
    navPreNASA(){
      const t = this
      this.animate('#NASAImage', [
        { opacity: 1.0, ease:'ease-in'},
        { opacity: 0.0, ease:'ease-out'},
        ], 350, function () {
          let NASAIndex = t.data.NASAIndex
          if(t.data.NASAIndex == 0){
            NASAIndex = 7
          }else{
            NASAIndex -= 1 
          }
          let NASAImage = t.data.NASAImageLists[NASAIndex].post_thumbnail_image_624
          log(NASAImage)
          t.setData({
            NASAIndex : NASAIndex,
            NASAImage: NASAImage
          })
          this.animate('#NASAImage', [
            { opacity: 0, ease:'ease-in'},
            { opacity: 1, ease:'ease-out'},
            ], 350)
      }.bind(this))  
    },
    navNextWeather(){
      const t = this
      this.animate('#weatherImage', [
        { opacity: 1.0, ease:'ease-in' },
        { opacity: 0.0, ease:'ease-out' },
        ], 350, function () {
          let weatherIndex = t.data.weatherIndex
          if(t.data.weatherIndex == 7){
            weatherIndex = 0
          }else{
            weatherIndex += 1 
          }
          let weatherImage = t.data.weatherImageLists[weatherIndex].url.p4
          t.setData({
            weatherIndex : weatherIndex,
            weatherImage: weatherImage
          })
          this.animate('#weatherImage', [
            { opacity: 0, ease:'ease-in' },
            { opacity: 1, ease:'ease-out' },
            ], 350)
      }.bind(this))  
    },
    navPreWeather(){
      const t = this
      this.animate('#weatherImage', [
        { opacity: 1.0, ease:'ease-in'},
        { opacity: 0.0, ease:'ease-out'},
        ], 350, function () {
          let weatherIndex = t.data.weatherIndex
          if(t.data.weatherIndex == 0){
            weatherIndex = 7
          }else{
            weatherIndex -= 1 
          }
          let weatherImage = t.data.weatherImageLists[weatherIndex].url.p4
          log(weatherImage)
          t.setData({
            weatherIndex : weatherIndex,
            weatherImage: weatherImage
          })
          this.animate('#weatherImage', [
            { opacity: 0, ease:'ease-in'},
            { opacity: 1, ease:'ease-out'},
            ], 350)
      }.bind(this))  
    },
    setCusImage(e){
      const t = this
      log('setCusImage',e)
      t.setData({
        cusImage: e.cusImage,
        hasCusImageFileID: e.hasCusImageFileID,
      })
    }
  }
})
