const app = getApp()
// const AUTH_MODE = 'fingerPrint'
const log = console.log.bind(console)
const error = console.error.bind(console)
const warn = console.warn.bind(console)
const chooseLocation = requirePlugin('chooseLocation');
const scui = require('../../weatherui/sc-ui');
const util = require ('../../utils/util.js')
const sunCalc = require ('../../utils/sunCalc.js')
const poetry = require ('../../utils/poetry.js')


// import base64src from '../../utils/base64src.js'
// import vrequest from '../../utils/v-request.js'
// import calcSunUtil from '../../utils/calcnew.js'
import create from '../../utils/create'
import store from '../../store/index'
import style from '../../store/style'
import lazyFunction from "../../utils/lazyFunction"

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
    (require("../../libs/config.js")), {
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
    10: "冰雹",
    11: "霜冻",
    12: "⼤雾",
    13: "霾",
    14: "道路结冰",
    15: "森林火灾",
    16: "雷⾬大风"
  },
  i = new(require("../../libs/qqmap-wx-jssdk.js"))({
    key: "47ABZ-AJN3P-POPDO-VGI22-X5PBV-ZTFFP"
  }),
  r = null;
create(store, {
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    mobileWidth: wx.getSystemInfoSync().windowWidth,
    mobileHeight: wx.getSystemInfoSync().windowHeight,
    lastRefreshTime: '',
    isGettingLocation: false,
    isBackFromBing: false,
    hasCusImage:false,
    networkType: '4g',
    imageBase64: '',
    qrImageURL: '',
    painting: {},
    shareImage: '',
    touchS: [0, 0],
    touchE: [0, 0],
    headContentcurTime: '',
    // headContentSwitch: false,
    canDrawSunCalcAgain: false,
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
    borderColor: '#fff',
    result: '',

    forecastData: {
      nowTemp: "",
      nowWeather: "",
      hourlyKeypoint: "",
      minutelyKeypoint: "",
      // nowWeatherBackground: "",
      hourlyWeather: [],
      todayWeatherQuantity: [],
      city: "",
      address: "",
      cur_latitude: "",
      cur_longitude: "",
      dailyWeather: [],
      serviceData: [],
      bodyFeel: {},
      airQuality: {},
      alarmInfo: []
    },
    use: [
      'style',
      'themeValue',
      'startScreen',
      'indexHeadImageValue'
    ]
  },
  onLoad(a) {
    warn('[onLoad]')
    const t = this
    const handler = function (evt) {
      log('[' + evt + ']' + '=>', evt)
    }
    store.onChange(handler)
    wx.getNetworkType({
      success: res => {
        const networkType = res.networkType
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
        }else{
          log('[onLoad] => loadDataFromNet()')
          t.loadDataFromNet()
        }
        // if (networkType == 'wifi' || networkType == '4g' || networkType == '5g' || networkType == '3g') {

        // }
      }
    })
  },
  onShow() {
    warn('[onShow]')
    const t = this
    const location = chooseLocation.getLocation();
    let hasCusImage = wx.getStorageSync('hasCusImage') || false
    if(hasCusImage == true){
      let cusImageFileID = wx.getStorageSync('cusImageFileID')
      if(cusImageFileID){
        t.setData({
          cusImage:cusImageFileID,
          hasCusImage : true
        })
        log('hasCusImage,cusImage')
      }
    }
    log(`[chooseLocation.getLocation()] =>`, location)
    if (location !== null) {
      t.setData({
          'isGettingLocation': true,
          'forecastData.city': location.city,
          'forecastData.address': location.name,
          'forecastData.cur_longitude': location.longitude,
          'forecastData.cur_latitude': location.latitude
        }),
        t.getNowWeather(location, true, false)
      t.authScreenNext('canNavToFinalScreen')
      async function save() {
        log('[onShow] => save()')
        await app.saveData('citydata', location.name)
        await app.saveData('chooseLocation', location)
        await app.saveData('manualSetLocation', true)
      }
      save()
    }
    if (t.data.canDrawSunCalcAgain == true) {
      log('[canDrawSunCalcAgain] => true')
      t.drawSunCalc(t.data.forecastData.cur_latitude, t.data.forecastData.cur_longitude)
    }
    // if (t.data.isBackFromBing == true) {
    //   log('[isBackFromBing] => true')
    // }
    // if (t.data.isBackFromBing == false) {
    //   log('[isBackFromBing] => false')
    //   if (t.store.data.themeValue == '明亮') {
    //     log('[setBackgroundColor] => light')
    //     wx.setBackgroundColor({
    //       backgroundColor: '#F5F6F7',
    //       backgroundColorTop: '#F5F6F7',
    //       backgroundColorBottom: '#F5F6F7'
    //     })
    //     wx.setBackgroundTextStyle({
    //       textStyle: 'dark'
    //     })
    //   } else {
    //     log('[setBackgroundColor] => dark')
    //     wx.setBackgroundColor({
    //       backgroundColor: '#010101',
    //       backgroundColorTop: '#010101',
    //       backgroundColorBottom: '#010101'
    //     })
    //     wx.setBackgroundTextStyle({
    //       textStyle: 'light'
    //     })
    //   }
    // }
  },
  onReady() {
    warn('[onReady]')
    let t = this
    t.getMoonPhaseList()
    t.setBingImage()
    t.savePoetry()
    t.data.datePicker = scui.DatePicker("#datepicker");
    // t.onGetWXACode()
  },
  getNetworkType() {
    warn('[getNetworkType]')
    const t = this
    wx.getNetworkType({
      success: res => {
        const networkType = res.networkType
        log(`[networkType] => ${networkType}`)
        t.setData({
          networkType: networkType
        })
        return networkType
      }
    })
  },
  loadDataFromStorage() {
    warn('[loadDataFromStorage]')
    const t = this
    wx.getStorage({
        key: "nowdata",
        success: res => {
          t.setNowWeather(res.data);
        }
      }),
      wx.getStorage({
        key: "forecastData",
        success: res => {
          t.setTimelyWeather(res.data);
        }
      }),
      wx.getStorage({
        key: "citydata",
        success: res => {
          t.data.forecastData.city = res.data,
            t.setData({
              'forecastData.city': res.data,
            });
        }
      }),
      wx.getStorage({
        key: "bingImage",
        success: res => {
          t.setData({
            'bingImage': res.data
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
      t.screenFadeIn()
  },
  refresh() {
    warn('[refresh')
    this.loadDataFromNet('refresh')
  },
  loadDataFromNet(msg) {
    warn('[loadDataFromNet]')
    const t = this
    let hasUserLocation = wx.getStorageSync('hasUserLocation') || false
    if (hasUserLocation == true) {
      log('[loadDataFromNet] => t.setLocation()')
      t.screenFadeIn()
      t.setLocation()
    } else {
      t.authScreenFadeIn(false)
      t.setData({
        theme: {
          switch_themeChecked_light: true,
          switch_themeChecked_dark: false
        },
        temperatureUnit: {
          temperatureUnitValueF: false,
          temperatureUnitValueC: true
        },
        distanceUnit: {
          distanceUnitValueM: false,
          distanceUnitValueI: true
        }
      })
      log('[loadDataFromNet] => authScreenFadeIn()')
    }

    if (msg == 'refresh') {
      t.setData({
        refresh: true
      })
      setTimeout(() => {
        t.setData({
          refresh: false
        })
      }, 2500);
    }
  },
  setLocation() {
    warn('[setLocation]')
    const t = this
    let locationSelect = wx.getStorageSync('manualSetLocation')
    const setLocationFromManual = () => {
      let cityData = wx.getStorageSync('chooseLocation')
      log('[setLocation] => setLocationFromManual()', cityData)
      t.setData({
        'isGettingLocation': true,
        'forecastData.cur_latitude': cityData.latitude,
        'forecastData.cur_longitude': cityData.longitude,
        'forecastData.city': cityData.city,
        'forecastData.address': cityData.name
      })
      t.getNowWeather(null, false, true)
    }
    const setLocationFromAuto = () => {
      log('[setLocation] => setLocationFromAuto()')
      wx.getLocation({
        success: res => {
          log(`[getLocation] => success => `, res)
          t.setData({
            'isGettingLocation': true,
            'forecastData.cur_latitude': res.latitude,
            'forecastData.cur_longitude': res.longitude
          })
          i.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: res => {
              log(`[reverseGeocoder] => getNowWeather() => `, res)
              let e = res.result.address_component;
              t.setData({
                'forecastData.city': e.district,
                'forecastData.address': e.street
              })
              app.saveData('citydata', e)
              t.getNowWeather(null, false, true)
            },
            fail: err => {
              warn(`[reverseGeocoder] = > ${err}`)
            }
          });
        },
        fail: err => {
          warn(`[getLocation] => fail => ${err}`)
        }
      });
    }
    const event = (result) => {
      switch (true) {
        case (result == true):
          setLocationFromManual()
          break
        case (result == false):
          setLocationFromAuto()
          break
        default:
          // setLocationFromAuto()
          break
      }
    }
    event(locationSelect)
  },
  autoSetLocation() {
    warn('[autoSetLocation]')
    const t = this
    t.authScreenNext('canNavToFinalScreen')
    wx.getLocation({
      success: res => {
        log(`[getLocation] => success => `, res)
        t.setData({
          'isGettingLocation': true,
          'forecastData.cur_latitude': res.latitude,
          'forecastData.cur_longitude': res.longitude
        })
        i.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            log(`[autoSetLocation] => reverseGeocoder`, res)
            let e = res.result.address_component;
            t.setData({
              'forecastData.city': e.district,
              'forecastData.address': e.street,
              'authLocationMethod': 'autoSetLocation'
            })
            app.saveData('citydata', e)
            log('[autoSetLocation] => getNowWeather(null, false, false)')
            t.getNowWeather(null, false, false)
          },
          fail: err => {
            warn(`[reverseGeocoder] = > ${err}`)
          }
        });
      },
      fail: err => {
        warn(`[getLocation] => fail => ${err}`)
      }
    });
    app.saveData('manualSetLocation', false)
  },
  manualSetLocation() {
    warn('[manualSetLocation]')
    const t = this
    var locationKey = 'V6KBZ-WDCED-HTR44-PHG7F-V2AME-B3FFO'
    const appReferer = '奇妙天气-小程序';
    const locationCategory = '奇妙天气,XHY';
    t.setData({
      'authLocationMethod': 'manualSetLocation'
    })
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + locationKey + '&referer=' + appReferer + '&category=' + locationCategory
    });
  },
  getNowWeather(choseLocationData, isChoseLocation, fadeout) {
    warn('[getNowWeather]')
    const t = this
    let e = ''
    // p = ''
    if (isChoseLocation == true) {
      e = "https://api.caiyunapp.com/v2.5/F4i9DpgD0R1DIcPP/" + choseLocationData.longitude + "," + choseLocationData.latitude
    }
    if (isChoseLocation == false) {
      e = "https://api.caiyunapp.com/v2.5/F4i9DpgD0R1DIcPP/" + t.data.forecastData.cur_longitude + "," + t.data.forecastData.cur_latitude
    }
    const
      o = e + "/realtime.json",
      s = e + "/forecast.json?lang=zh_CN&dailysteps=30&alert=true&unit=metric"
    const requestWeatherData = () => {
      wx.request({
        url: o,
        success: a => {
          let e = a.data.result.realtime;
          log('[getNowWeather] => [setNowWeather]', e)
          t.setNowWeather(e)
          app.saveData("nowdata", e);
        }
      })
      wx.request({
        url: s,
        success: a => {
          let e = a.data.result;
          warn('[getNowWeather] => [setTimelyWeather]', e)
          t.setTimelyWeather(e)
          app.saveData("forecastData", e);
        },
        complete: () => {
          a && a();
        }
      })
    }
    async function fade() {
      await requestWeatherData()
      log(`[getNowWeather] => [screenFadeOut] => ${fadeout}`)
      if (fadeout == true) {
        await t.screenFadeOut()
      } else {}
    }
    fade()
    t.setData({
      'isGettingLocation': false
    })
  },
  setNowWeather(t) {
    warn('[setNowWeather]')
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
      }
    }
    let
      s = t.temperature,
      i = t.skycon,
      r = {
        wind: this.getWindDirect(t.wind.direction) + " " + this.getWindLevel(t.wind.speed) + "级",
        humidity: parseInt(100 * t.humidity) + "%",
        windSpeed: t.wind.speed,
        getWindLevel: this.getWindLevel(t.wind.speed),
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
      aqiColor = setAqiColor(t.aqi)

      app.saveData("lastRefreshTime", date[0].time)

    let nowTemp = Math.round(s)
    if (o.store.data.temperatureUnit.temperatureUnitValueC == true) {
      nowTemp = nowTemp + '°C'
    } else {
      nowTemp = nowTemp * 1.8 + 32 + '°F'
    }

    o.setData({
      'forecastData.nowTemp': nowTemp,
      'forecastData.nowWeather': e[i],
      // 'forecastData.nowWeatherBackground': "https://source.unsplash.com/450x450/?" + e[i] + "," + "nature" + "," + o.data.forecastData.city,
      'forecastData.bodyFeel': r,
      'forecastData.airQuality': n,
      'forecastData.skycon': t.skycon,
      'aqiColor': aqiColor,
      'curDetailTime': curDetailTime
    });

    log(`[setNowWeather] = >`, t)

    const getNowCityData = () => {
      let data = {
        address: o.data.forecastData.address,
        city: o.data.forecastData.city,
        aniIconPath: "https://weather.ioslide.com/weather/icon/0/" + t.skycon + "-icon-ani.svg",
        iconPath: "https://weather.ioslide.com/weather/icon/0/" + t.skycon + "-icon.svg",
        whitePath: "https://weather.ioslide.com/weather/icon/0/" + t.skycon + "-icon-white.svg",
        backgroundBg: "https://source.unsplash.com/450x450/?" + e[i] + "," + "nature" + "," + o.data.forecastData.city,
        // backgroundBg: o.data.bingImagebingImage.img_url,
        nowTemp: nowTemp,
        skycon: t.skycon,
        nowWeather: e[i],
        cur_latitude: o.data.forecastData.cur_latitude,
        cur_longitude: o.data.forecastData.cur_longitude,
        time: curDetailTime
      }
      log(`[setNowWeather] => [getNowCityData] =>`, data)
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
      let cityData = await getNowCityData()
      let historyCityList = await reduceHistoryCityData(cityData)
      app.saveData("historyCityList", historyCityList)
      return historyCityList
    }
    saveHistoryCityData().then(val => {
      o.setData({
        'historyCityList': val
      })
      log(`[setNowWeather] => [saveHistoryCityData] =>`, val)
      o.drawSunCalc(o.data.forecastData.cur_latitude, o.data.forecastData.cur_longitude)
    });

    //刷新天气频率
    // clearInterval(a)
    // a = setInterval(
    // function () {

    // },o.store.data.refreshfrequencyValue.replace('小时', '') * 100000000000000060 * 60);
    // },99999999999999999999999999999)
  },
  getTemperatureChartsData(a) {
    let
      e = 1
    return a <= 5 ? (e = a * 23) : 5 < a && a <= 10 ? (
      e = a * 14) : 10 < a && a <= 15 ? (e = a * 9) : 15 < a && a <= 20 ? (
      e = a * 7) : 20 < a && a <= 30 ? (e = a * 5) : 20 < a && a <= 30 ? (
      e = a * 3) : a > 30 && (
      e = a * 1), {
      chartsHeight: e
    }
  },
  setTimelyWeather(a) {
    const that = this;
    warn('[setTimelyWeather]')

    warn('[setTimelyWeather] => [hourlyWeather]', a.hourly)
    for (var t = a.hourly, i = [], r = new Date().getHours(), n = 0; n < 48; n++) {
      let c = n + r;
      let hourlyTemp = t.temperature[n].value
      // let hourlyTemp =  t.temperature[n].value
      if (that.store.data.temperatureUnit.temperatureUnitValueC == true) {
        hourlyTemp = hourlyTemp
      } else {
        hourlyTemp = (hourlyTemp * 1.8) + 32
      }
      i.push({
        time: c % 24 + ".00",
        weather: e[t.skycon[n].value],
        iconPath: "https://weather.ioslide.com/weather/icon/0/" + t.skycon[n].value + "-icon",
        aniIconPath: "https://weather.ioslide.com/weather/icon/0/" + t.skycon[n].value + "-icon-ani.svg",
        temp: Math.round(hourlyTemp) + '°',
        wind: that.getWindDirect(t.wind[n].direction) + " " + that.getWindLevel(t.wind[n].speed) + "级",
        value: t.skycon[n].value
      });
    }

    warn('[setTimelyWeather] => [dailyWeather]', a.daily)
    for (var d = a.daily, u = [], f = 0; f < 16; f++) {
      let l = new Date().getDay() + f;
      l %= 7;
      let D = new Date();
      D.setDate(D.getDate() + f);
      let
        g = D.getMonth() + 1,
        h = D.getDate();
      g < 10 && (g = "0" + g), h < 10 && (h = "0" + h);
      let p = g + "月" + h + '日'

      let chartsMargin = Math.round(d.temperature[f].min)
      //Set a horizontal line
      if (chartsMargin < 0) {
        chartsMargin = Math.round(d.temperature[f].min) + 20
      }
      let chartsHeight = Math.abs(Math.round(d.temperature[f].max) - Math.round(d.temperature[f].min))
      let getTemperatureChartsData = that.getTemperatureChartsData(chartsHeight)

      let dailyTempMin = Math.round(d.temperature[f].min)
      let dailyTempMax = Math.round(d.temperature[f].max)

      if (that.store.data.temperatureUnit.temperatureUnitValueC == true) {
        dailyTempMin = dailyTempMin + '°'
        dailyTempMax = dailyTempMax + '°'
      } else {
        dailyTempMin = dailyTempMin * 1.8 + 32 + '°'
        dailyTempMax = dailyTempMax * 1.8 + 32 + '°'
      }

      u.push({
        date: "星期" + "天一二三四五六".charAt(l),
        weather: e[d.skycon[f].value],
        iconPath: "https://weather.ioslide.com/weather/icon/0/" + d.skycon[f].value + "-icon",
        aniIconPath: "https://weather.ioslide.com/weather/icon/0/" + d.skycon[f].value + "-icon-ani.svg",
        tempMin: dailyTempMin,
        tempMax: dailyTempMax,
        temperatureChartsHeight: getTemperatureChartsData.chartsHeight,
        temperatureChartsMargin: chartsMargin,
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
    let swtemperature = d.temperature[0].avg
    if (that.store.data.temperatureUnit.temperatureUnitValueC == true) {
      swtemperature = swtemperature
    } else {
      swtemperature = (swtemperature * 1.8) + 32
    }
    var m = [{
      desc: Math.round(swtemperature) + '°',
      name: "体感温度",
      type: "sw-temperature"
    }, {
      desc: Math.floor(d.humidity[0].avg * 100) + "%",
      name: "湿度",
      type: "sw-humidity"
    }, {
      desc: Math.round(d.life_index.ultraviolet[0].index),
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
      desc: Math.round(d.pressure[0].avg) + "mb",
      name: "气压",
      type: "sw-pressure"
    }]

    // let todayWeatherQuantity = JSON.parse(JSON.stringify(i));
    that.setData({
      'forecastData.todayWeatherQuantity': JSON.parse(JSON.stringify(i)),
      'forecastData.dailyWeather': u,
      'forecastData.hourlyWeather': i,
      'forecastData.minutelyKeypoint': a.minutely.description,
      'forecastData.hourlyKeypoint': a.hourly.description,
      'forecastData.serviceData': m,
    });

    async function alertContent() {
      if (a.alert.content == []) {
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
      } else {
        return 0
      }
    }
    alertContent().then(val => {
      that.setData({
        'forecastData.alarmInfo': val
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
    let d = '令人满意的空气质量'
    return a=0 ? (d = "暂无描述"): a <= 50 ? (d = "令人满意的空气质量") : 51 <= a && a <= 100 ? (d = "可以接受的空气质量") : 101 <= a && a <= 150 ? (d = "敏感人群可能会感到不适") : 151 <= a && a <= 200 ? (d = "一般人群应避免户外活动") : 201 <= a && a <= 300 ? (d = "健康预警：一般人群可能会出现不适应症状") : a > 300 && (d = "紧急情况下的健康预警"), d;
  },
  getWindLevel(a) {
    let t = 0;
    return 1 <= a && a <= 5 ? t = 1 : 6 <= a && a <= 11 ? t = 2 : 12 <= a && a <= 19 ? t = 3 : 20 <= a && a <= 28 ? t = 4 : 29 <= a && a <= 38 ? t = 5 : 39 <= a && a <= 49 ? t = 6 : 50 <= a && a <= 61 ? t = 7 : 62 <= a && a <= 74 ? t = 8 : 75 <= a && a <= 88 ? t = 9 : 89 <= a && a <= 102 ? t = 10 : 103 <= a && a <= 117 ? t = 11 : 118 <= a && a <= 133 ? t = 12 : 134 <= a && a <= 149 ? t = 13 : 150 <= a && a <= 166 ? t = 14 : 167 <= a && a <= 183 ? t = 15 : 184 <= a && a <= 201 ? t = 16 : 202 <= a && a <= 220 && (t = 17),
      t;
  },
  getWindSpeed(a) {
    let t = "微风";
    return a < 1 ? t = "无风" : 1 <= a <= 5 ? t = "微风" : 6 <= a <= 28 ? t = "清⻛" : 29 <= a <= 49 ? t = "强⻛" : 50 <= a <= 88 ? t = "狂⻛" : 88 <= a <= 149 ? t = "台风" : 88 <= a <= 149 ? t = "台风" : a >= 150 && (t = "超强台⻛"),
      t;
  },
  getWindDirect(a) {
    let t = "北";
    return 11.26 <= a && a <= 78.75 ? t = "东北" : 78.76 <= a && a <= 101.25 ? t = "东" : 101.26 <= a && a <= 168.75 ? t = "东南" : 168.76 <= a && a <= 191.25 ? t = "南" : 191.26 <= a && a <= 258.75 ? t = "西南" : 258.76 <= a && a <= 281.25 ? t = "西" : 281.26 <= a && a <= 348.75 && (t = "西北"),
      t + "风";
  },
  // onPageScroll: lazyFunction.throttle(function (e) {
  //   const t = this
  //   var scrollTop = wx.getStorageSync('scrollTop')
  //   if (e[0].scrollTop > scrollTop) {
  //     var tx = wx.createAnimation({
  //       duration: 700,
  //       timingFunction: 'ease-in-out',
  //       delay: 0,
  //     });
  //     tx.opacity(0).step()
  //     t.setData({
  //       toXHYIManima: tx.export(),
  //       headContentSwitch: false
  //     })
  //   } else {
  //     var tx = wx.createAnimation({
  //       duration: 700,
  //       timingFunction: 'ease-in-out',
  //       delay: 0,
  //     });
  //     tx.opacity(1).step()
  //     t.setData({
  //       toXHYIManima: tx.export(),
  //       headContentSwitch: false
  //     })
  //     if (new Date().getHours() < 10) {
  //       var hour = "0" + new Date().getHours()
  //     } else {
  //       var hour = new Date().getHours()
  //     }
  //     if (new Date().getMinutes() < 10) {
  //       var minut = "0" + new Date().getMinutes()
  //     } else {
  //       var minut = new Date().getMinutes()
  //     }
  //     var headContentcurTime = hour + ":" + minut
  //     t.setData({
  //       headContentSwitch: true,
  //       headContentcurTime: headContentcurTime
  //     })
  //   }
  //   t.saveData('scrollTop', e[0].scrollTop)
  //   // this.setData({
  //   //   scrollTop: e[0].scrollTop
  //   // })
  // }),
  getMoonPhaseList: lazyFunction.throttle(function (e) {
    // getMoonPhaseList:lazyFunction.throttle( () => {
    // async getMoonPhaseList() {
    log('[getMoonPhaseList]')
    const t = this
    let obj = Array.from(Array(30), (v, k) => k)
    obj.map(function (value, index, arr) {
      const getMoonName = (r) => {
        let
          e = '新月',
          h = 'NewMoon';
        return r <= 0.055 ? (e = '新月', h = 'NewMoon') : 0.055 < r && r <= 0.245 ? (e = '峨眉月', h = 'WaxingCrescent') : 0.245 < r && r <= 0.255 ? (e = '上弦月', h = 'FirstQuarter') : 0.255 < r && r <= 0.495 ? (e = '盈凸月', h = 'WaxingGibbous') : 0.495 < r && r <= 0.51 ? (e = '满月', h = 'FullMoon') : 0.51 < r && r <= 0.745 ? (e = '亏凸月', h = 'WaningGibbous') : 0.745 < r && r <= 0.755 ? (e = '下弦月', h = 'LastQuarter') : 0.755 < r && r <= 1 ? (e = '残月', h = 'WaningCrescent') : r > 1 && (e = '丽月', h = 'WaningCrescent'), {
          a: e,
          b: h
        }
      }
      let moonListsTime = []
      moonListsTime[index] = new Date()
      moonListsTime[index].setDate(moonListsTime[index].getDate() + index)
      let objDetail = {
        moonTimePhase: sunCalc.getMoonIllumination(moonListsTime[index]).phase,
        moonTimeDate: moonListsTime[index].getMonth() + 1 + "月" + moonListsTime[index].getDate() + "日",
        moonTimePhaseCN: '',
        moonTimePhaseEN: ''
      }
      obj.fill(objDetail, index, index + 1)
      let moonName = getMoonName(obj[index].moonTimePhase)
      obj[index].moonTimePhaseCN = moonName.a
      obj[index].moonTimePhaseEN = moonName.b
    })

    let reduceObj = {},
      moonPhaseLists = obj.reduce((item, next) => {
        if (!reduceObj[next.moonTimePhaseCN]) {
          item.push(next);
          reduceObj[next.moonTimePhaseCN] = true;
        }
        return item;
      }, []) || []

    t.setData({
      moonPhaseLists: moonPhaseLists
    })
    log(`[moonPhaseLists] =>`, moonPhaseLists)
  }),
  drawSunCalc(a, b) {
    var
      t = this,
      sunriseTime = '',
      sunsetTime = ''

    let sun = sunCalc.getTimes(new Date(), a, b)
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
    if (t.store.data.themeValue == '黑夜') {
      setStrokeStyleColorSunRise = '#ffc954'
      setStrokeStyleColorFullDay = '#5c5c5c'
      drawSun(setStrokeStyleColorSunRise, setStrokeStyleColorFullDay)
    }
    if (t.store.data.themeValue == '明亮') {
      // setStrokeStyleColorSunRise = '#bcc8d4'
      // setStrokeStyleColorFullDay = '#d5effc'
      setStrokeStyleColorSunRise = 'rgb(193, 198, 204)'
      setStrokeStyleColorFullDay = 'rgb(224, 229, 233)'
      drawSun(setStrokeStyleColorSunRise, setStrokeStyleColorFullDay)
    }

    t.setData({
      strSunSet: sunsetTime,
      strSunRise: sunriseTime
    })
  },
  setHistoryCityLocation(e) {
    log('[setHistoryCityLocation]')
    let
      n = e.currentTarget.dataset,
      t = this
    log(n)
    t.setData({
        'isGettingLocation': true,
        'forecastData.cur_latitude': n.bean.cur_latitude,
        'forecastData.cur_longitude': n.bean.cur_longitude,
        'forecastData.city': n.bean.city,
        'forecastData.address': n.bean.address,
        'modalName': null
      }),
      t.getNowWeather(null, false, false);
      app.saveData('manualSetLocation', false)
  },
  // async setBingImage() {
  //   log('[setBingImage]')
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
  //         warn('requestBing',err)
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
  setBingImage() {
    log('[setBingImage]')
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
        });
        t.saveData('bingImage', res.data.img)
      },
      fail: err => {
        warn('requestBing', err)
        t.setData({
          'bingImage': {
            img_url: '../../materialui/lib/scui/dist/assets/images/headbackground.jpg'
          }
        });
      }
    });
  },
  screenFadeIn() {
    log('[screenFadeIn]')
    const t = this
    const event = (result) => {
      switch (true) {
        case (result == '诗词'):
          t.poetryScreenFadeIn()
          break
        case (result == '授权'):
          t.authScreenFadeIn()
          break
        case (result == '默认'):
          t.defaultScreenFadeIn()
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
    log('[screenFadeOut] =>', t.store.data.startScreen)
    const event = (result) => {
      switch (true) {
        case (result == '诗词'):
          t.poetryScreenFadeOut()
          break
        case (result == '默认'):
          t.defaultScreenFadeOut()
          break
        default:
          break
      }
    }
    event(t.store.data.startScreen)
    t.intersectionObserver()
  },
  poetryScreenFadeOut() {
    log('[poetryScreenFadeOut]')
    const t = this
    //poetry screen fade out
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
  },
  loadFont() {
    wx.loadFontFace({
      family: 'wencangshufang',
      source: 'url("https://weather.ioslide.com/weather/font/wencangshufang/WenCangShuFang-2.ttf")',
      success: res => {
        log('[loadFontFace]', res)
      },
      complete: res => {

      }
    })
  },
  poetryScreenFadeIn() {
    log('[poetryScreenFadeIn]')
    const t = this
    let poetry_storage = wx.getStorageSync('poetry_storage') || [{
      content: '春眠不觉晓'
    }]
    t.setData({
      poetry: poetry_storage[0].content
    })
    //poetry fade in
    let poetryTextAction = wx.createAnimation({
      duration: 1300,
      timingFunction: 'ease-in-out',
      delay: 0,
    });
    poetryTextAction.opacity(1).step()
    t.setData({
      guideScreenTextAni: poetryTextAction.export()
    })
  },
  authScreenFadeIn(hasUserLocation) {
    const t = this
    log('[authScreenFadeIn]')
    warn(`[hasUserLocation] ${hasUserLocation}`)
    let defaultScreenAction = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease-in-out',
      delay: 0,
    });
    defaultScreenAction.opacity(1).translate3d(0,'10px',0).step()
    t.setData({
      logoScreenAni: defaultScreenAction.export(),
    })
  },
  defaultScreenFadeOut() {
    log('[defaultScreenFadeOut]')
    const t = this
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
  },
  authFinalScreenFadeOut() {
    log('[authFinalScreenFadeOut]')
    const t = this,
      mobileWidth = t.data.mobileWidth
    if (t.data.hasChangeSetting == true) {
      t.getNowWeather(null, false, false)
    }
    t.intersectionObserver()
    let authScreenAction = wx.createAnimation({
      duration: 1400,
      timingFunction: 'ease-in-out',
      delay: 0,
    });
    authScreenAction.translate3d(-mobileWidth * 3,0,0).opacity(0).step()
    t.setData({
        defaultScreenAni: authScreenAction.export(),
      }),
      setTimeout(() => {
        t.setData({
          headBackgroundAni: true,
          authScreen: true
        })
      }, 1600)
  },
  authScreenNext(e) {
    log('[authScreenNext]')
    const t = this
    var mobileWidth = t.data.mobileWidth
    const checkLocationAuth = () => {
      log('[authScreenNext] => checkLocationAuth')
      wx.getSetting({
        success: res => {
          log(`[authSetting] =>`, res)
          if (res.authSetting['scope.userLocation']) {
            transX(mobileWidth * 2)
            app.saveData('hasUserLocation', true)
            app.changeStorage('startScreen', '诗词')
            log('[hasUserLocation] => setLocation()')
          }
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success: res => {
                log('check => [wx.authorize] =>', res)
                transX(mobileWidth * 2)
                app.saveData('hasUserLocation', true)
                app.changeStorage('startScreen', '诗词')
              },
              fail: err => {
                //req location auth again
                warn(`check = > [wx.authorize] =>`, err)
                wx.showModal({
                  title: '是否授权以下应用权限',
                  content: '地理位置',
                  confirmText: "确认",
                  cancelText: "取消",
                  success: res => {
                    if (res.confirm) {
                      wx.openSetting({
                        success: res => {
                          log(`[wx.openSetting] =>`, res, res.authSetting['scope.userLocation'])
                          if (res.authSetting['scope.userLocation'] == true) {
                            transX(mobileWidth * 2)
                            app.saveData('hasUserLocation', true)
                            app.changeStorage('startScreen', '诗词')
                            log('[scope.userLocation] success')
                          }
                        }
                      });
                    } else {
                      warn('[scope.userLocation] fail')
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
      stepAction.translate3d(-steps,0,0).step()
      t.setData({
        defaultScreenAni: stepAction.export(),
      })
    }
    if (e == 'canNavToFinalScreen') {
      transX(mobileWidth * 3)
    } else {
      const event = (result) => {
        switch (true) {
          case (result == 'authFirstStep'):
            log('[authFirstStep]')
            transX(mobileWidth)
            break
          case (result == 'authSecondStep'):
            // transX(mobileWidth*2)
            log('[authSecondStep]')
            checkLocationAuth()
            break
          case (result == 'authThirdStep'):
            log('[authThirdStep]')
            transX(mobileWidth * 3)
            break
          case (result == 'authFourthStep'):
            log('[authFourthStep]')
            transX(mobileWidth * 3)
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
      mobileWidth = t.data.mobileWidth
    const transX = (steps) => {
      const t = this
      let authFirstStep = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease-in-out',
        delay: 0
      });
      authFirstStep.translate3d(-steps,0,0).step()
      t.setData({
        defaultScreenAni: authFirstStep.export(),
      })
    }
    const event = (result) => {
      switch (true) {
        case (result == 'authFirstStep'):
          transX(mobileWidth)
          break
        case (result == 'authSecondStep'):
          transX(mobileWidth)
          break
        case (result == 'authThirdStep'):
          transX(mobileWidth * 2)
          break
        case (result == 'authFourthStep'):
          transX(mobileWidth * 2)
          break
        default:
          break
      }
    }
    event(e.currentTarget.dataset.target)
  },
  saveData(a, t) {
    a && t && wx.setStorage({
      key: a,
      data: t
    });
  },
  savePoetry: lazyFunction.throttle(function () {
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
  }),
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
  switchChange(e) {
    log('[switchChange]')
    const t = this
    const changeStoreage = (result) => {
      t.store.data.style[result] = !t.store.data.style[result]
      log(result,t.store.data.style[result])
      // t.changeStyleStorage('style')
      app.changeStorage('style', t.store.data.style)
    }
    const event = (result) => {
      switch (true) {
        case (result == 'sunlightSwitchChange'):
          log('[sunlightSwitchChange]')
          t.drawSunCalc(t.data.forecastData.cur_latitude, t.data.forecastData.cur_longitude)
          changeStoreage(result)
          break
        default:
          changeStoreage(result)
      }
    }
    event(e.currentTarget.dataset.cur)
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
      }
    }
    // event(e.currentTarget.dataset.target)
    event(e.detail)
  },
  hideModal(e) {
    log('[hideModal]')
    const t = this
    const setData = (modalName) => {
      log('[hidemodal] =>', modalName)
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
      }
    }
    event(e.currentTarget.dataset.target)
    wx.hideLoading()
    // const t = this
    // t.setData({
    //   modalName: null
    // })
  },
  hideModalR() {
    const t = this
    t.setData({
      modalName: null
    })
    t.intersectionObserver()
  },
  navChange(e) {
    warn(`[navChange] => ${e.currentTarget.dataset.cur}`)
    const t = this,
      target = e.currentTarget.dataset.cur
    wx.navigateTo({
      url: '../' + target + '/' + target
    });
  },
  navSetting() {
    wx.navigateTo({
      url: '../setting/setting'
    });
  },
  onPullDownRefresh() {
    log(`[onPullDownRefresh]`)
    const t = this
    t.setData({
      'isGettingLocation': true
    })
    let
      time = util.formatDate(new Date()),
      date = util.getDates(7, time)
    app.saveData("lastRefreshTime", date[0].time)
    app.saveData('manualSetLocation', false)
    t.getNowWeather(function () {
      wx.stopPullDownRefresh();
    });

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
            left: 140,
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
    log(`[eventGetImage] => `, event)
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
        latitude: t.data.forecastData.cur_latitude,
        city: t.data.forecastData.city,
        startTime: startTime,
        longitude: t.data.forecastData.cur_longitude,
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
          warn(`[subDailyWeatherCloudFn] => Fail => ${err}`)
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
          warn(`[unSubDailyWeatherCloudFn] => Fail => ${err}`)
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
  intersectionObserver() {
    log('[intersectionObserver]')
    const t = this
    var ani = wx.createAnimation({
      duration: 700,
      timingFunction: 'ease-in-out',
      delay: 500,
    });
    // ani.opacity(1).step()
    wx.createIntersectionObserver().relativeToViewport().observe('#firstObserver', (res) => {
      if (res.boundingClientRect.top > 0) {
        // log('firstObserver start')
        ani.opacity(1).step()
        this.setData({
          firstObserverAni: ani.export()
        })
      }
      if (res.boundingClientRect.top < 0) {
        log('[firstObserver] => end')
      }
    })
    wx.createIntersectionObserver().relativeToViewport().observe('#secondObserver', (res) => {
      if (res.boundingClientRect.top > 0) {
        // log('secondObserver start')
        ani.opacity(1).step()
        this.setData({
          secondObserverAni: ani.export()
        })
      }
      if (res.boundingClientRect.top < 0) {
        log('[secondObserver] => end')
      }
    })
    wx.createIntersectionObserver().relativeToViewport().observe('#thirdObserver', (res) => {
      if (res.boundingClientRect.top > 0) {
        // log('thirdObserver start')
        ani.opacity(1).step()
        this.setData({
          thirdObserverAni: ani.export()
        })
      }
      if (res.boundingClientRect.top < 0) {
        log('[thirdObserver] => end')
      }
    })
    wx.createIntersectionObserver().relativeToViewport().observe('#fourthObserver', (res) => {
      if (res.boundingClientRect.top > 0) {
        // log('fourthObserver start')
        ani.opacity(1).step()
        this.setData({
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
        this.setData({
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
        this.setData({
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
          t.saveData('qrCodeBase64',base64Img)
        },
        fail: err => {
          warn(`[getWXACode] => ${err}`)
        }
      })
    }
  },
  formatImg(base64Img) {
    let t = this
    let fsm = wx.getFileSystemManager();
    let FILE_BASE_NAME = 'weatherLogo';
    let buffer = wx.base64ToArrayBuffer(base64Img);
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
        warn(`[writeFile] => fail => ${err}`)
        return (new Error('ERROR_BASE64SRC_WRITE'));
      },
    });
  },
  themeRadioChange(e) {
    const t = this
    t.setData({
      modalName: null,
      hasChangeSetting: true
    })
    t.store.data.themeValue = e.detail.value.toString()
    app.changeStorage('themeValue', e.detail.value.toString())
  },
  distanceUnitValueRadioChange(e) {
    const t = this

    let distanceUnit = {
      distanceUnitValueM: false,
      distanceUnitValueI: false
    }
    if (e.detail.value == 'metric') {
      distanceUnit['distanceUnitValueM'] = true
    } else if (e.detail.value == 'imperial') {
      distanceUnit['distanceUnitValueI'] = true
    }
    // t.store.data.distanceUnitValue = e.detail.value.toString()
    // t.store.data.distanceUnit = distanceUnit
    t.setData({
      modalName: null,
      hasChangeSetting: true,
      distanceUnit: distanceUnit
    })
    app.changeStorage('distanceUnitValue', e.detail.value.toString())
    app.changeStorage('distanceUnit', distanceUnit)
  },
  temperatureUnitValueRadioChange(e) {
    const t = this

    let temperatureUnit = {
      temperatureUnitValueF: false,
      temperatureUnitValueC: false
    }
    if (e.detail.value == '华氏度') {
      temperatureUnit['temperatureUnitValueF'] = true
    } else if (e.detail.value == '摄氏度') {
      temperatureUnit['temperatureUnitValueC'] = true
    }
    t.setData({
      modalName: null,
      hasChangeSetting: true,
      temperatureUnit: temperatureUnit
    })
    // t.store.data.temperatureUnitValue = e.detail.value.toString()
    // t.store.data.temperatureUnit = temperatureUnit
    app.changeStorage('temperatureUnitValue', e.detail.value.toString())
    app.changeStorage('temperatureUnit', temperatureUnit)
  },
  cloudUpload (p,n){
    wx.cloud.uploadFile({
      cloudPath:  'cusImage/' + n,
      filePath: p, 
    }).then(res => {
      log(res)
      wx.setStorage({
        data: res.fileID,
        key: 'cusImageFileID',
      })
    }).catch(error => {
      log(error)
    })
  },
  // chooseCropImage(e){
  //   let type = e.currentTarget.dataset.type
  //   log('[chooseCropImage]',type)
  //   const t = this
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['compressed'],
  //     sourceType: [type],
  //     success (res) {
  //       log(res)
  //       const 
  //         tempFilePaths = res.tempFilePaths[0]
  //       log('[chooseImage]',tempFilePaths)
  //       t.setData({
  //         cusImage:tempFilePaths,
  //         hasCusImage:true,
  //         modalName:null,
  //         visible: true
  //       })
  //       t.saveData('hasCusImage',true)
  //     },
  //     fail(err){
  //       log(err)
  //     }
  //   })
  // },
  //选取裁剪图片
  chooseCropImage: function () {
    let self = this;
    wx.chooseImage({
      count:1,
      sizeType: ["original","compressed"],// ios 选择原图容易 crash
      sourceType	:['album'],
      success(res) {
        console.log(res)
        const tempFilePaths = res.tempFiles[0].path
        self.setData({
          visible: true,
          src: tempFilePaths,
        })
      },
      fail(err){
        console.log(err)
      }
    });
  },
  //裁剪图片回调
  cropCallback: function (event) {
    log('[cropCallback]',event);
    this.setData({
      visible: false,
    });
    let name = app.globalData.openid,
    tempFilePaths = this.data.cusImage
    t.cloudUpload(tempFilePaths,name)
  },
  
  //选取裁剪图片成功回调
  uploadCallback: function (event) {
    log('[uploadCallback]',event);
  },

  //关闭回调
  closeCallback: function (event) {
    log('[closeCallback]',event);
    this.setData({
      visible: false,
    });
  }
});