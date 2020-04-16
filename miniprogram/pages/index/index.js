const app = getApp()
// const AUTH_MODE = 'fingerPrint'
const log = console.log.bind(console)
const group = console.group.bind(console)
const groupEnd = console.groupEnd.bind(console)
const error = console.error.bind(console)
const warn = console.warn.bind(console)
const chooseLocation = requirePlugin('chooseLocation');
const scui = require('../../weatherui/sc-ui');
const util = require('../../utils/util.js')
const sunCalc = require('../../utils/sunCalc.js')
const poetry = require('../../utils/poetry.js')
const config = require('../../weatherui/config/config.js')
log('[config]',config)
// import base64src from '../../utils/base64src.js'
// import vrequest from '../../utils/v-request.js'
// import calcSunUtil from '../../utils/calcnew.js'
import create from '../../utils/create'
import store from '../../store/index'
// import lazyFunction from "../../utils/lazyFunction"
var a,
  t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (a) {
    return typeof a;
  } : function (a) {
    return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  },
  e = ("function" == typeof Symbol && t(Symbol.iterator),
    function (a) {
      a && a.__esModule;
    },
    // (require("../../weatherui/assets/lib/config/config.js")), 
    {
      CLEAR_DAY: "晴",
      CLEAR_NIGHT: "晴夜",
      PARTLY_CLOUDY_DAY: "白天多云",
      PARTLY_CLOUDY_NIGHT: "夜间多云",
      CLOUDY: "阴",
      RAIN: "雨",
      WIND: "风",
      SNOW: "雪",
      HAZE: "雾霾沙尘",
      LIGHT_HAZE: "轻度雾霾",
      MODERATE_HAZE: "中度雾霾",
      HEAVY_HAZE: "重度雾霾",
      LIGHT_RAIN: "小雨",
      MODERATE_RAIN: "中雨",
      HEAVY_RAIN: "大雨",
      STORM_RAIN: "暴雨",
      FOG: "雾",
      LIGHT_SNOW: "小雪",
      MODERATE_SNOW: "中雪",
      HEAVY_SNOW: "大雪",
      STORM_SNOW: "暴雪",
      DUST: "浮尘",
      SAND: "沙尘",
      THUNDER_SHOWER: "雷阵雨",
      HAIL: "冰雹",
      SLEET: "雨夹雪"
    }
  ),
  o = {
    "01": "蓝色",
    "02": "⻩色",
    "03": "橙色",
    "04": "红色"
  },
  s = {
    "01": "台⻛",
    "02": "暴雨",
    "03": "暴雪",
    "04": "寒潮",
    "05": "⼤风",
    "06": "沙尘暴",
    "07": "⾼温",
    "08": "⼲旱",
    "09": "雷电",
    "10": "冰雹",
    "11": "霜冻",
    "12": "⼤雾",
    "13": "霾",
    "14": "道路结冰",
    "15": "森林火灾",
    "16": "雷⾬大风"
  },
  i = new(require("../../weatherui/assets/lib/qqMap/qqMap.js"))({
    key: "47ABZ-AJN3P-POPDO-VGI22-X5PBV-ZTFFP"
  }),
  r = null
create(store, {
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    windowHeight: wx.getSystemInfoSync().windowHeight,
    lastRefreshTime: '',
    initChart:!1,
    refreshChart:!1,
    refreshLocation:false,
    canBlurRoot: false,
    isChangeSetting: false,
    // isManualSetLocation: false,
    hasCusImage: false,
    networkType: '4g',
    imageBase64: '',
    qrImageURL: '',
    painting: {},
    shareImage: '',
    touchS: [0, 0],
    touchE: [0, 0],
    // headContentcurTime: '',
    // headContentSwitch: false,
    // canDrawSunCalcAgain: false,
    curDetailTime: '',
    moonPhaseLists: [],
    // scrollTop: 0,
    aqiColor: '',
    historyCityList: [],
    authScreen: false,
    strSunSet: "",
    strSunRise: "",
    bingImage: "",
    src: null,
    visible: false,
    size: {
      width: 400,
      height: 300
    },
    cropSizePercent: 0.9,

    forecastData: {
      nowTemp: "",
      nowWeather: "",
      hourlyKeypoint: "",
      // minutelyKeypoint: "",
      // nowWeatherBackground: "",
      minutely:null,
      hourly: null,
      daily: null,
      // todayWeatherQuantity: [],
      city: "",
      address: "",
      latitude: "",
      longitude: "",
      serviceData: [],
      bodyFeel: {},
      airQuality: {},
      alarmInfo: []
    },
    use: [
      'style',
      'themeValue',
      'startScreen',
      'indexHeadImageValue',
      'refreshfrequencyValue',
      'languageValue',
      'language',
      'unit',
      'unitValue',
      'getLocationMethod'
    ]
  },
  onLoad(a) {
    log('[onLoad]')
    const t = this
    const handler = function (evt) {
      log('[' + evt + ']' + '=>', evt)
    }
    store.onChange(handler)

    async function asyncGetNetworkType(){
      await wx.getNetworkType({
        success: res => {
          return res.networkType
        }
      })
    }
    asyncGetNetworkType().then( networkType =>{
      log(`[networkType] => ${networkType}`)
      if (networkType == 'none' || networkType == '2g') {
        wx.showToast({
          title: '请检查你的网络连接',
          duration: 1500,
          icon: 'none',
          mask: true,
        })
        log('[onLoad] => loadDataFromStorage()')
        t.loadDataFromStorage()
        t.setData({
          networkType: networkType
        })
      }else {
        log('[onLoad] => loadDataFromNet()')
        t.loadDataFromNet()
      }
    })
  },
  onShow() {
    const t = this
    const location = chooseLocation.getLocation();
    let hasCusImage = wx.getStorageSync('hasCusImage') || false
    if (hasCusImage == true) {
      let cusImageFileID = wx.getStorageSync('cusImageFileID')
      if (cusImageFileID) {
        t.setData({
          cusImage: cusImageFileID,
          hasCusImage: true
        })
        log('hasCusImage,cusImage')
      }
    }
    log(`[chooseLocation.getLocation()] =>`, location)
    if (location !== null) {
      log('[onShow] => location !== null')
      t.setData({
        'forecastData.city': location.city,
        'forecastData.address': location.name,
        'forecastData.longitude': location.longitude,
        'forecastData.latitude': location.latitude
      })
      if(t.store.data.startScreen == 'auth'){
        t.authScreenNext('canNavToFinalScreen')
        t.getNowWeather(false,false)
      }else{
        t.getNowWeather(false,true)
        t.setData({
          'modalName':null
        })
      }   
      app.saveData('manualLocationCityData', location)
      //make sure location value != null
      app.changeStorage('getLocationMethod', 'manual')
      // t.store.data.getLocationMethod = 'manual' //on auth screen callback => screenFadeout
    }
  },
  onReady() {
    log('[onReady]')
    const t = this
    t.getBingImage()
    t.getMoonPhaseList()
    // t.getMoonPhaseList()
    // t.getBingImage()
    // t.savePoetry()
    // t.data.datePicker = scui.DatePicker("#datepicker");
    // t.refreshWeather()
    // t.onGetWXACode()
  },
  loadDataFromStorage() {
    log('[loadDataFromStorage]')
    const t = this
    wx.getStorage({
      key: "forecastData",
      success: res => {
        t.setTimelyWeather(res.data);
        t.setNowWeather(res.data.realtime);
      }
    }),
    wx.getStorage({
      key: "historyCityList",
      success: res => {
        log(res.data[0].city)
          t.setData({
            'forecastData.city': res.data[0].city
          });
      }
    }),
    wx.getStorage({
      key: "lastRefreshTime",
      success: res => {
        t.setData({
          'lastRefreshTime': res.data
        });
      }
    }),
    t.setData({
      'bingImage': '../../weatherui/assets/images/headbackground.jpg'
    })
    t.screenFadeIn()
  },
  loadDataFromNet() {
    const t = this
    log('[loadDataFromNet]',t.store.data.startScreen)
    if(t.store.data.startScreen == 'auth'){
      t.screenFadeIn()
      log('[loadDataFromNet] => t.screenFadeIn()')
    }else{
      log('[loadDataFromNet] => t.chooseGetLocationType()')
      t.screenFadeIn()
      //根据预先选取的方法获取经纬度
      t.chooseGetLocationType()
    }
  },
  screenFadeIn() {
    const t = this
    log('[screenFadeIn]',t.store.data.startScreen)
    const poetryScreenFadeIn = () => {
      log('[poetryScreenFadeIn]')
      let poetry_storage = wx.getStorageSync('poetry_storage') || [{
        content: '春眠不觉晓'
      }]
      t.setData({
        poetry: poetry_storage[0].content
      })
      let poetryTextAction = wx.createAnimation({
        duration: 1300,
        timingFunction: 'ease-in-out',
        delay: 0,
      });
      poetryTextAction.opacity(1).step()
      t.setData({
        guideScreenTextAni: poetryTextAction.export()
      })
    }
    const authScreenFadeIn = () => {
      log('[authScreenFadeIn]')
      let authScreenFadeIn = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease-in-out',
        delay: 0,
      });
      authScreenFadeIn.opacity(1).translate3d(0, '10px', 0).step()
      t.setData({
        logoScreenAni: authScreenFadeIn.export(),
      })
    }
    const defaultScreenFadeIn = () => {
      log('[defaultScreenFadeIn]')
      let defaultScreenFadeIn = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease-in-out',
        delay: 0,
      });
      defaultScreenFadeIn.opacity(1).translate3d(0, '10px', 0).step()
      t.setData({
        logoScreenAni: defaultScreenFadeIn.export(),
      })
    }
    const event = (result) => {
      switch (true) {
        case (result == 'poetry'):
          poetryScreenFadeIn()
          break
        case (result == 'auth'):
          authScreenFadeIn()
          break
        case (result == 'default'):
          defaultScreenFadeIn()
          break
        default:
          break
      }
    }
    event(t.store.data.startScreen)
    // t.intersectionObserver()
  },
  screenFadeOut() {
    const t = this
    t.intersectionObserver()
    log('[screenFadeOut]',t.store.data.startScreen)
    const poetryScreenFadeOut = () => {
      log('[poetryScreenFadeOut]')
      let poetryScreenAction = wx.createAnimation({
        duration: 1600,
        timingFunction: 'ease-in-out',
        delay: 1200,
      });
      poetryScreenAction.opacity(0).step()
      t.setData({
        defaultScreenAni: poetryScreenAction.export()
      }),
      setTimeout(() => {
        t.setData({
          headBackgroundAni: true,
          authScreen: true
        })
      }, 3000)
    }
    const defaultScreenFadeOut = () => {
      log('[defaultScreenFadeOut]')
      let defaultScreenAction = wx.createAnimation({
        duration: 1600,
        timingFunction: 'ease-in-out',
        delay: 700,
      });
      defaultScreenAction.opacity(0).step()
      t.setData({
          defaultScreenAni: defaultScreenAction.export(),
        }),
        setTimeout(() => {
          t.setData({
            headBackgroundAni: true,
            authScreen: true
          })
        }, 2200)
    }
    const authScreenFadeOut = () => {
      log('[authScreenFadeOut]')
      let authScreenAction = wx.createAnimation({
        duration: 1400,
        timingFunction: 'ease-in-out',
        delay: 0,
      });
      authScreenAction.translate3d(-t.data.windowWidth * 3, 0, 0).opacity(0).step()
      t.setData({
        defaultScreenAni: authScreenAction.export(),
      }),
      setTimeout(() => {
        t.setData({
          headBackgroundAni: true,
          authScreen: true
        })
      }, 1600)
    }
    const event = (result) => {
      switch (true) {
        case (result == 'poetry'):
          poetryScreenFadeOut()
          break
        case (result == 'default'):
          defaultScreenFadeOut()
          break
        case (result == 'auth'):
          authScreenFadeOut()
          break
        default:
          break
      }
    }
    async function asyncScreenFadeOut(){
      await event(t.store.data.startScreen)
      // await t.getMoonPhaseList()
      // await t.getBingImage()
      await t.savePoetry()
      await t.refreshWeather()
      await t.onGetWXACode()
      await t.intersectionObserver()
    }
    t.data.datePicker = scui.DatePicker("#datepicker");

    asyncScreenFadeOut()
  },
  chooseGetLocationType() {
    log('[chooseGetLocationType]')
    const t = this
    log('[getLocationMethod] =>', t.store.data.getLocationMethod)

    const manualGetLocation = () => {
      async function awaitGetNowWeather(d){
        log('[manualGetLocation]', d)
        await t.setData({
          'forecastData.latitude': d.latitude,
          'forecastData.longitude': d.longitude,
          'forecastData.city': d.city,
          'forecastData.address': d.name
        })
        await t.getNowWeather(true,false)
      }
      awaitGetNowWeather(wx.getStorageSync('manualLocationCityData'))
    }
    const event = (result) => {
      switch (true) {
        case (result == 'manual'):
          manualGetLocation()
          break
        case (result == 'auto'):
          t.autoGetLocation()
          break
        case (result == 'historyCity'):
          t.getHistoryCityLocation()
          break
        default:
          break
      }
    }
    //根据获取经纬度的类型请求数据
    event(t.store.data.getLocationMethod)
  },
  getHistoryCityLocation(){
    const t = this
    let historyCityData = wx.getStorageSync('historyCityList')
    async function awaitGetNowWeather(historyCityData){
      await t.setData({
        'forecastData.latitude': historyCityData[0].latitude,
        'forecastData.longitude': historyCityData[0].longitude,
        'forecastData.city': historyCityData[0].city,
        'forecastData.address': historyCityData[0].address
      })
      await t.getNowWeather(true,false)
    }
    awaitGetNowWeather(historyCityData)
    t.store.data.getLocationMethod = 'historyCity'
    app.changeStorage('getLocationMethod', 'historyCity')
  },
  autoGetLocation(canNavToFinalScreen) {
    const t = this
    if(canNavToFinalScreen == true){
      t.authScreenNext('canNavToFinalScreen')
    }
    wx.getLocation({
      success: res => {
        log(`[autoGetLocation] =>`, res,canNavToFinalScreen)
        t.setData({
          'forecastData.latitude': res.latitude,
          'forecastData.longitude': res.longitude
        })
        t.store.data.getLocationMethod = 'auto'
        app.changeStorage('getLocationMethod', 'auto')
        i.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            log(`[reverseGeocoder]`, res)
            let e = res.result.address_component;
            t.setData({
              'forecastData.city': e.district,
              'forecastData.address': e.street
            })
            if(canNavToFinalScreen == true){
              t.getNowWeather(false,false)
            }else{
              t.getNowWeather(true,false)
            }
          },
          fail: err => {
            log(`[reverseGeocoder] = > ${err}`)
          }
        });
      },
      fail: err => {
        log(`[getLocation] => fail => ${err}`)
      }
    });
  },
  manualGetLocation() {
    log('[manualGetLocation]')
    const t = this
    let locationKey = config.default.locationKey
    
    const appReferer = '奇妙天气-小程序';
    const locationCategory = '奇妙天气,XHY';
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + locationKey + '&referer=' + appReferer + '&category=' + locationCategory
    });
  },
  setHistoryCityLocation(e) {
    let n = e.currentTarget.dataset
    const t = this
    log('[setHistoryCityLocation]',n.bean)
    let historyCityData = n.bean
    async function awaitToGetNowWeather (historyCityData){
      await t.setData({
        'forecastData.latitude': historyCityData.latitude,
        'forecastData.longitude': historyCityData.longitude,
        'forecastData.city': historyCityData.city,
        'forecastData.address': historyCityData.address,
        'modalName': null
      })
      await t.getNowWeather(false,true)
    }
    awaitToGetNowWeather(historyCityData)
    app.changeStorage('getLocationMethod', 'historyCity')
    t.store.data.getLocationMethod = 'historyCity'
  },
  getNowWeather(canScreenFadeOut,canRefreshChart) {
    console.time("getNowWeather")
    const t = this
      log('[getNowWeather] => canScreenFadeOut',canScreenFadeOut)
    const reqNowWeather = () =>{
      log('[getNowWeather]',t.data.forecastData.longitude,t.data.forecastData.latitude,t.store.data.getLocationMethod)
      let s = config.default.weatherApiHost + "/" + config.default.weatherApiVersion + "/" + config.default.weatherApiToken + "/" + t.data.forecastData.longitude + "," + t.data.forecastData.latitude + "/weather.json?lang=" + t.store.data.languageValue + "&dailysteps=30&alert=true&unit=" + t.store.data.unitValue
      log('[getNowWeather] => apiHost',s)
      wx.request({
        url: s,
        success: a => {
          let weatherData = a.data.result;
          const initChartOrRefresh =(canScreenFadeOut)=>{
            log('[initChartOrRefresh] =>',canScreenFadeOut)
            if(canRefreshChart == true){
              t.setData({
                'refreshChart': !0
              })
            }else if(canRefreshChart == false){
              t.setData({
                'initChart': !0
              })
            }
          }
          async function waitToCheck(weatherData,canScreenFadeOut){
            await t.setTimelyWeather(weatherData)
            await initChartOrRefresh(canScreenFadeOut)
            await app.saveData("forecastData", weatherData)
          }
          waitToCheck(weatherData,canScreenFadeOut)
        },
        complete: () => {
          a && a();
        }
      })
    }
    const screenFadeOut = () =>{
      if (canScreenFadeOut == true) {
        t.screenFadeOut()
       }
    }
    async function asyncGetNowWeather() {
        await t.setData({
          'canBlurRoot': true
        })
        await reqNowWeather()
        await t.drawSunCalc(t.data.forecastData.latitude,t.data.forecastData.longitude)
        await screenFadeOut()
        await t.setData({
          'canBlurRoot': false
        })
    }
    asyncGetNowWeather()
    console.timeEnd("getNowWeather");
  },
  setNowWeather(t) {
    log(`[setNowWeather] = >`, t)
    const o = this
    const setAqiColor = (result) => {
      switch (true) {
        case (result <= 50):
          return "#4ADC9B"
          break
        case (result > 50 && result <= 100):
          return "#F5E878"
          break
        case (result > 100 && result <= 150):
          return "#FC9F62"
          break
        case (result > 150 && result <= 200):
          return "#FD4452"
          break
        case (result > 200 && result <= 300):
          return "#B044FC"
          break
        default:
          return '#4ADC9B'
          break
      }
    }
    let
      s = t.temperature,
      i = t.skycon,
      r = {
        wind: this.getWindDirect(t.wind.direction),
        humidity: this.getHumidity(parseInt(100 * t.humidity)),
        windSpeed: t.wind.speed,
        windLevel: this.getWindLevel(t.wind.speed),
        windDirection: this.getWindDirect(t.wind.direction)
      },
      n = {
        aqi: t.air_quality.aqi.chn,
        aqiName: t.air_quality.description.chn,
        aqiDescription: o.getAqiDescription(t.air_quality.aqi.chn),
        aqiLevel: o.getAqiData(t.aqi).level,
        no2: t.air_quality.no2,
        o3: t.air_quality.o3,
        pm10: t.air_quality.pm10,
        pm25: t.air_quality.pm25,
        so2: t.air_quality.so2,
        co: t.air_quality.co
      },
      time = util.formatDate(new Date()),
      date = util.getDates(7, time),
      curDetailTime = date[0].time + " " + date[0].week,
      aqiColor = setAqiColor(t.aqi),
      nowTemp = ~~(s) + '°'
    o.setData({
      'forecastData.nowTemp': nowTemp,
      'forecastData.nowWeather': e[i],
      'forecastData.bodyFeel': r,
      'forecastData.airQuality': n,
      'aqiColor': aqiColor,
      'curDetailTime': curDetailTime
    });

    const getNowCityData = () => {
      let data = {
        address: o.data.forecastData.address,
        city: o.data.forecastData.city,
        iconPath: "https://weather.ioslide.com/weather/icon/0/" + t.skycon + "-icon.svg",
        whitePath: "https://weather.ioslide.com/weather/icon/0/" + t.skycon + "-icon-white.svg",
        backgroundBg: "https://source.unsplash.com/450x450/?" + e[i] + "," + "nature" + "," + o.data.forecastData.city,
        nowTemp: nowTemp,
        skycon: t.skycon,
        nowWeather: e[i],
        latitude: o.data.forecastData.latitude,
        longitude: o.data.forecastData.longitude,
        time: curDetailTime
      }
      log(`[setNowWeather] => `, data)
      return data
    }
    const reduceHistoryCityData = (t) => {
      let historyCityList = wx.getStorageSync("historyCityList") || [],
        hash = {},
        nowcityData = t
      historyCityList.unshift(nowcityData)
      historyCityList = historyCityList.reduce(
        function (item, next) {
          hash[next.address] ? '' : hash[next.address] = true && item.push(next);
          return item
        }, [])
      return historyCityList
    }
    async function saveHistoryCityData() {
      let nowCityData = await getNowCityData()
      let historyCityList = await reduceHistoryCityData(nowCityData)
      app.saveData("historyCityList", historyCityList)
      return historyCityList
    }
    saveHistoryCityData().then(val => {
      o.setData({
        'historyCityList': val
      })
      // o.drawSunCalc(o.data.forecastData.latitude, o.data.forecastData.longitude)
    });
    app.saveData("lastRefreshTime", date[0].time)
  },
  refreshWeather() {
    const t = this
    let refreshTime = t.store.data.refreshfrequencyValue * 60 * 1000
    log('[refreshTime]', refreshTime)
    setInterval(() => {
      log('[refreshWeather] => setInterval()', refreshTime)
      t.getNowWeather(false,true)
    }, refreshTime);
  },
  setTimelyWeather(a) {
    const that = this;
    
    log('[setTimelyWeather] => [realtime]', a.realtime)
    that.setNowWeather(a.realtime)
    // log('[setTimelyWeather] => [minutely]', a.minutely)
    // that.setData({
    //   'forecastData.minutely':{
    //     precipitation:a.minutely.precipitation,
    //     precipitation_2h:a.minutely.precipitation_2h,
    //     probability:a.minutely.probability
    //   }
    // })
    log('[setTimelyWeather] => [hourly]', a.hourly)
    for (var t = a.hourly, hourlyData = [], r = new Date().getHours(), n = 0; n < 48; n++) {
      let c = n + r;
      hourlyData.push({
        time: c % 24 + ".00",
        weather: e[t.skycon[n].value],
        weatherEN: t.skycon[n].value.replace(/_/g, ' '),
        iconPath: "https://weather.ioslide.com/weather/icon/0/" + t.skycon[n].value + "-icon",
        temp: ~~( t.temperature[n].value) + '°',
        wind: that.getWindDirect(t.wind[n].direction) + "·" + that.getWindLevel(t.wind[n].speed),
        value: t.skycon[n].value,
        precipitation:t.precipitation[n]
      });
    }

    log('[setTimelyWeather] => [daily]', a.daily)
    for (var d = a.daily, dailyData = [], f = 0; f < 16; f++) {
      let l = new Date().getDay() + f;
      l %= 7;
      let D = new Date();
      D.setDate(D.getDate() + f);
      let
        g = D.getMonth() + 1,
        h = D.getDate();
      g < 10 && (g = "0" + g), h < 10 && (h = "0" + h);
      let p = ''
      if (that.store.data.languageValue == 'zh_CN' || that.store.data.languageValue == 'zh_TW') {
        p = g + "月" + h + '日'
      } else {
        p = g + "/" + h
      }

      let chartsMargin = ~~(d.temperature[f].min)
      //Set a horizontal line
      if (chartsMargin < 0) {
        chartsMargin = ~~(d.temperature[f].min) + 20
      }


      const getWeek = (l) => {
        let tweek = ''
        if (that.store.data.languageValue == 'zh_CN' || that.store.data.languageValue == 'zh_TW') {
          tweek = "星期" + "天一二三四五六".charAt(l)
        } else if (that.store.data.languageValue == 'en_US' || that.store.data.languageValue == 'en_GB') {
          tweek = ["Mon.", "Tues.", "Wed.", "Thur.", "Fri.", "Sat.", "Sun."][l]
        }
        // log('[tweek]',tweek)
        return tweek
      }
      dailyData.push({
        date: getWeek(l),
        weather: e[d.skycon[f].value],
        weatherEN: d.skycon[f].value.replace(/_/g, ' '),
        iconPath: "https://weather.ioslide.com/weather/icon/0/" + d.skycon[f].value + "-icon",
        min: ~~(d.temperature[f].min),
        max: ~~(d.temperature[f].max),
        monthday: p,
        id: d.skycon[f].value,
        aqi: d.air_quality.aqi[f].avg.chn,
        astro: {
          date: d.astro[f].date.substring(0, 10),
          sunrise: d.astro[f].sunrise,
          sunset: d.astro[f].sunset
        },
        windLevel: that.getWindLevel(d.wind[f].avg.speed),
        windDirect: that.getWindDirect(d.wind[f].avg.direction)
      });
    }

    if (that.store.data.languageValue == 'zh_CN') {
      var serviceData = [{
        desc: ~~(d.temperature[0].avg) + '°',
        name: "体感温度",
        type: "sw-temperature"
      }, {
        desc: ~~(d.humidity[0].avg * 100) + "%",
        name: "湿度",
        type: "sw-humidity"
      }, {
        desc: ~~(d.life_index.ultraviolet[0].index),
        name: "紫外线指数",
        type: "sw-ultraviolet"
      }, {
        desc: d.visibility[0].avg + "km",
        name: "能见度",
        type: "sw-visibility"
      }, {
        desc: d.cloudrate[0].avg,
        name: "云量",
        type: "sw-cloudrate"
      }, {
        desc: ~~(d.pressure[0].avg) + "mb",
        name: "气压",
        type: "sw-pressure"
      }]
    } else if (that.store.data.languageValue == 'zh_TW') {
      var serviceDatam = [{
        desc: ~~(d.temperature[0].avg) + '°',
        name: "體感溫度",
        type: "sw-temperature"
      }, {
        desc: ~~(d.humidity[0].avg * 100) + "%",
        name: "濕度",
        type: "sw-humidity"
      }, {
        desc: ~~(d.life_index.ultraviolet[0].index),
        name: "紫外線指數",
        type: "sw-ultraviolet"
      }, {
        desc: d.visibility[0].avg + "km",
        name: "能見度",
        type: "sw-visibility"
      }, {
        desc: d.cloudrate[0].avg,
        name: "雲量",
        type: "sw-cloudrate"
      }, {
        desc: ~~(d.pressure[0].avg) + "mb",
        name: "氣壓",
        type: "sw-pressure"
      }]
    } else if (that.store.data.languageValue == 'en_GB' || that.store.data.languageValue == 'en_US') {
      var serviceData = [{
        desc: ~~(d.temperature[0].avg) + '°',
        name: "Feels Like",
        type: "sw-temperature"
      }, {
        desc: ~~(d.humidity[0].avg * 100) + "%",
        name: "Humidity",
        type: "sw-humidity"
      }, {
        desc: ~~(d.life_index.ultraviolet[0].index),
        name: "UV index",
        type: "sw-ultraviolet"
      }, {
        desc: d.visibility[0].avg + "km",
        name: "Visibility",
        type: "sw-visibility"
      }, {
        desc: d.cloudrate[0].avg,
        name: "Cloudiness",
        type: "sw-cloudrate"
      }, {
        desc: ~~(d.pressure[0].avg) + "mb",
        name: "Pressure",
        type: "sw-pressure"
      }]
    }

    that.setData({
      'forecastData.daily': dailyData,
      'forecastData.hourly': hourlyData,
      'forecastData.hourlyKeypoint': a.hourly.description,
      'forecastData.serviceData': serviceData,
      // 'forecastData.minutelyKeypoint': a.minutely.description,
      // 'forecastData.minutely':{
      //   precipitation:a.minutely.precipitation,
      //   precipitation_2h:a.minutely.precipitation_2h,
      //   probability:a.minutely.probability
      // }
    });

    async function alertContent() {
      if (a.alert.content == []) {
        return
      } else {
        for (var y = a.alert.content, v = [], w = 0; w < y.length; w++) {
          v.push({
            level: y[w].code.slice(2, 4),
            alertType: y[w].code.slice(0, 2),
            content: y[w].description,
            source: y[w].source,
            levelName: o[y[w].code.slice(2, 4)],
            typeName: s[y[w].code.slice(0, 2)]
          });
        }
        return v
      }
    }
    alertContent().then(v => {
      that.setData({
        'forecastData.alarmInfo': v
      })
    })

  },
  getAqiData(a) {
    let t = "优",
      e = 1,
      o = "#A3D765";
    return a <= 50 ? (t = "优", e = 1, o = "#A3D765") : 51 <= a && a <= 100 ? (t = "良",
      e = 2, o = "#F0CC35") : 101 <= a && a <= 150 ? (t = "轻度污染", e = 3, o = "#F1AB62") : 151 <= a && a <= 200 ? (t = "中度污染",
      e = 4, o = "#EF7F77") : 201 <= a && a <= 300 ? (t = "重度污染", e = 5, o = "#B28CCB") : a > 300 && (t = "严重污染",
      e = 6, o = "#AD788A"), {
      name: t,
      color: o,
      level: e
    };
  },
  getAqiDescription(a) {
    const self = this,
      zh_CN = () => {
        let d = '暂无描述'
        return a = 0 ? (d = "暂无描述") : a <= 50 ? (d = "令人满意的空气质量") : 51 <= a && a <= 100 ? (d = "可以接受的空气质量") : 101 <= a && a <= 150 ? (d = "敏感人群可能会感到不适") : 151 <= a && a <= 200 ? (d = "一般人群应避免户外活动") : 201 <= a && a <= 300 ? (d = "健康预警：一般人群可能会出现不适应症状") : a > 300 && (d = "紧急情况下的健康预警"), d;
      },
      zh_TW = () => {
        let d = '暫無描述'
        return a = 0 ? (d = "暫無描述") : a <= 50 ? (d = "令人滿意的空氣質量") : 51 <= a && a <= 100 ? (d = "可以接受的空氣質量") : 101 <= a && a <= 150 ? (d = "敏感人群可能會感到不適") : 151 <= a && a <= 200 ? (d = "一般人群應避免戶外活動") : 201 <= a && a <= 300 ? (d = "健康預警：一般人群可能會出現不適應症狀") : a > 300 && (d = "緊急情況: 健康預警"), d;
      },
      en_US_en_GB = () => {
        let d = 'No description'
        return a = 0 ? (d = "No description") : a <= 50 ? (d = "Satisfactory air quality") : 51 <= a && a <= 100 ? (d = "Acceptable air quality") : 101 <= a && a <= 150 ? (d = "Sensitive people may feel unwell") : 151 <= a && a <= 200 ? (d = "The general population should avoid outdoor activities") : 201 <= a && a <= 300 ? (d = "Health alert: general population may experience symptoms of maladjustment") : a > 300 && (d = "Health alert in emergencies"), d;
      }
    const event = (result) => {
      switch (true) {
        case (result == 'zh_CN'):
          return zh_CN()
          break
        case (result == 'zh_TW'):
          return zh_TW()
          break
        case (result == 'en_US' || result == 'en_GB'):
          return en_US_en_GB()
          break
        default:
          break
      }
    }
    log('[getWindSpeed]', self.store.data.languageValue)
    return event(self.store.data.languageValue)
  },
  getWindLevel(a) {
    const self = this
    let t = 0
    1 <= a && a <= 5 ? t = 1 : 6 <= a && a <= 11 ? t = 2 : 12 <= a && a <= 19 ? t = 3 : 20 <= a && a <= 28 ? t = 4 : 29 <= a && a <= 38 ? t = 5 : 39 <= a && a <= 49 ? t = 6 : 50 <= a && a <= 61 ? t = 7 : 62 <= a && a <= 74 ? t = 8 : 75 <= a && a <= 88 ? t = 9 : 89 <= a && a <= 102 ? t = 10 : 103 <= a && a <= 117 ? t = 11 : 118 <= a && a <= 133 ? t = 12 : 134 <= a && a <= 149 ? t = 13 : 150 <= a && a <= 166 ? t = 14 : 167 <= a && a <= 183 ? t = 15 : 184 <= a && a <= 201 ? t = 16 : 202 <= a && a <= 220 && (t = 17),
      t;
    if (self.store.data.languageValue == 'en_US' || self.store.data.languageValue == 'en_GB') {
      t = "WindLevel: " + t
    } else if (self.store.data.languageValue == 'zh_TW') {
      t = "風力:" + t + "級"
    } else if (self.store.data.languageValue == 'zh_CN') {
      t = "风力:" + t + "级"
    }
    return t
  },
  getWindSpeed(a) {
    const self = this,
      zh_CN = () => {
        let t = "软风";
        return a < 1 ? t = "无风" : 1 <= a <= 5 ? t = "软风" : 6 <= a <= 11 ? t = "轻风" : 12 <= a <= 19 ? t = "微风" : 20 <= a <= 28 ? t = "和风" : 29 <= a <= 38 ? t = "清风" : 39 <= a <= 49 ? t = "强风" : 50 <= a <= 61 ? t = "疾风" : 62 <= a <= 74 ? t = "大风" : 75 <= a <= 88 ? t = "烈风" : 89 <= a <= 102 ? t = "狂风" : 103 <= a <= 117 ? t = "暴风" : 118 <= a <= 133 ? t = "台风" : 134 <= a <= 149 ? t = "台风" : 150 <= a <= 166 ? t = "强台风" : 167 <= a <= 183 ? t = "强台风" : 184 <= a <= 201 ? t = "超强台风" : 202 <= a <= 220 ? t = "超强台风" : a >= 221 && (t = "超强台⻛"),
          t;
      },
      zh_TW = () => {
        let t = "軟風";
        return a < 1 ? t = "無風" : 1 <= a <= 5 ? t = "軟風" : 6 <= a <= 11 ? t = "輕風" : 12 <= a <= 19 ? t = "微風" : 20 <= a <= 28 ? t = "和風" : 29 <= a <= 38 ? t = "清風" : 39 <= a <= 49 ? t = "強風" : 50 <= a <= 61 ? t = "疾風" : 62 <= a <= 74 ? t = "大風" : 75 <= a <= 88 ? t = "烈風" : 89 <= a <= 102 ? t = "狂風" : 103 <= a <= 117 ? t = "暴風" : 118 <= a <= 133 ? t = "颱風" : 134 <= a <= 149 ? t = "颱風" : 150 <= a <= 166 ? t = "強颱風" : 167 <= a <= 183 ? t = "強颱風" : 184 <= a <= 201 ? t = "超強颱風" : 202 <= a <= 220 ? t = "超強颱風" : a >= 221 && (t = "超強颱風"),
          t;
      },
      en_US_en_GB = () => {
        let t = "Light air";
        return a < 1 ? t = "Calm" : 1 <= a <= 5 ? t = "Light air" : 6 <= a <= 11 ? t = "Light breeze" : 12 <= a <= 19 ? t = "Gentle breeze" : 20 <= a <= 28 ? t = "Moderate breeze" : 29 <= a <= 38 ? t = "Fresh breeze" : 39 <= a <= 49 ? t = "Strong breeze" : 50 <= a <= 61 ? t = "Near Gale" : 62 <= a <= 74 ? t = "Gale" : 75 <= a <= 88 ? t = "Severe Gale" : 89 <= a <= 102 ? t = "Storm" : 103 <= a <= 117 ? t = "Violent Storm" : 118 <= a <= 133 ? t = "Hurricane" : 134 <= a <= 149 ? t = "Hurricane" : 150 <= a <= 166 ? t = "Strong hurricane" : 167 <= a <= 183 ? t = "Strong hurricane" : 184 <= a <= 201 ? t = "Super Hurricane" : 202 <= a <= 220 ? t = "Super Hurricane" : a >= 221 && (t = "Super Hurricane"),
          t;
      }
    const event = (result) => {
      switch (true) {
        case (result == 'zh_CN'):
          return zh_CN()
          break
        case (result == 'zh_TW'):
          return zh_TW()
          break
        case (result == 'en_US' || result == 'en_GB'):
          return en_US_en_GB()
          break
        default:
          break
      }
    }
    log('[getWindSpeed]', self.store.data.languageValue)
    return event(self.store.data.languageValue)
  },
  getHumidity(a) {
    const self = this
    if (self.store.data.languageValue == 'en_US' || self.store.data.languageValue == 'en_GB') {
      a = "Humidity: " + a + "%"
    } else if (self.store.data.languageValue == 'zh_TW') {
      a = "濕度: " + a + "%"
    } else if (self.store.data.languageValue == 'zh_CN') {
      a = "湿度: " + a + "%"
    }
    log('[getHumidity] => ', a)
    return a
  },
  getWindDirect(a) {
    const self = this,
      zh_CN = () => {
        let t = "北";
        return 11.26 <= a && a <= 78.75 ? t = "东北" : 78.76 <= a && a <= 101.25 ? t = "东" : 101.26 <= a && a <= 168.75 ? t = "东南" : 168.76 <= a && a <= 191.25 ? t = "南" : 191.26 <= a && a <= 258.75 ? t = "西南" : 258.76 <= a && a <= 281.25 ? t = "西" : 281.26 <= a && a <= 348.75 && (t = "西北"),
          t + "风";
      },
      zh_TW = () => {
        let t = "北";
        return 11.26 <= a && a <= 78.75 ? t = "東北" : 78.76 <= a && a <= 101.25 ? t = "東" : 101.26 <= a && a <= 168.75 ? t = "東南" : 168.76 <= a && a <= 191.25 ? t = "南" : 191.26 <= a && a <= 258.75 ? t = "西南" : 258.76 <= a && a <= 281.25 ? t = "西" : 281.26 <= a && a <= 348.75 && (t = "西北"),
          t + "風";
      },
      en_US_en_GB = () => {
        let t = "North";
        return 11.26 <= a && a <= 78.75 ? t = "Northeast" : 78.76 <= a && a <= 101.25 ? t = "East" : 101.26 <= a && a <= 168.75 ? t = "Southeast" : 168.76 <= a && a <= 191.25 ? t = "South" : 191.26 <= a && a <= 258.75 ? t = "Southwest" : 258.76 <= a && a <= 281.25 ? t = "West" : 281.26 <= a && a <= 348.75 && (t = "Northwest"),
          "WindDirect: " + t;
      }
    const event = (result) => {
      switch (true) {
        case (result == 'zh_CN'):
          return zh_CN()
          break
        case (result == 'zh_TW'):
          return zh_TW()
          break
        case (result == 'en_US' || result == 'en_GB'):
          return en_US_en_GB()
          break
        default:
          break
      }
    }
    return event(self.store.data.languageValue)
  },
  getMoonPhaseList(){
    // getMoonPhaseList:lazyFunction.throttle( () => {
    // async getMoonPhaseList() {
    log('[getMoonPhaseList]')
    const t = this
    let obj = Array.from(Array(30), (v, k) => k)
    obj.map(function (value, index, arr) {
      const getMoonName = (r) => {
        // log('[getMoonName]',r)
        let
          zh_CN = '新月',
          zh_TW = '新月',
          en_US_en_GB = 'New Moon';
        return r <= 0.055 ? (zh_CN = '新月', zh_TW = '新月', en_US_en_GB = 'New Moon') : 0.055 < r && r <= 0.245 ? (zh_CN = '峨眉月', zh_TW = '峨眉月', en_US_en_GB = 'Waxing Crescent') : 0.245 < r && r <= 0.255 ? (zh_CN = '上弦月', zh_TW = '上弦月', en_US_en_GB = 'First Quarter') : 0.255 < r && r <= 0.495 ? (zh_CN = '盈凸月', zh_TW = '盈凸月', en_US_en_GB = 'Waxing Gibbous') : 0.495 < r && r <= 0.51 ? (zh_CN = '满月', zh_TW = '滿月', en_US_en_GB = 'Full Moon') : 0.51 < r && r <= 0.745 ? (zh_CN = '亏凸月', zh_TW = '虧凸月', en_US_en_GB = 'Waning Gibbous') : 0.745 < r && r <= 0.755 ? (zh_CN = '下弦月', zh_TW = '下弦月', en_US_en_GB = 'Last Quarter') : 0.755 < r && r <= 1 ? (zh_CN = '残月', zh_TW = '殘月', en_US_en_GB = 'Waning Crescent') : r > 1 && (zh_CN = '丽月', zh_TW = '丽月', en_US_en_GB = 'Li Yue'), {
          zh_CN: zh_CN,
          en_US_en_GB: en_US_en_GB,
          zh_TW: zh_TW
        }
      }
      let moonListsTime = []
      moonListsTime[index] = new Date()
      moonListsTime[index].setDate(moonListsTime[index].getDate() + index)
      let objDetailValue = {
        moonPhaseIndex: sunCalc.getMoonIllumination(moonListsTime[index]).phase,
        moonPhaseDate_zh_CN: moonListsTime[index].getMonth() + 1 + "月" + moonListsTime[index].getDate() + "日",
        moonPhaseDate_zh_TW: moonListsTime[index].getMonth() + 1 + "月" + moonListsTime[index].getDate() + "日",
        moonPhaseDate_en_US_en_GB: moonListsTime[index].getMonth() + 1 + "/" + moonListsTime[index].getDate(),
        moonPhaseName_zh_CN: '',
        moonPhaseName_en_US_en_GB: '',
        moonPhaseName_zh_TW: '',
        moonPhaseName_Image: ''
      }
      obj.fill(objDetailValue, index, index + 1)
      let moonPhaseName = getMoonName(obj[index].moonPhaseIndex)
      obj[index].moonPhaseName_zh_CN = moonPhaseName.zh_CN
      obj[index].moonPhaseName_en_US_en_GB = moonPhaseName.en_US_en_GB,
        obj[index].moonPhaseName_zh_TW = moonPhaseName.zh_TW,
        obj[index].moonPhaseName_Image = moonPhaseName.en_US_en_GB.replace(' ', '')
    })
    let reduceObj = {},
      moonPhaseLists = obj.reduce((item, next) => {
        // log('[next]',next)
        if (!reduceObj[next.moonPhaseName_zh_CN]) {
          item.push(next);
          reduceObj[next.moonPhaseName_zh_CN] = true;
        }
        return item;
      }, []) || []

    t.setData({
      moonPhaseLists: moonPhaseLists
    })
    log(`[moonPhaseLists] =>`, moonPhaseLists)
  },
  drawSunCalc(a, b) {
    log('[drawSunCalc]')
    const t = this
    let sunriseTime = '',
      sunsetTime = ''

    let sun = sunCalc.getTimes(new Date(),t.data.forecastData.latitude, t.data.forecastData.longitude)
    if (sun.sunrise.getMinutes() < 10) {
      sunriseTime = sun.sunrise.getHours() + ":0" + sun.sunrise.getMinutes()
    } else {
      sunriseTime = sun.sunrise.getHours() + ":" + sun.sunrise.getMinutes()
    }
    if (sun.sunset.getMinutes() < 10) {
      sunsetTime = sun.sunset.getHours() + ":0" + sun.sunset.getMinutes()
    } else {
      sunsetTime = sun.sunset.getHours() + ":" + sun.sunset.getMinutes()
    }
    const drawSun = (a, b) => {
      // Draw Half C
      let cxt_arc = wx.createCanvasContext('canvasArc');
      // log(cxt_arc)
      cxt_arc.clearRect(0, 0, 212, 106)
      cxt_arc.setLineWidth(1.3);
      cxt_arc.setStrokeStyle(a);
      cxt_arc.setLineCap('round')
      cxt_arc.setLineDash([3, 3, 3]);
      cxt_arc.beginPath();
      cxt_arc.arc(106, 106, 100, 0, -Math.PI * 1, true);
      cxt_arc.stroke();
      cxt_arc.setLineWidth(1.3);
      cxt_arc.setStrokeStyle(b);
      cxt_arc.setLineCap('round')
      cxt_arc.beginPath();
      //Draw Now Time C
      let
        curTime = sun.sunset.getHours() - new Date().getHours(),
        allTime = sun.sunset.getHours() - sun.sunrise.getHours(),
        cirTime = parseFloat((curTime / allTime).toFixed(1))

      cxt_arc.arc(106, 106, 100, 0, Math.PI * (2 - cirTime), true);
      cxt_arc.stroke();
      cxt_arc.draw();
      log(`[drawSunCalc]=>${a} ${b} `)
    }
    var setStrokeStyleColorSunRise = '',
      setStrokeStyleColorFullDay = ''
    if (t.store.data.themeValue == 'dark') {
      setStrokeStyleColorSunRise = 'rgb(255,201,84)'
      setStrokeStyleColorFullDay = 'rgb(92,92,92)'
      drawSun(setStrokeStyleColorSunRise, setStrokeStyleColorFullDay)
    }
    if (t.store.data.themeValue == 'light') {
      setStrokeStyleColorSunRise = 'rgb(193, 198, 204)'
      setStrokeStyleColorFullDay = 'rgb(224, 229, 233)'
      drawSun(setStrokeStyleColorSunRise, setStrokeStyleColorFullDay)
    }
    t.setData({
      strSunSet: sunsetTime,
      strSunRise: sunriseTime
    })

  },

  getBingImage() {
    log('[getBingImage]')
    const t = this
    wx.request({
      // url: 'https://www.benweng.com/api/bing/lists',
      url: 'https://www.benweng.com/api/bing/getlastimg',
      header: {
        "content-type": "application/json"
      },
      success: res => {
        log('[requestBing]', res)
        let bingImage = res.data.img
        t.setData({
          bingImage: bingImage
        })
      },
      fail: err => {
        log('requestBing', err)
        t.setData({
          'bingImage': {
            img_url: '../../materialui/lib/scui/dist/assets/images/headbackground.jpg'
          }
        });
      }
    });
  },
  onAuthFinalScreen() {
    log('[onAuthFinalScreen]')
    const t = this
    const getNowWeather = () =>{
      if (t.data.isChangeSetting == true) {
        t.getNowWeather(false,true)
      }
    }
    async function onScreenFadeOut(){
      await getNowWeather()
      await t.screenFadeOut()
    }
    onScreenFadeOut()
  },
  authScreenNext(e) {
    log('[authScreenNext]')
    const t = this
    var windowWidth = t.data.windowWidth
    const checkLocationAuth = () => {
      log('[authScreenNext] => checkLocationAuth')
      wx.getSetting({
        success: res => {
          log(`[authSetting] =>`, res)
          if (res.authSetting['scope.userLocation']) {
            transX(windowWidth * 2)
            app.saveData('hasUserLocation', true)
            app.changeStorage('startScreen', 'poetry')
            log('[hasUserLocation]')
          }
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success: res => {
                log('check => [wx.authorize] =>', res)
                transX(windowWidth * 2)
                app.saveData('hasUserLocation', true)
                app.changeStorage('startScreen', 'poetry')
              },
              fail: err => {
                //req location auth again
                log(`check = > [wx.authorize] =>`, err)
                wx.showModal({
                  title: '是否auth以下应用权限',
                  content: '地理位置',
                  confirmText: "确认",
                  cancelText: "取消",
                  success: res => {
                    if (res.confirm) {
                      wx.openSetting({
                        success: res => {
                          log(`[wx.openSetting] =>`, res, res.authSetting['scope.userLocation'])
                          if (res.authSetting['scope.userLocation'] == true) {
                            transX(windowWidth * 2)
                            app.saveData('hasUserLocation', true)
                            app.changeStorage('startScreen', 'poetry')
                            log('[scope.userLocation] success')
                          }
                        }
                      });
                    } else {
                      log('[scope.userLocation] fail')
                    }
                  }
                });
              }
            })
          }
        }
      })
    }
    const transX = (steps) => {
      log('[transX] =>', steps)
      const t = this
      let stepAction = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease-in-out',
        delay: 0
      });
      stepAction.translate3d(-steps, 0, 0).step()
      t.setData({
        defaultScreenAni: stepAction.export(),
      })
    }
    if (e == 'canNavToFinalScreen') {
      transX(windowWidth * 3)
    } else {
      const event = (result) => {
        switch (true) {
          case (result == 'authFirstStep'):
            log('[authFirstStep]')
            transX(windowWidth)
            break
          case (result == 'authSecondStep'):
            // transX(windowWidth*2)
            log('[authSecondStep]')
            checkLocationAuth()
            break
          case (result == 'authThirdStep'):
            log('[authThirdStep]')
            transX(windowWidth * 3)
            break
          case (result == 'authFourthStep'):
            log('[authFourthStep]')
            transX(windowWidth * 3)
            break
          default:
            break
        }
      }
      event(e.currentTarget.dataset.target)
    }
  },
  authScreenBack(e) {
    log('[authScreenBack]')
    const
      t = this,
      windowWidth = t.data.windowWidth
    const transX = (steps) => {
      const t = this
      let authFirstStep = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease-in-out',
        delay: 0
      });
      authFirstStep.translate3d(-steps, 0, 0).step()
      t.setData({
        defaultScreenAni: authFirstStep.export(),
      })
    }
    const event = (result) => {
      switch (true) {
        case (result == 'authFirstStep'):
          transX(windowWidth)
          break
        case (result == 'authSecondStep'):
          transX(windowWidth)
          break
        case (result == 'authThirdStep'):
          transX(windowWidth * 2)
          break
        case (result == 'authFourthStep'):
          transX(windowWidth * 2)
          break
        default:
          break
      }
    }
    event(e.currentTarget.dataset.target)
  },
  savePoetry() {
    // async savePoetry() {
      log('[savePoetry]')
    const t = this
    poetry.load(
      result => {
        let temp = wx.getStorageSync('poetry_storage') || [{
            content: '春眠不觉晓，处处闻啼鸟'
          }],
          poetryData = []
        if (temp.length > 6) {
          poetryData = temp.slice(0, 5)
        } else {
          poetryData = temp
        }

        log(`[savePoetry] => poetryData =>`, poetryData)
        result.data.content = result.data.content.substring(0, result.data.content.lastIndexOf('。'))
        poetryData.unshift(result.data)
        app.saveData("poetry_storage", [...new Set(poetryData)])
      })
  },
  switchChange(e) {
    log('[switchChange]')
    const t = this
    const changeStoreage = (result) => {
      t.store.data.style[result] = !t.store.data.style[result]
      log(result, t.store.data.style[result])
      app.changeStorage('style', t.store.data.style)
    }
    const event = (result) => {
      switch (true) {
        case (result == 'manualGetLocation'):
          log('[switchChange] => manualGetLocation')
          t.manualGetLocation()
          break
        case (result == 'autoGetLocation'):
          log('[switchChange] => autoGetLocation')
          t.autoGetLocation(true)
          break
        // case (result == 'sunlightSwitchChange'):
        //   log('[switchChange] => sunlightSwitchChange')
        //   t.drawSunCalc(t.data.forecastData.latitude, t.data.forecastData.longitude)
        //   changeStoreage(result)
        //   break
        default:
          changeStoreage(result)
          break
      }
    }
    event(e.currentTarget.dataset.target)
  },
  showModal(e) {
    log('[showModal]', e)
    const t = this
    const setData = (modalName) => {
      t.setData({
        modalName: modalName
      })
    }
    const event = (result) => {
      switch (true) {
        case (result == 'DrawerModalL'):
          setData(result)
          break
        case (result == 'DrawerModalB'):
          setData(result)
          t.onGetWXACode()
          break
        case (result == 'DrawerModalR'):
          setData(result)
          break
        case (result == 'shareImage'):
          setData(result)
          t.eventDraw()
          break
        default:
          setData(result)
          break
      }
    }
    event(e.currentTarget.dataset.target)
    // event(e.detail)
  },
  showModalListener(e) {
    log('[showModal]', e)
    const t = this
    const setData = (modalName) => {
      t.setData({
        modalName: modalName
      })
    }
    const event = (result) => {
      switch (true) {
        case (result == 'DrawerModalL'):
          setData(result)
          break
        case (result == 'DrawerModalB'):
          setData(result)
          t.onGetWXACode()
          break
        case (result == 'DrawerModalR'):
          setData(result)
          break
        case (result == 'shareImage'):
          setData(result)
          t.eventDraw()
          break
        default:
          setData(result)
          break
      }
    }
    // event(e.currentTarget.dataset.target)
    event(e.detail)
  },
  hideModal(e) {
    log('[hideModal]')
    const t = this
    const setData = (modalName) => {
      t.setData({
        modalName: null
      })
    }
    const event = (result) => {
      switch (true) {
        case (result == 'DrawerModalR'):
          setData(result)
          t.intersectionObserver()
          break
        default:
          setData(result)
          break
      }
    }
    event(e.currentTarget.dataset.target)
    wx.hideLoading()
    // const t = this
    // t.setData({
    //   modalName: null
    // })
  },
  navChange(e) {
    log(`[navChange] => ${e.currentTarget.dataset.cur}`)
    const cur = e.currentTarget.dataset.cur
    wx.navigateTo({
      url: '../' + cur + '/' + cur
    });
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
  onPullDownRefresh() {
    log(`[onPullDownRefresh]`)
    const t = this

    let time = util.formatDate(new Date()) , date = util.getDates(7, time)
    app.saveData("lastRefreshTime", date[0].time)
    async function onPull (){
      await t.setData({
        'canBlurRoot': true
      })
      await t.getNowWeather(false,true) //(canScreenFadeOut,canRefreshChart)
      await wx.stopPullDownRefresh();
      await t.setData({
        'canBlurRoot': false
      })
    }
    onPull()
  },
  onReachBottom() {
    log(`[onReachBottom]`)
  },
  eventDraw() {
    log(`[eventDraw]`)
    wx.showLoading({
      title: 'Loading',
      mask: true
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    const t = this
    t.setData({
      painting: {
        width: 300,
        height: 350,
        clear: true,
        views: [{
            type: 'image',
            url: t.data.bingImage,
            top: 0,
            left: 0,
            width: 300,
            height: 210
          },
          {
            type: 'rect',
            background: '#ffffff',
            top: 210,
            left: 0,
            width: 300,
            height: 140
          },
          {
            type: 'text',
            content: t.data.forecastData.hourlyKeypoint,
            fontSize: 14,
            lineHeight: 21,
            color: '#383549',
            textAlign: 'center',
            top: 220,
            left: 146,
            width: 200,
            MaxLineNumber: 2,
            breakWord: true,
            bolder: true
          },
          {
            type: 'image',
            url: t.data.qrImageURL, //二维码
            top: 270,
            left: 120,
            width: 65,
            height: 65
          }
        ]
      }
    })
  },
  eventSave() {
    log(`[eventSave]`)
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success: res => {
        wx.showToast({
          title: '保存图片成功',
          mask: true,
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  eventGetImage(event) {
    log(`[eventGetImage] => `)
    log(event)
    wx.hideLoading()
    const {
      tempFilePath,
      errMsg
    } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      log('[canvasdrawer] => success')
      this.setData({
        shareImage: tempFilePath
      })
    }
  },
  subDailyWeather() {
    log(`[subDailyWeather] => datePicker.open()`)
    this.data.datePicker.open();
  },
  datePickerSubmit(e) {
    var
      submitValue = e.detail.value,
      time = util.formatDate(submitValue),
      date = util.getDates(7, time),
      startTime = date[0].time
    log('[submitStartTime] =>', startTime)

    const
      t = this,
      templateId = '3HGni7nX2GM6bmaKk-_Mldf-mPFCmhFYIpEWBksBmUI'
    const subDailyWeatherCloudFn = () => {
      let cloudData = {
        action: 'saveSubscribeMessage',
        page: 'pages/index/index',
        latitude: t.data.forecastData.latitude,
        city: t.data.forecastData.city,
        startTime: startTime,
        longitude: t.data.forecastData.longitude,
        templateId: '3HGni7nX2GM6bmaKk-_Mldf-mPFCmhFYIpEWBksBmUI',
        done: false
      }
      wx.cloud.callFunction({
        name: 'openapi',
        data: cloudData,
        success: res => {
          wx.hideLoading({
            success: () => {
              wx.showToast({
                title: '订阅成功',
                icon: 'success',
                duration: 1000,
                mask: true
              });
            }
          });
          log(`[subDailyWeatherCloudFn] => OK => ${res}`)
        },
        fail: err => {
          log(`[subDailyWeatherCloudFn] => Fail => ${err}`)
        }
      })
    }
    const unSubDailyWeatherCloudFn = () => {
      let cloudData = {
        action: 'deleteSubscribeMessage',
        startTime: startTime,
        templateId: '3HGni7nX2GM6bmaKk-_Mldf-mPFCmhFYIpEWBksBmUI'
      }
      wx.cloud.callFunction({
        name: 'openapi',
        data: cloudData,
        success: res => {
          wx.showToast({
            mask: true,
            title: '取消订阅成功',
            icon: 'success',
            duration: 1000,
          });
          log(`[unSubDailyWeatherCloudFn] => Success => ${res}`)
        },
        fail: err => {
          log(`[unSubDailyWeatherCloudFn] => Fail => ${err}`)
        }
      })
    }
    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      success: res => {
        if (res.errMsg === 'requestSubscribeMessage:ok') {
          if (res[templateId] === 'accept') {
            wx.showLoading({
              title: 'Loading',
            })
            subDailyWeatherCloudFn()
          } else {
            unSubDailyWeatherCloudFn()
          }
        }
      },
    });

  },
  openDatePicker() {
    this.data.datePicker.open();
  },
  pickerOpen() {
    console.log(`picker opening`);
  },
  pickerClose() {
    console.log(`picker closing`);
  },
  pickerOpened() {
    console.log(`picker opened`);
  },
  pickerClosed() {
    console.log(`picker closed`);
  },
  EventHandle(e) {
    log('[official-account] =>', e)
  },
  touchStart(e) {
    log('[touchStart]')
    // console.log(e.touches[0].pageX)
    let
      sx = e.touches[0].pageX,
      sy = e.touches[0].pageY
    this.data.touchS = [sx, sy]
  },
  touchMove(e) {
    log('[touchMove]')
    let
      sx = e.touches[0].pageX,
      sy = e.touches[0].pageY
    this.data.touchE = [sx, sy]
  },
  touchEnd(e) {
    log('[touchEnd]')
    const t = this
    let
      start = this.data.touchS,
      end = this.data.touchE
    if (start[0] < end[0] - 50) {} else if (start[0] > end[0] + 50) {
      t.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {}
  },
  touchEndLess(e) {
    log('[touchEndLess]')
    const t = this
    let start = this.data.touchS
    let end = this.data.touchE
    if (start[0] < end[0] - 5) {
      // console.log('右滑')
    } else if (start[0] > end[0] + 5) {
      // console.log('左滑')
      t.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {}
  },
  intersectionObserver() {
    log('[intersectionObserver]')
    const t = this
    var ani = wx.createAnimation({
      duration: 700,
      timingFunction: 'ease-in-out',
      delay: 500,
    });
    wx.createIntersectionObserver().relativeToViewport().observe('#firstObserver', (res) => {
      if (res.boundingClientRect.top > 0) {
        log('[firstObserver] => start')
        ani.opacity(1).step()
        t.setData({
          firstObserverAni: ani.export()
        })
      }
      if (res.boundingClientRect.top < 0) {
        log('[firstObserver] => end')
      }
    })
    wx.createIntersectionObserver().relativeToViewport().observe('#temperatureObserver', (res) => {
      if (res.boundingClientRect.top > 0) {
        log('[temperatureObserver] => start')
        ani.opacity(1).step()
        t.setData({
          temperatureObserverAni: ani.export()
        })
      }
      if (res.boundingClientRect.top < 0) {
        log('[temperatureObserver] => end')
      }
    })
    wx.createIntersectionObserver().relativeToViewport().observe('#thirdObserver', (res) => {
      if (res.boundingClientRect.top > 0) {
        log('[thirdObserver] => start')
        ani.opacity(1).step()
        t.setData({
          thirdObserverAni: ani.export()
        })

      }
      if (res.boundingClientRect.top < 0) {
        log('[thirdObserver] => end')
      }
    })
    wx.createIntersectionObserver().relativeToViewport().observe('#rainObserver', (res) => {
      if (res.boundingClientRect.top > 0) {
        log('[rainObserver] => start')
        ani.opacity(1).step()
        t.setData({
          rainObserverAni: ani.export()
        })
      }
      if (res.boundingClientRect.top < 0) {
        log('[rainObserver] => end')
      }
    })
    wx.createIntersectionObserver().relativeToViewport().observe('#radarObserver', (res) => {
      if (res.boundingClientRect.top > 0) {
        log('[radarObserver] => start')
        ani.opacity(1).step()
        t.setData({
          radarObserverAni: ani.export()
        })
      }
      if (res.boundingClientRect.top < 0) {
        log('[radarObserver] => end')
      }
    })
    wx.createIntersectionObserver().relativeToViewport().observe('#fourthObserver', (res) => {
      if (res.boundingClientRect.top > 0) {
        // log('fourthObserver start')
        ani.opacity(1).step()
        t.setData({
          fourthObserverAni: ani.export()
        })
      }
      if (res.boundingClientRect.top < 0) {
        log('[fourthObserver] => end')
      }
    })
    wx.createIntersectionObserver().relativeToViewport().observe('#fifthObserver', (res) => {
      if (res.boundingClientRect.top > 0) {
        // log('fifthObserver start')
        ani.opacity(1).step()
        t.setData({
          fifthObserverAni: ani.export()
        })
      }
      if (res.boundingClientRect.top < 0) {
        log('[fifthObserver] => end')
      }
    })
    wx.createIntersectionObserver().relativeToViewport().observe('#sixthObserver', (res) => {
      if (res.boundingClientRect.top > 0) {
        // log('[sixthObserver] => start')
        ani.opacity(1).step()
        t.setData({
          sixthObserverAni: ani.export()
        })
      }
      if (res.boundingClientRect.top < 0) {
        log('[sixthObserver] => end')
      }
    })
  },
  onShareAppMessage(a) {
    const t = this
    return {
      title: '奇妙天气',
      path: "/pages/index/index"
    };
  },
  onGetWXACode() {
    const t = this
    const base64ImgStorage = wx.getStorageSync('qrCodeBase64')
    if (base64ImgStorage) {
      t.setData({
        qrImageURL: t.formatImg(base64ImgStorage)
      })
      console.log(`[get wxacode] from storage ID`)
    } else {
      wx.cloud.callFunction({
        name: 'openapi',
        data: {
          action: 'getWXACode',
        },
        success: res => {
          log(`[getWXACode] =>`, res)
          // let buffer = res.result.wxacodeResult.buffer
          // let base64Img = wx.arrayBufferToBase64(buffer).replace(/[\r\n]/g, "")
          let base64Img = res.result.wxacodebase64.replace(/[\r\n]/g, "")
          t.formatImg(base64Img)
          app.saveData('qrCodeBase64', base64Img)
        },
        fail: err => {
          log(`[getWXACode] => ${err}`)
        }
      })
    }
  },
  formatImg(base64Img) {
    const t = this
    let
      fsm = wx.getFileSystemManager(),
      FILE_BASE_NAME = 'weatherLogo',
      buffer = wx.base64ToArrayBuffer(base64Img);
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.jpg`;
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success: res => {
        log(`[writeFile] => qrImageURL =>`, filePath)
        t.setData({
          qrImageURL: filePath,
        })
      },
      fail: err => {
        log(`[writeFile] => fail => ${err}`)
        return (new Error('ERROR_BASE64SRC_WRITE'));
      },
    });
  },
  themeRadioChange(e) {
    log('[themeRadioChange]', e.detail.value)
    const t = this
    let themeValue = e.detail.value.toString(),
      theme = {
        themeChecked_auto: false,
        themeChecked_light: false,
        themeChecked_dark: false
      }
    if (themeValue == 'light') {
      theme['themeChecked_light'] = true
    } else {
      theme['themeChecked_dark'] = true
    }
    t.setData({
      themeValue: themeValue,
      theme: theme,
      modalName: null,
      isChangeSetting: true
    })
    t.store.data.theme = theme
    t.store.data.themeValue = themeValue
    app.changeStorage('themeValue', themeValue)
    app.changeStorage('theme', theme)
  },
  unitValueRadioChange(e) {
    const t = this
    let unit = {
      metric: false,
      SI: false,
      imperial: false
    }
    if (e.detail.value == 'metric') {
      unit['metric'] = true
    } else if (e.detail.value == 'imperial') {
      unit['imperial'] = true
    } else if (e.detail.value == 'SI') {
      unit['SI'] = true
    }
    t.store.data.unitValue = e.detail.value.toString()
    t.store.data.unit = unit
    t.setData({
      modalName: null,
      isChangeSetting: true
    })
    app.changeStorage('unitValue', e.detail.value.toString())
    app.changeStorage('unit', unit)
  },
  languageRadioChange: function (e) {
    const t = this
    let language = {
        languageChecked_zh_TW: false,
        languageChecked_zh_CN: false,
        languageChecked_en_US: false,
        languageChecked_en_GB: false
      },
      languageValue = e.detail.value.toString()
    log('[languageValue] =>', e.detail.value.toString())
    if (e.detail.value == 'zh_TW') {
      language['languageChecked_zh_TW'] = true
      log('[language] =>', 'languageChecked_zh_TW = true')
    } else if (e.detail.value == 'zh_CN') {
      language['languageChecked_zh_CN'] = true
      log('[language] =>', 'languageChecked_zh_CN = true')
    } else if (e.detail.value == 'en_US') {
      language['languageChecked_en_US'] = true
      log('[language] =>', 'languageChecked_en_US = true')
    } else if (e.detail.value == 'en_GB') {
      language['languageChecked_en_GB'] = true
      log('[language] =>', 'languageChecked_en_GB = true')
    }
    this.setData({
      language: language,
      languageValue: languageValue,
      modalName: null,
      isChangeSetting: true
    })
    t.store.data.languageValue = languageValue
    t.store.data.language = language
    app.changeStorage('language', language)
    app.changeStorage('languageValue', languageValue)
  },
  updateComponnet: function () {
    let src = this.data.src ? this.data.src : this.data.bingImage; //裁剪图片不存在时，使用default图片，注意加载时的相对路径
    this.setData({
      visible: true,
      src: src,
      borderColor: "#0BFF00",
      cropSizePercent: 0.7,
      size: {
        width: 300,
        height: 300
      }
    })
  },
  chooseCropImage(e) {
    let self = this;
    let type = e.currentTarget.dataset.type
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: [type],
      success(res) {
        console.log(res)
        const tempFilePaths = res.tempFiles[0].path
        self.setData({
          visible: true,
          src: tempFilePaths,
        })
      },
      fail(err) {
        console.log(err)
      }
    });
  },
  cropCallback(event) {
    const t = this
    log('[cropCallback]', event);
    const cloudUpload = (p, n) => {
      wx.cloud.uploadFile({
        cloudPath: 'cusImage/' + n,
        filePath: p,
      }).then(res => {
        log(res)
        return res.fileID
      }).catch(error => {
        log(error)
      })
    }
    async function asyncUpload (){
      return await cloudUpload(event.detail.resultSrc, app.globalData.openid)
    }
    asyncUpload().then( v =>{
      t.setData({
        visible: false,
        cusImage: event.detail.resultSrc,
        hasCusImage: true
      })
      wx.setStorageSync('hasCusImage', true)
      wx.setStorageSync('cusImageFileID', v)

      // app.saveData('hasCusImage', true)
      // app.saveData('cusImageFileID', v)
    })
  },
  uploadCallback(event) {
    log('[uploadCallback]', event);
  },
  closeCallback(event) {
    log('[closeCallback]', event);
    this.setData({
      visible: false,
    });
  },
  onDev() {
    wx.showModal({
      title: '没钱开发中',
      content: '不要期待',
      success(res) {}
    })
  },
  refreshLocation() { 
    const t = this 
    t.setData({
      refreshLocation: true 
    })
    setTimeout(() => {
      t.setData({
        refreshLocation:false
      })
      app.changeStorage('getLocationMethod', 'auto')
      t.store.data.getLocationMethod = 'auto'
    }, 2400);
    t.chooseGetLocationType() 
  }
  // async getBingImage() {
  //   log('[getBingImage]')
  //   let t = this,
  //     bingLists = wx.getStorageSync('bingLists') || [{datesign: '1998-03-13'}],
  //     canPrePull = wx.getStorageSync('canPrePull') || false,
  //     isToday = app.isToday(bingLists[0].datesign)

  //   const getStorageBing = () =>{
  //     t.setData({
  //       bingImage: bingLists[0]
  //     })
  //   }
  //   const prePullBing = () =>{
  //     let prePullData = wx.getStorageSync('prePullData')
  //     t.setData({
  //       bingImage: prePullData[0]
  //     })
  //   }
  //   const requestBing = () =>{
  //     wx.request({
  //       url: 'https://www.benweng.com/api/bing/lists',
  //       header: {
  //         "content-type": "application/json"
  //       },
  //       success: res => {
  //         log('[requestBing]',res)
  //         let bingImage = res.data.data[0]
  //         t.setData({
  //           bingImage: bingImage
  //         });
  //         t.saveData('bingLists', res.data.data)
  //       },
  //       fail: err =>{
  //         log('requestBing',err)
  //         t.setData({
  //           'bingImage': {
  //             img_url: '../../materialui/lib/scui/dist/assets/images/headbackground.jpg'
  //           }
  //         });
  //       }
  //     });
  //   }
  //   const event = (isToday,canPrePull) => {
  //     switch (true) {
  //       case (isToday == true):
  //         getStorageBing()
  //         log('[saveBingLists] => getStorageBing()')
  //         break
  //       case (isToday == false && canPrePull == true):
  //         prePullBing()
  //         log('[saveBingLists] => prePullBing()')
  //         break
  //       case (isToday == false && canPrePull == false):
  //         requestBing()
  //         log('[saveBingLists] => requestBing()')
  //         break
  //       default:
  //         log('[saveBingLists] => default-requestBing()')
  //         requestBing()
  //         break
  //     }
  //   }
  //   event(isToday,canPrePull)

  // },
});