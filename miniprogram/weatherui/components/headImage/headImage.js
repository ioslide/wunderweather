const log = console.log.bind(console)
const app = getApp()
const globalData = getApp().globalData
const config = require('../../../weatherui/config/config.js').default
const dayjs = require('../../../weatherui/assets/lib/day/day.js')
const sunCalc = require('../../../utils/sunCalc.js')

import create from '../../../utils/create'
import store from '../../../store/index'
import _ from '../../../utils/lodash.min.js';
const transWeatherName = require('../../../weatherui/assets/lib/transWeatherName/transWeatherName.js').default

create.Component(store,{
  properties: {
    loadHeadImage:{
      type: String,
      observer: function () {
        const t = this
        log('[indexHeadImageValue]',t.store.data.indexHeadImageValue)
        t.store.data.indexHeadImageValue == 'Bing' ? t.getBingImage() : 
        t.store.data.indexHeadImageValue == 'NASA' ?  t.getNASAImage() :  
        t.store.data.indexHeadImageValue == 'Customize' ?  t.getCustomizeImage(): 
        t.store.data.indexHeadImageValue == 'Weather' ?  t.getWeatherImage('none') : log(t.store.data.indexHeadImageValue)
      }
    }
  },
  data: {
    windowWidth: globalData.windowWidth,
    use: [
      'indexHeadImageValue',
      'longitude',
      'latitude'
    ]
  },
  lifetimes: {
    // attached: function () {
    //   const t = this
    //   log('[indexHeadImageValue]',t.store.data.indexHeadImageValue)
    //   t.store.data.indexHeadImageValue == 'Bing' ? t.getBingImage() : t.store.data.indexHeadImageValue == 'NASA' ?  t.getNASAImage() :  t.store.data.indexHeadImageValue == 'Customize' ?  t.getCustomizeImage(): t.store.data.indexHeadImageValue == 'weather' ?  t.getWeatherImage() : log(t.store.data.indexHeadImageValue)
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
      // log('[getBingImage]')
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
    getWeatherImage(newRealtimeSkycon){
      // log('[getWeatherImage]')
      const t = this
      let timeProperty = sunCalc.getTimes(new Date(),t.store.data.latitude, t.store.data.longitude, 0)
      log('timeProperty',timeProperty)
      var compareDate = {
          isDuringDate(beginDateStr, endDateStr) {
              var curDate = new Date(),
                  beginDate = new Date(beginDateStr),
                  endDate = new Date(endDateStr);
              if (curDate >= beginDate && curDate <= endDate) {
                  return true;
              }
              return false;
          },
          isBetween (a,b) {
            return dayjs(nowTime).isAfter(a) && dayjs(nowTime).isBefore(b) || dayjs(nowTime).isAfter(b) && dayjs(nowTime).isBefore(a)
         }
      }

      let intNight = dayjs(new Date()).format('YYYY-MM-DD')+ ' 00:00'
      let int24Night = dayjs(new Date()).format('YYYY-MM-DD')+ ' 24:00'
      let nightEnd = dayjs(timeProperty.nightEnd).format('YYYY-MM-DD HH:mm')
      // let nauticalDawn =dayjs(timeProperty.nauticalDawn).format('YYYY-MM-DD HH:mm')
      // let sunrise =dayjs(timeProperty.sunrise).format('YYYY-MM-DD HH:mm')
      // let sunriseEnd =dayjs(timeProperty.sunriseEnd).format('YYYY-MM-DD HH:mm') 
      let goldenHourEnd = dayjs(timeProperty.goldenHourEnd).format('YYYY-MM-DD HH:mm')
      let solarNoon = dayjs(timeProperty.solarNoon).format('YYYY-MM-DD HH:mm')
      // let goldenHour = dayjs(timeProperty.goldenHour).format('YYYY-MM-DD HH:mm')
      // let sunsetStart = dayjs(timeProperty.sunsetStart).format('YYYY-MM-DD HH:mm')
      // let sunset = dayjs(timeProperty.sunset).format('YYYY-MM-DD HH:mm')
      // let dusk = dayjs(timeProperty.dusk).format('YYYY-MM-DD HH:mm')
      // let nauticalDusk = dayjs(timeProperty.nauticalDusk).format('YYYY-MM-DD HH:mm')
      let night = dayjs(timeProperty.night).format('YYYY-MM-DD HH:mm')
      let nowTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm')
      // let nowTime = '2021-01-11 01:10'
      // let nadir = dayjs(timeProperty.nadir).format('YYYY-MM-DD HH:mm') 
      var timeArr = [intNight,nightEnd,goldenHourEnd,solarNoon,night,int24Night]
      var timeNameArr = ['late_evening','early_morning','late_morning','afternoon','early_evening']
      var timeGroupName = 'afternoon'

      timeArr.map(function (value, index, arr) {
        if(index < arr.length-1){
          compareDate.isBetween(arr[index],arr[index+1]) == true ? (timeGroupName = timeNameArr[index],log(`%c  timeGroupName`, 'color:#e0c184; font-weight: bold',timeNameArr[index])): timeGroupName ='afternoon'
        }
      })
 

      let prePageData = getCurrentPages()[0].data
      log('3333',newRealtimeSkycon)
      let realtimeSkycon = ''
      if(newRealtimeSkycon == 'none'){
        realtimeSkycon = prePageData.forecastData.realtime.skycon
      }else{
        realtimeSkycon = newRealtimeSkycon
      }

      var weatherImageGroupLength = {
        afternoon :{
          'clear-day' : 110,
          'cloudy' : 154,
          'fog':67,
          'hail':8,
          'partly-cloudy-day' : 162,
          'rain' : 133,
          'sleet':4,
          'snow':187,
          'thunderstorm':31,
          'tornado':3,
          'wind':20
        },
        early_morning :{
          'clear-day' : 81,
          'cloudy' : 73,
          'fog':80,
          'hail':5,
          'partly-cloudy-day' : 110,
          'rain' : 26,
          'sleet':4,
          'snow':84,
          'thunderstorm':30,
          'tornado':3,
          'wind':9
        },
        late_morning :{
          'clear-day' : 90,
          'cloudy' : 155,
          'fog':73,
          'hail':8,
          'partly-cloudy-day' : 154,
          'rain' : 107,
          'sleet':4,
          'snow':176,
          'thunderstorm':31,
          'tornado':3,
          'wind':17
        },
        late_evening :{
          'clear-day' : 334,
          'cloudy' : 118,
          'fog':53,
          'hail':2,
          'partly-cloudy-day' : 217,
          'rain' : 132,
          'sleet':2,
          'snow':58,
          'thunderstorm':32,
          'tornado':3,
          'wind':6
        },
        early_evening :{
          'clear-day' : 38,
          'cloudy' : 74,
          'fog':47,
          'hail':4,
          'partly-cloudy-day' : 85,
          'rain' : 31,
          'sleet':3,
          'snow':39,
          'thunderstorm':31,
          'tornado':3,
          'wind':7
        },
      }
      let weatherFileNameList = []
      let weatherKeyWord =  transWeatherName.weatherImageKeyWord[realtimeSkycon]
      let weatherKeyWordGroupImageNum = weatherImageGroupLength[timeGroupName][weatherKeyWord]
      const getTempWeatherFileNameList = () => {
      for (let i=1;i<9;i++ )
        {
            weatherFileNameList[i-1] = 'https://weather.ioslide.com/weather/follow/weatherImage/'+ timeGroupName + '/' + weatherKeyWord + '/' + _.random(1,weatherKeyWordGroupImageNum) + '.png'
        }
      }
    (async () => {
      await getTempWeatherFileNameList()
      await t.setData({
        weatherIndex : 0,
        weatherImage: weatherFileNameList[0],
        weatherImageLists : weatherFileNameList,
        headBackgroundAni: true
      })
    })()
    return weatherFileNameList[0]
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
          if(t.data.weatherIndex == t.data.weatherImageLists.length-1){
            weatherIndex = 0
          }else{
            weatherIndex += 1 
          }
          let weatherImage = t.data.weatherImageLists[weatherIndex]
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
            weatherIndex = t.data.weatherImageLists.length-1
          }else{
            weatherIndex -= 1
          }
          console.log(t.data.weatherImageLists[weatherIndex])
          let weatherImage = t.data.weatherImageLists[weatherIndex]
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
