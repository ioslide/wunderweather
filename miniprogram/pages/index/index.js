
let temperatureChart = null
let rainChart = null
let radarChart = null
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
const config = require('../../weatherui/config/config.js').default
const transWeatherName = require('../../weatherui/assets/lib/transWeatherName/transWeatherName.js').default
const qqMapWX = new(require("../../weatherui/assets/lib/qqMapWX/qqMapWX.js"))({
  key: config.locationKey
})

// import base64src from '../../utils/base64src.js'
// import vrequest from '../../utils/v-request.js'
// import calcSunUtil from '../../utils/calcnew.js'
// import lazyFunction from "../../utils/lazyFunction"
import create from '../../utils/create'
import store from '../../store/index'
import _ from '../../utils/lodash.min.js';

create(store, {
  data: {
    opts:{
      lazyLoad: true
    },
    temperatureChartConfig : {
      appendPadding:0,
      padding:[30,0,30,0],
      pixelRatio : app.globalData.pixelRatio,
      width: app.globalData.windowWidth,
      height: 210
    },
    rainChartConfig : {
      appendPadding:0,
      padding:[30,0,0,0],
      pixelRatio : app.globalData.pixelRatio,
      width: app.globalData.windowWidth,
      height: 200
    },
    radarChartConfig : {
      appendPadding:0,
      padding:30,
      pixelRatio : app.globalData.pixelRatio,
      width: 250,
      height: 250
    },
    showAirQuatityRadar:false,
    drawerModalName:null,
    x: 0,
    y: 0,
    ww: 0,
    hh: 0,
    latitude: "",
    longitude: "",
    datePicker: {},
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    lastRefreshTime: '',
    // initChart: !1,
    // refreshChart: !1,
    refreshSunset: false,
    refreshLocation: false,
    refreshRadar: false,
    canBlurRoot: false,
    isHourlyRainChart:true,
    isManualGetNewLocation:false,
    rainChartName:'小时',
    isChangeSetting: false,
    hasCusImage: false,
    networkType: 'none',
    imageBase64: '',
    qrImageURL: '',
    updateSunsetTime: null,
    sunrise: "06:00",
    sunset: "19:34",
    painting: {},
    shareImage: '',
    touchS: [0, 0],
    touchE: [0, 0],
    curDetailTime: '',
    moonPhaseLists: [],
    historyCityList: [],
    authScreen: false,
    bingImage: "",
    bingImageLists:null,
    src: null,
    visible: false,
    size: {
      width: 400,
      height: 300
    },
    cropSizePercent: 0.9,
    manualLocationData: wx.getStorageSync('manualLocationData') || [],
    forecastData: {
      hourlyKeypoint: "",
      // minutelyKeypoint: "",
      rainRadar: {
        coverImage: "",
        forecastImages: {},
        images: {}
      },
      aqiRadar: {
        coverImage: "",
        images: {}
      },
      minutely: {},
      hourly: {},
      daily: {},
      city: "",
      address: "",
      latitude: "",
      longitude: "",
      serviceData: [],
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
      'getLocationMethod',
      'getWeatherDataAgain',
      'icon',
      'iconValue'
    ]
  },
  onLoad(a) {
    log('[onLoad]')
    const t = this
    const handler = function (evt) {
      log('[' + evt + ']' + '=>', evt)
    }
    store.onChange(handler)
    t.loadDataFromNet()
  },
  onHide(){
    log("[onHide]")
    // wx.stopAccelerometer();
  },
  onShow() {
    const t = this
    // t.onStartAccelerometer()
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
    if (location == null) {
      log('[location == null]')
      t.setData({
        isManualGetNewLocation:false
      })
    }
    if (location !== null) {
      log(`[chooseLocation.getLocation()] =>`, location)
      t.setData({
        isManualGetNewLocation:true,
        'forecastData.city': location.city,
        'forecastData.address': location.name,
        'longitude': location.longitude,
        'latitude': location.latitude
      })
      app.globalData.latitude = location.latitude
      app.globalData.longitude = location.longitude

      //auth状态手动获取经纬度后先不请求数据
        t.store.data.startScreen == 'auth' ? t.authScreenNext('canNavToFinalScreen') :
        t.store.data.startScreen == 'poetry' ? (t.getWeatherData(true), t.setData({
          'modalName': null
        })) :
        t.store.data.startScreen == 'default' ? (t.getWeatherData(true), t.setData({
          'modalName': null
        })) : ''
      log('[manualLocationData]', location)
      app.saveData('manualLocationData', location)
      //make sure location value != null
      app.changeStorage('getLocationMethod', 'manual')
    }
    if(t.store.data.getWeatherDataAgain == true){
      t.getWeatherData(false)
    }
  },
  onReady() {
    const t = this
    // t.setRefreshWeatherInterval()
    t.getBingImage()
    t.data.datePicker = scui.DatePicker("#datepicker")
  },
  loadDataFromStorage() {
    log('[loadDataFromStorage]')
    const t = this
    const getHistoryCityData = () => {
        wx.getStorage({
            key: "forecastData",
            success: res => {
              t.formatWeatherData(res.data);
            }
          }),
          wx.getStorage({
            key: "historyCityList",
            success: res => {
              log('[historyCityList]', res.data)
              t.setData({
                'forecastData.city': res.data[1].city,
                'forecastData.address': res.data[1].address,
                'latitude': res.data[1].latitude,
                'longitude': res.data[1].longitude,
                'forecastData.nowTemp': res.data[1].nowTemp
              });
              app.globalData.latitude = res.data[1].latitude
              app.globalData.longitude = res.data[1].longitude
            }
          }),
          wx.getStorage({
            key: "lastRefreshTime",
            success: res => {
              t.setData({
                'lastRefreshTime': res.data
              });
            }
          })
      }
      (async () => {
        t.setData({
          'canBlurRoot': true
        })
        await t.screenFadeIn()
        await getHistoryCityData()
        await t.screenFadeOut()
        await t.setData({
          'canBlurRoot': false
        })
        await t.scrollToTop()
        await t.checkNetWorkType()
      })()
  },
  loadDataFromNet() {
    const t = this
    log('[loadDataFromNet]', t.store.data.startScreen)
    t.store.data.startScreen == 'auth' ? t.screenFadeIn() : (t.screenFadeIn(),t.chooseGetLocationType())
  },
  screenFadeIn() {
    const t = this
    var windowWidth = t.data.windowWidth
    log('[screenFadeIn]', t.store.data.startScreen)
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
    t.store.data.startScreen == 'poetry' ? poetryScreenFadeIn() : t.store.data.startScreen == 'auth' ? authScreenFadeIn() : t.store.data.startScreen == 'default' ? defaultScreenFadeIn() : warn('[startScreen]')
    // t.onIntersectionObserver()
  },
  screenFadeOut() {
    const t = this
    log('[screenFadeOut]', t.store.data.startScreen)
    const poetryScreenFadeOut = () => {
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
      let authScreenAction = wx.createAnimation({
        duration: 1400,
        timingFunction: 'ease-in-out',
        delay: 100,
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

    const screenFadeOut = (screenFadeOutType) => {
        screenFadeOutType == 'poetry' ? poetryScreenFadeOut() : screenFadeOutType == 'auth' ? (authScreenFadeOut(), setTimeout(() => {
          t.store.data.startScreen = 'poetry'
        }, 2500)) : screenFadeOutType == 'default' ? defaultScreenFadeOut() : warn('[startScreen]')
    }
    (async () => {
      await screenFadeOut(t.store.data.startScreen)
      await t.onIntersectionObserver()
      await t.getMoonPhaseList()
      await t.onGetWXACode()
      await t.getPoetry()
      await t.setRefreshWeatherInterval()

    })()
  },
  checkNetWorkType() {
    const t = this
    wx.getNetworkType({
      success: res => {
        log(`[networkType] =>`, res.networkType)
        var networkType = res.networkType
        t.setData({
          networkType: networkType
        })
        if (networkType == 'none' || networkType == '2g' || networkType == undefined) {
          wx.showToast({
            title: '请检查你的网络连接',
            duration: 1500,
            icon: 'none',
            mask: true,
          })
          log('[onLoad] => loadDataFromStorage()')
          t.loadDataFromStorage()
        }
      }
    })
  },
  chooseGetLocationType() {
    const t = this
    log('[chooseGetLocationType] =>', t.store.data.getLocationMethod)
    t.store.data.getLocationMethod == 'manual' ? t.getLocationByManual() :
      t.store.data.getLocationMethod == 'auto' ? t.getLocationByAuto() :
      t.store.data.getLocationMethod == 'historyCity' ? t.getLocationByHistory() :
      warn('[getLocationMethod]')
  },
  getLocationByManual() {
    const t = this
    log('[getLocationByManual]', t.data.manualLocationData)
    const changeStorage = () => {
        app.changeStorage('getLocationMethod', 'manual')
      }
      (async () => {
        await t.setData({
          'latitude': t.data.manualLocationData.latitude,
          'longitude': t.data.manualLocationData.longitude,
          'forecastData.city': t.data.manualLocationData.city,
          'forecastData.address': t.data.manualLocationData.name
        }),
        await t.getWeatherData(false)
        await t.screenFadeOut()
        await changeStorage()
      })()
  },
  getLocationByHistory() {
    const t = this
    var historyCityData = wx.getStorageSync('historyCityList')
    const changeStorage = () => {
        app.changeStorage('getLocationMethod', 'historyCity')
      }
      (async () => {
        await t.setData({
          'latitude': historyCityData[0].latitude,
          'longitude': historyCityData[0].longitude,
          'forecastData.city': historyCityData[0].city,
          'forecastData.address': historyCityData[0].address
        }),
        await t.getWeatherData(false)
        await t.screenFadeOut()
        await changeStorage()
      })()
  },
  getLocationByAuto() {
    const t = this
    wx.getLocation({
      success: res => {
        (async (res) =>{
          log('[getLocationByAuto]',res)
          await t.setData({
            'latitude': res.latitude,
            'longitude': res.longitude
          })
          qqMapWX.reverseGeocoder({
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
            },
            fail: err => {
              log(`[reverseGeocoder] = > ${err}`)
            }
          })
          await t.store.data.startScreen !== 'auth' ? t.getWeatherData(false) : t.authScreenNext('canNavToFinalScreen')
        })(res)
        log(`[getLocationByAuto] =>`, res)
      },
      fail: err => {
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
                    wx.getLocation({
                      success: res => {
                        (async (res) =>{
                          log('[getLocationByAuto]',res)
                          await t.setData({
                            'latitude': res.latitude,
                            'longitude': res.longitude
                          })
                          qqMapWX.reverseGeocoder({
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
                            },
                            fail: err => {
                              log(`[reverseGeocoder] = > ${err}`)
                            }
                          })
                          await t.store.data.startScreen !== 'auth' ?(t.getWeatherData(false)) : t.authScreenNext('canNavToFinalScreen')
                        })(res)
                        log(`[getLocationByAuto] =>`, res)
                      },
                      fail: err => {
                        log(`[getLocation] => fail =>`,err)
                      }
                    });
                  } 
                }
              });
            } else {
              log('[scope.userLocation] fail')
            }
          }
        });
        log(`[getLocation] => fail =>`,err)
      }
    });
    app.changeStorage('getLocationMethod', 'auto')
  },
  getNewLocationByManual() {
    log('[getNewLocationByManual]')
    const t = this
    let locationKey = config.locationKey
    const appReferer = '奇妙天气-小程序';
    const locationCategory = '奇妙天气,XHY';
    app.changeStorage('getLocationMethod', 'manual')
    t.store.data.getLocationMethod = 'manual'
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + locationKey + '&referer=' + appReferer + '&category=' + locationCategory
    });
  },
  setNewWeatherDataByHistory(e) {
    const t = this
    var historyCityData = e.detail.historyCityData
    log('[setNewWeatherDataByHistory]', historyCityData)
    t.setData({
      'latitude': historyCityData.latitude,
      'longitude': historyCityData.longitude,
      'forecastData.city': historyCityData.city,
      'forecastData.address': historyCityData.address,
      'modalName': null
    }),
    app.globalData.latitude = historyCityData.latitude,
    app.globalData.longitude = historyCityData.longitude
    const changeStorage = () => {
        app.changeStorage('getLocationMethod', 'historyCity')
        t.store.data.getLocationMethod = 'historyCity'
      }
      (async () => {
        await t.getWeatherData(true)
        await changeStorage()
      })()
  },
  getWeatherData(canRefreshChart) {
    const t = this
    let apiHost = config.weatherApiHost + "/" + config.weatherApiVersion + "/" + config.weatherApiToken + "/" + t.data.longitude + "," + t.data.latitude + "/weather.jsonp?lang=" + t.store.data.languageValue + "&dailysteps=30&hourlysteps=120&alert=true&unit=" + t.store.data.unitValue
    log('[getWeatherData] => apiHost', apiHost)
    wx.request({
      url: apiHost,
      success: a => {
        let weatherData = a.data.result;
        const refreshOrInitChart = (canRefreshChart) => {
          const initChart = () => {
            log('[initChart]')
            const temperatureChartComponent = t.selectComponent('#temperatureChart');
            temperatureChartComponent.lazyInitTemperatureChart(t.initTemperatureChart);
            const rainChartComponent = t.selectComponent('#rainChart');
            rainChartComponent.lazyInitRainChart(t.initRainChart);
            const radarChartComponent = t.selectComponent('#radarChart');
            radarChartComponent.lazyInitRadarChart(t.initRadarChart);
          }
          const refreshChart = () => {
            let temperatureChartData = t.getTemperatureChartData().chartData
            let rainChartData= t.getHourlyRainChartData()
            let radarChartData= t.getRadarChartData()
            rainChart.changeData(rainChartData)
            radarChart.changeData(radarChartData)
            temperatureChart.changeData(temperatureChartData)
            temperatureChart.guide().clear();
            log('[refreshChartData]')
          }
          log('[canRefreshChart] => ', canRefreshChart)
          if (canRefreshChart == true) {
            refreshChart()
          }
          if (canRefreshChart == false) {
            initChart()
          }
        }
        (async (weatherData, canRefreshChart) => {
          try{
            await t.loadingProgress(true)
            await t.setData({
              'canBlurRoot': true
            })
            await t.formatWeatherData(weatherData)
            await t.screenFadeOut()
            await t.setData({
              'canBlurRoot': false
            })
            await t.scrollTo('#top')
            await refreshOrInitChart(canRefreshChart)
            await t.loadingProgress(false)
            await t.checkNetWorkType()
          }catch{
            
          }
          app.saveData("forecastData", weatherData)
        })(weatherData, canRefreshChart)
      }
    })
  },
  formatWeatherData(a) {
    log('[formatWeatherData]')
    const that = this;
    const realtime = (realtime) => {
      log(`[formatWeatherData] => [realtime]`, realtime)
      let realtimeTemperature = realtime.temperature
      let realtimeSkycon = realtime.skycon
      let realtimeWind = {
        wind: that.getWindDirect(realtime.wind.direction),
        windSpeed: realtime.wind.speed,
        windLevel: that.getWindLevel(realtime.wind.speed),
        windDirection: that.getWindDirect(realtime.wind.direction)
      }
      let realtimeAirquality = {
        aqi: realtime.air_quality.aqi.chn,
        aqiName: realtime.air_quality.description.chn,
        aqiDescription: that.getAqiDescription(realtime.air_quality.aqi.chn),
        aqiLevel: that.getAqiData(realtime.aqi).level,
        no2: realtime.air_quality.no2,
        o3: realtime.air_quality.o3,
        pm10: realtime.air_quality.pm10,
        pm25: realtime.air_quality.pm25,
        so2: realtime.air_quality.so2,
        co: realtime.air_quality.co
      }
      let realtimeAqiColor = that.setAqiColor(realtime.aqi)
      let realtimeData = {
        nowTemp: ~~(realtimeTemperature),
        skyconCN: transWeatherName.weatherSkycon[realtimeSkycon],
        wind: realtimeWind,
        humidity: that.getHumidity(parseInt(100 * realtime.humidity)),
        airQuality: realtimeAirquality,
        aqiColor: realtimeAqiColor
      }
      const reduceHistoryCityData = (reduceData) => {
        let historyCityList = wx.getStorageSync('historyCityList') || []
        let hash = {}
        historyCityList.unshift(reduceData)
        historyCityList = historyCityList.reduce(
          function (item, next) {
            hash[next.address] ? '' : hash[next.address] = true && item.push(next);
            return item
          }, [])
        return historyCityList
      }
      var count = 20,keyword = transWeatherName.weatherKeyWord[realtimeSkycon]
      app.request('GET','https://500px.com.cn/community/searchv2?client_type=1&imgSize=p2%2Cp4&key='+ keyword +'&searchType=photo&page=1&size='+ count +'&type=json&avatarSize=a1&resourceType=0%2C2',{}).then((result) => {
        let randomBgIndex = _.random(0,result.data.data.length)
        let backgroundBg = result.data.data[randomBgIndex].url.p4
        log('[backgroundBg]',backgroundBg,keyword)
        let data = {
          address: that.data.forecastData.address,
          city: that.data.forecastData.city,
          solidIcon: config.cosApiHost + "/weather/icon/solidIcon/" + realtime.skycon + "-icon.svg",
          flatIcon: config.cosApiHost + "/weather/icon/flatIcon/" + realtime.skycon + "-icon.svg",
          lineIcon: config.cosApiHost + "/weather/icon/lineIcon/" + realtime.skycon + "-icon.svg",
          colorIcon: config.cosApiHost + "/weather/icon/colorIcon/" + realtime.skycon + "-icon.svg",
          backgroundBg:backgroundBg,
          nowTemp: ~~(realtimeTemperature),
          skycon: realtime.skycon,
          skyconCN: transWeatherName.weatherSkycon[realtimeSkycon],
          latitude: that.data.latitude,
          longitude: that.data.longitude
        }
        let historyCityList = reduceHistoryCityData(data)
        that.setData({
          'historyCityList': historyCityList
        })
        app.saveData("historyCityList", historyCityList)
      }).catch((err) => {
        console.log(err);
      })
      return realtimeData
    }
    // const minutely = () => {
    //   log('[formatWeatherData] => [minutely]', a.minutely)
    //   that.setData({
    //     'forecastData.minutely': {
    //       precipitation: a.minutely.precipitation,
    //       precipitation_2h: a.minutely.precipitation_2h,
    //       probability: a.minutely.probability
    //     }
    //   })
    // }
    const hourly = (hourlyData) => {
      log('[formatWeatherData] => [hourly]', hourlyData)
      for (var t = hourlyData, hourlyReduce = [], r = new Date().getHours(), n = 0; n < 48; n++) {
        let c = n + r;
        hourlyReduce.push({
          time: c % 24 + ".00",
          weather: transWeatherName.weatherSkycon[t.skycon[n].value],
          weatherEN: t.skycon[n].value.replace(/_/g, ' '),
          iconPath: config.cosApiHost + "/weather/icon/"+ that.store.data.iconValue +"/" + t.skycon[n].value + "-icon",
          temp: ~~(t.temperature[n].value) + '°',
          wind: that.getWindDirect(t.wind[n].direction) + "·" + that.getWindLevel(t.wind[n].speed),
          value: t.skycon[n].value,
          precipitation: t.precipitation[n]
        });
      }
      return hourlyReduce
    }
    const service = (dailyData) => {
      let d = dailyData
      var serviceData = [{
        desc: ~~(d.temperature[0].avg) + '°',
        name: that.store.data.languageValue == 'zh_CN' ? "体感温度" : that.store.data.languageValue == 'zh_TW' ? "體感溫度" : "Feels Like",
        type: "sw-temperature"
      }, {
        desc: ~~(d.humidity[0].avg * 100) + "%",
        name: that.store.data.languageValue == 'zh_CN' ? "湿度" : that.store.data.languageValue == 'zh_TW' ? "濕度" : "Humidity",
        type: "sw-humidity"
      }, {
        desc: ~~(d.life_index.ultraviolet[0].index),
        name: that.store.data.languageValue == 'zh_CN' ? "紫外线指数" : that.store.data.languageValue == 'zh_TW' ? "紫外线指数" : "UV index",
        type: "sw-ultraviolet"
      }, {
        desc: d.visibility[0].avg + "km",
        name: that.store.data.languageValue == 'zh_CN' ? "能见度" : that.store.data.languageValue == 'zh_TW' ? "能见度" : "Visibility",
        type: "sw-visibility"
      }, {
        desc: d.cloudrate[0].avg,
        name: that.store.data.languageValue == 'zh_CN' ? "云量" : that.store.data.languageValue == 'zh_TW' ? "雲量" : "Cloudiness",
        type: "sw-cloudrate"
      }, {
        desc: ~~(d.pressure[0].avg) + "mb",
        name: that.store.data.languageValue == 'zh_CN' ? "气压" : that.store.data.languageValue == 'zh_TW' ? "氣壓" : "Pressure",
        type: "sw-pressure"
      }]
      return serviceData
    }
    const daily = (dailyData) => {
      log('[formatWeatherData] => [daily]', dailyData)
      for (var d = dailyData, dailyReduce = [], f = 0; f < 16; f++) {
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
        // if (f == 0) {
        //   that.setData({ 
        //     'updateSunsetTime': d.astro[f].date,
        //     'sunrise': d.astro[f].sunrise.time,
        //     'sunset': d.astro[f].sunset.time,
        //     'refreshSunset': true
        //   })
        // }
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
        dailyReduce.push({
          date: getWeek(l),
          weather: transWeatherName.weatherSkycon[d.skycon[f].value],
          weatherEN: d.skycon[f].value.replace(/_/g, ' '),
          iconPath: config.cosApiHost + "/weather/icon/"+ that.store.data.iconValue + "/" + d.skycon[f].value + "-icon",
          min: ~~(d.temperature[f].min),
          max: ~~(d.temperature[f].max),
          monthday: p,
          id: d.skycon[f].value,
          aqi: d.air_quality.aqi[f].avg.chn,
          astro: {
            date: d.astro[f].date,
            sunrise: d.astro[f].sunrise.time,
            sunset: d.astro[f].sunset.time
          },
          windLevel: that.getWindLevel(d.wind[f].avg.speed),
          windDirect: that.getWindDirect(d.wind[f].avg.direction),
          precipitation: d.precipitation[f]
        });
      }
      return dailyReduce
    }
    const alertContent = (alertData) => {
      if (alertData == []) {
        return
      } else {
        for (var y = alertData, v = [], w = 0; w < y.length; w++) {
          v.push({
            level: y[w].code.slice(2, 4),
            alertType: y[w].code.slice(0, 2),
            content: y[w].description,
            source: y[w].source,
            levelName: transWeatherName.WeatherWarningLevel[y[w].code.slice(2, 4)],
            typeName: transWeatherName.WeatherWarning[y[w].code.slice(0, 2)]
          });
        }
        return v
      }
    }
    const setCurTime = () => {
      let time = util.formatDate(new Date())
      let date = util.getDates(7, time)
      let curDetailTime = date[0].time + " " + date[0].week
      app.saveData("lastRefreshTime", curDetailTime)
      return curDetailTime
    }
    const setTimelyWeather = (forecastData) => {
      const realtimeData = realtime(forecastData.realtime)
      const hourlyData = hourly(forecastData.hourly)
      const dailyData = daily(forecastData.daily)
      const serviceData = service(forecastData.daily)
      const alertContentData = alertContent(forecastData.alert.content)
      const curTime = setCurTime()
      that.setData({
        'forecastData.daily': dailyData,
        'forecastData.realtime': realtimeData,
        'forecastData.hourly': hourlyData,
        'forecastData.serviceData': serviceData,
        'forecastData.hourlyKeypoint': a.hourly.description,
        'forecastData.alarmInfo': alertContentData,
        'curDetailTime': curTime
        // 'forecastData.minutelyKeypoint': a.minutely.description,
        // 'forecastData.minutely':{
        //   precipitation:a.minutely.precipitation,
        //   precipitation_2h:a.minutely.precipitation_2h,
        //   probability:a.minutely.probability
        // }
      });
    }
    setTimelyWeather(a)
  },
  setRefreshWeatherInterval() {
    const t = this
    let refreshTime = t.store.data.refreshfrequencyValue * 60 * 1000
    log('[refreshTime]', refreshTime)
    setInterval(() => {
      log('[setRefreshWeatherInterval] => setInterval()', refreshTime)
      t.getWeatherData(true)
    }, refreshTime);
  },
  setAqiColor(a) {
    let t = "#4ADC9B";
    return 0 <= a && a <= 50 ? t = "#4ADC9B" : 51 <= a && a <= 100 ? t = "#F5E878" : 101 <= a && a <= 150 ? t = "#FC9F62" : 151 <= a && a <= 200 ? t = "#FD4452" : 201 <= a && a <= 300 ? t = "#B044FC" : 300 <= a && (t = "#B044FC"),
      t;
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
    return self.store.data.languageValue == 'zh_CN' ? zh_CN() : self.store.data.languageValue == 'zh_TW' ? zh_TW() : self.store.data.languageValue == 'en_US' || self.store.data.languageValue == 'en_GB' ? en_US_en_GB() : warn('[getAqiDescription]')
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
    log('[getWindSpeed]', self.store.data.languageValue)
    return self.store.data.languageValue == 'zh_CN' ? zh_CN() : self.store.data.languageValue == 'zh_TW' ? zh_TW() : self.store.data.languageValue == 'en_US' || self.store.data.languageValue == 'en_GB' ? en_US_en_GB() : warn('[getWindSpeed]')
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
    return self.store.data.languageValue == 'zh_CN' ? zh_CN() : self.store.data.languageValue == 'zh_TW' ? zh_TW() : self.store.data.languageValue == 'en_US' || self.store.data.languageValue == 'en_GB' ? en_US_en_GB() : warn('[getWindDirect]')
  },
  getMoonPhaseList() {
    log('[getMoonPhaseList]')
    const t = this
    let obj = Array.from(Array(30), (v, k) => k)
    obj.map(function (value, index, arr) {
      const getMoonName = (r) => {
        // log('[getMoonName]',r)
        let zh_CN = '新月'
        let zh_TW = '新月'
        let en_US_en_GB = 'New Moon'
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
    let reduceObj = {}
    let moonPhaseLists = obj.reduce((item, next) => {
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
        let bingImageLists = res.data.images
        let copyrightlink = 'https://bing.ioslide.com' + bingImageLists[0].copyrightlink
        let bingImage = 'https://cn.bing.com' + bingImageLists[0].url
        let enddate = bingImageLists[0].enddate
        log('[copyrightlink]',copyrightlink)
        t.setData({
          copyrightlink:copyrightlink,
          bingIndex : 0,
          bingImage: bingImage,
          bingImageLists : bingImageLists
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
  onStartAccelerometer(){
    wx.startAccelerometer({
      interval: "ui"
    });
    const that = this
    let t = app.globalData.screenWidth
    let a = t / 750
    let o = 75 * a
    let n = 168.5 * a
    that.setData({
      ww:o,
      hh:n
    })
    wx.onAccelerometerChange(function(t) {
        let a = -10 * t.x
        let o = -10 * t.y;
        Math.abs(a) > 7 || Math.abs(o) > 10 || (that.setData({
          x : a,
          y : o
        }))
    });
  },
  onAuthFinalScreen() {
      log('[onAuthFinalScreen]')
    const t = this
    const windowWidth = t.data.windowWidth
    const authFinalStepLeaf = () =>{
      t.animate('#leaf', [
        { translate3d: [windowWidth * 2,0,0],rotate3d: [0,0,0.6,45],scale:[0.7],ease:'ease-in-out' },
        { translate3d: [windowWidth * 2.7,250,0],rotate3d: [0,0,-1,45],scale:[0.7],ease:'ease-in-out' }
      ], 1000)
    }
    (async () => {
      await wx.showToast({
        title: 'Loading',
        mask:true,
        icon:'loading'
      })
      await t.getWeatherData(false)
      await authFinalStepLeaf()
      await wx.hideToast()
      // await t.screenFadeOut()
    })()
  },
  authScreenNext(e) {
    log('[authScreenNext]', e)
    const t = this
    let windowWidth = t.data.windowWidth
    let windowHeight = t.data.windowHeight
    const authFirstStepLeaf = () =>{
      wx.createSelectorQuery().select('#authScreenStepContent').boundingClientRect(function(rect){
        t.animate('#leaf', [
          { translate3d: [0,0,0], rotate3d: [0,0,1,45],scale:[1],ease:'ease-in-out' },
          { translate3d: [windowWidth,-rect.top,0],rotate3d: [0,10,-1,45],scale:[0.3],ease:'ease-in-out'  },
        ], 1000)
      }).exec()
    }
    const authSecondStepLeaf = () =>{
      wx.createSelectorQuery().select('#authScreenStepContent').boundingClientRect(function(rect){
        t.animate('#leaf', [
          { translate3d: [windowWidth,-rect.top,0],rotate3d: [0,10,-1,45],scale:[0.3],ease:'ease-in-out'},
          { translate3d: [windowWidth * 2,0,0],rotate3d: [0,0,0.6,45],scale:[0.7],ease:'ease-in-out' }
        ], 1000)
      }).exec()
    }
    const checkLocationAuth = () => {
      log('[authScreenNext] => checkLocationAuth')
      wx.getSetting({
        success: res => {
          log(`[authSetting] =>`, res)
          if (res.authSetting['scope.userLocation']) {
            transX(windowWidth * 2)
            authSecondStepLeaf()
            app.saveData('hasUserLocation', true)
            app.changeStorage('startScreen', 'poetry')
            log('[hasUserLocation]')
          }
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success: res => {
                log('[scope.userLocation] =>', res)
                transX(windowWidth * 2)
                authSecondStepLeaf()
                app.saveData('hasUserLocation', true)
                app.changeStorage('startScreen', 'poetry')
              },
              fail: err => {
                log(`check = > [wx.authorize] =>`, err)
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
                            transX(windowWidth * 2)
                            authSecondStepLeaf()
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
      let stepAction = wx.createAnimation({
        duration: 1200,
        timingFunction: 'ease-in-out',
        delay: 0
      });
      stepAction.translate3d(-steps, 0, 0).step()
      t.setData({
        defaultScreenAni: stepAction.export(),
      })
    }
    if (e == 'canNavToFinalScreen') {
      transX(windowWidth * 3), log('[authFinalStep]')
    } else {
      let detailDarget = e.currentTarget.dataset.target
      detailDarget == 'authFirstStep' ? (transX(windowWidth), authFirstStepLeaf(),log('[authFirstStep]')) : 
      detailDarget == 'authSecondStep' ? (checkLocationAuth(), log('[authSecondStep]')) : 
      detailDarget == 'authThirdStep' ? (transX(windowWidth * 3), log('[authThirdStep]')) : 
      detailDarget == 'authFourthStep' ? (transX(windowWidth * 3), log('[authFourthStep]')) : 
      (warn("transX"))
    }
  },
  authScreenBack(e) {
    log('[authScreenBack]')
    const t = this
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
    e.currentTarget.dataset.target == 'authFirstStep' ? (transX(t.data.windowWidth), log('[backAuthFirstStep]')) : e.currentTarget.dataset.target == 'authSecondStep' ? (transX(t.data.windowWidth), log('[backAuthSecondStep]')) : e.currentTarget.dataset.target == 'authThirdStep' ? (transX(t.data.windowWidth * 2), log('[backAuthThirdStep]')) : e.currentTarget.dataset.target == 'authFourthStep' ? (transX(t.data.windowWidth * 2), log('[backAuthFourthStep]')) : warn('[backStep]')
  },
  getPoetry() {
    // async getPoetry() {
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
      log(`[getPoetry] => poetryData =>`, poetryData)
      result.data.content = result.data.content.substring(0, result.data.content.lastIndexOf('。'))
      poetryData.unshift(result.data)
      app.saveData("poetry_storage", [...new Set(poetryData)])
    })
  },
  switchChange(e) {
    log('[switchChange]',e.currentTarget.dataset.target)
    const t = this
    e.currentTarget.dataset.target == 'getNewLocationByManual' ? t.getNewLocationByManual() : 
    e.currentTarget.dataset.target == 'getLocationByAuto' ? t.getLocationByAuto() : error("switchChange")
  },
  showModal(e) {
    log('[showModal]', e.currentTarget.dataset.target)
    const t = this
    const setData = (modalName) => {
      t.setData({
        modalName: modalName
      })
    }
    e.currentTarget.dataset.target == 'DrawerModalB' ? (t.onGetWXACode(), setData(e.currentTarget.dataset.target)) : e.currentTarget.dataset.target == 'shareImage' ? (t.eventDraw(), setData(e.currentTarget.dataset.target)) : setData(e.currentTarget.dataset.target)
  },
  showDrawerModal(e){
    const t = this
    t.setData({
      drawerModalName: e.currentTarget.dataset.target
    })
  },
  hideDrawerModal(e){
    log('[hideDrawerModal]')
    var drawerModalName = e.detail.drawerModalName;
    const t = this
    t.setData({
      drawerModalName: drawerModalName
    })
  },
  savePostImg(e){
    this.setData({
      modalName:e.detail.modalName
    })
    this.eventDraw()
  },
  showModalListener(e) {
    log('[showModal]', e)
    const t = this
    const setData = (drawerModalName) => {
      t.setData({
        drawerModalName: drawerModalName
      })
    }
    e.detail == 'DrawerModalB' ? (t.onGetWXACode(), setData(e.detail)) : e.detail == 'shareImage' ? (t.eventDraw(), setData(e.detail)) : setData(e.detail)
  },
  hideModal(e) {
    log('[hideModal]')
    const t = this
    t.setData({
      modalName: null
    })
    // wx.hideLoading()
  },
  navChange(e) {
    log(`[navChange] => ${e.currentTarget.dataset.cur}`)
    const cur = e.currentTarget.dataset.cur
    wx.navigateTo({
      url: '../' + cur + '/' + cur
    });
  },
  navCopyrightlink(e){
    log('[navCopyrightlink]')
    let cur = e.target.dataset.cur
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
      url: '../radar/radar?latitude=' + t.data.latitude + "&longitude=" + t.data.longitude
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
  navWechatsi(){
    wx.navigateTo({
      url: '../plugins/page/wechatsi/wechatsi'
    })
  },
  onPullDownRefresh() {
    const t = this
    log(`[onPullDownRefresh]`, t.store.data.startScreen)
    let time = util.formatDate(new Date())
    let date = util.getDates(7, time)
    app.saveData("lastRefreshTime", date[0].time)
    if (t.store.data.startScreen !== 'auth') {
        (async () => {
          await t.setData({
            'canBlurRoot': true
          })
          await t.getWeatherData(true)
          await wx.stopPullDownRefresh();
          await t.setData({
            'canBlurRoot': false
          })
        })()
    }
  },
  onReachBottom() {
    log(`[onReachBottom]`)
  },
  eventDraw() {
    log(`[eventDraw]`)
    const t = this
    wx.showLoading({
      title: 'Loading',
      mask: true
    })
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
    const t = this
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
  datePickerSubmit(e) {
    let submitValue = e.detail.value
    let time = util.formatDate(submitValue)
    let date = util.getDates(7, time)
    let startTime = date[0].time
    log('[submitStartTime] =>', startTime)
    const t = this
    const templateId = config.subTemplateId
    const subDailyWeatherCloudFn = () => {
      let cloudData = {
        action: 'saveSubscribeMessage',
        page: 'pages/index/index',
        unit: t.store.data.unitValue,
        language: t.store.data.languageValue,
        city: t.data.forecastData.city,
        startTime: startTime,
        latitude: t.data.latitude,
        longitude: t.data.longitude,
        templateId: templateId,
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
        templateId: templateId
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
  eventHandle(e) {
    log('[official-account] =>', e)
  },
  touchStart(e) {
    let sx = e.touches[0].pageX
    let sy = e.touches[0].pageY
    this.data.touchS = [sx, sy]
  },
  touchMove(e) {
    let sx = e.touches[0].pageX
    let sy = e.touches[0].pageY
    this.data.touchE = [sx, sy]
  },
  touchEnd(e) {
    const t = this
    let start = this.data.touchS
    let end = this.data.touchE
    if (start[0] < end[0] - 50) {} else if (start[0] > end[0] + 50) {
      t.setData({
        drawerModalName: e.currentTarget.dataset.target
      })
    } else {}
  },
  touchEndLess(e) {
    const t = this
    let start = this.data.touchS
    let end = this.data.touchE
    if (start[0] < end[0] - 5) {
    } else if (start[0] > end[0] + 5) {
      t.setData({
        drawerModalName: e.currentTarget.dataset.target
      })
    } else {}
  },
  reqRadar() {
    const t = this
    const reqRainRadar = () => {
      let rainRadarApiHost = config.weatherApiHost + "/" + config.radarApiVersion + "/radar/fine_images?lat=" + t.data.latitude + "&lon=" + t.data.longitude + "&level=1&token=" + config.radarApiToken
      log('[reqRainRadar] => rainRadarApiHost', rainRadarApiHost)
      wx.request({
        url: rainRadarApiHost,
        success: (result) => {
          log('[rainRadarApiHost result]', result)
          if(result.data.status == 'failed'){
            return t.setData({
              'forecastData.rainRadar.latitude': t.data.latitude,
              'forecastData.rainRadar.longitude':  t.data.longitude
            })
          }
          let rainRadarImg = result.data.images[result.data.images.length - 1][0]
          let source = result.data.images[result.data.images.length - 1]
          let rainRadarPosition = source[2]

          const reduceRainRadarImages = () => {
            let rainRadarImageData = []
            let rainRadarImages = result.data.images
            for (var m = rainRadarImages, i = 0; i < rainRadarImages.length; i++) {
              var u = {
                image: m[i][0]
              };
              rainRadarImageData.push(u);
            }
            return rainRadarImageData
          }
          const reduceRainRadarForecastImages = () => {
            var rainRadarforecastImagesData = []
            var rainRadarforecastImages = result.data.forecast_images
            for (var n = rainRadarforecastImages, j = 0; j < rainRadarforecastImages.length; j++) {
              var v = {
                image: n[j][0]
              };
              rainRadarforecastImagesData.push(v);
            }
            return rainRadarforecastImagesData
          }
          const reduceRainRadarData = async () => {
            let rainRadarforecastImagesData = await reduceRainRadarForecastImages()
            let rainRadarImageData = await reduceRainRadarImages()
            return {
              rainRadarImageData,
              rainRadarforecastImagesData
            }
          }
          reduceRainRadarData().then(res => {
            t.setData({
              'forecastData.rainRadar.latitude': (rainRadarPosition[0] + rainRadarPosition[2]) / 2,
              'forecastData.rainRadar.longitude': (rainRadarPosition[1] + rainRadarPosition[3]) / 2,
              'forecastData.rainRadar.coverImage': rainRadarImg,
              'forecastData.rainRadar.images': res.rainRadarImageData,
              'forecastData.rainRadar.forecastImages': res.rainRadarforecastImagesData
            })
          })
        },
        fail: (res) => {

        }
      })
    }
    const reqAqiRadar = () => {
      let aqiRadarApiHost = config.weatherApiHost + "/" + config.radarApiVersion + "/aqi/images?token=" + config.radarApiToken + "&lon=" + t.data.longitude + "&lat=" + t.data.latitude
      log('[reqAqiRadar] => aqiRadarApiHost', aqiRadarApiHost)
      wx.request({
        url: aqiRadarApiHost,
        success: (result) => {
          log('[reqAqiRadar result]', result)
          let aqiRadarImg = result.data.images[result.data.images.length - 1][0]
          t.setData({
            'forecastData.aqiRadar.coverImage': aqiRadarImg,
            'forecastData.aqiRadar.images': result.data.images
          })
        },
        fail: (res) => {},
        complete: () => {

        }
      })
    }
    (async () => {
      await reqRainRadar()
      await reqAqiRadar()
    })()
  },
  onIntersectionObserver() {
    // log('[onIntersectionObserver]')
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
        // log('[firstObserver] => end')
      }
    })
    wx.createIntersectionObserver().relativeToViewport().observe('#refreshSunset', (res) => {
      if (res.boundingClientRect.top > 0) {
        log('[refreshSunset] => start')
        ani.opacity(1).step()
        t.setData({
          'updateSunsetTime': t.data.forecastData.daily[0].astro.date,
          'sunrise': t.data.forecastData.daily[0].astro.sunrise,
          'sunset': t.data.forecastData.daily[0].astro.sunset,
          'refreshSunset': true
        })
      }
      if (res.boundingClientRect.top < 0) {
        // log('[refreshSunset] => end')
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
        // log('[temperatureObserver] => end')
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
        // log('[thirdObserver] => end')
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
        // log('[rainObserver] => end')
      }
    })
    wx.createIntersectionObserver().relativeToViewport({
      top: 10
    }).observe('#radarObserver', (res) => {
      if (res.boundingClientRect.top > 0) {
        log('[radarObserver] => start')
        t.reqRadar()
        ani.opacity(1).step()
        t.setData({
          radarObserverAni: ani.export()
        })
      }
      if (res.boundingClientRect.top < 0) {
        // log('[radarObserver] => end')
      }
    })
    var fourthObserver = wx.createIntersectionObserver()
    fourthObserver.relativeToViewport().observe('#fourthObserver', (res) => {
      if (res.boundingClientRect.top > 0) {
        ani.opacity(1).step()
        t.setData({
          fourthObserverAni: ani.export()
        })
        // (async () => {
        //   await t.getMoonPhaseList()
        //   await t.setData({
        //     fourthObserverAni: ani.export()
        //   })
        // })()
      }
      if (res.boundingClientRect.top < 0) {
        // log('[fourthObserver] => end')
      }
    })
    wx.createIntersectionObserver().relativeToViewport().observe('#fifthObserver', (res) => {
      if (res.boundingClientRect.top > 0) {
        log('[fifthObserver] => start')
        fourthObserver.disconnect()
        ani.opacity(1).step()
        t.setData({
          fifthObserverAni: ani.export()
        })
      }
      if (res.boundingClientRect.top < 0) {
        // log('[fifthObserver] => end')
      }
    })
    wx.createIntersectionObserver().relativeToViewport().observe('#sixthObserver', (res) => {
      if (res.boundingClientRect.top > 0) {
        log('[sixthObserver] => start')
        ani.opacity(1).step()
        t.setData({
          sixthObserverAni: ani.export()
        })
        wx.createIntersectionObserver().disconnect()
      }
      if (res.boundingClientRect.top < 0) {
        // log('[sixthObserver] => end')
      }
    })
  },
  onShareAppMessage(a) {
    const t = this
    return {
      title: '奇妙天气',
      path: "/pages/index/index",
      imageUrl:"https://teaimg.ioslide.com/weather/onShareAppMessage.png"
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
    var themeValue = e.detail.value.toString()
    var theme = {
      themeChecked_auto: false,
      themeChecked_light: false,
      themeChecked_dark: false
    }
    const setData = () => {
      themeValue == 'light' ? theme['themeChecked_light'] = true :theme['themeChecked_dark'] = true
      t.setData({
        modalName: null,
        isChangeSetting: true
      })
    }
    const changeStorage = () => {
      log('[isChangeSetting]', true)
      t.store.data.theme = theme
      t.store.data.themeValue = themeValue
      app.changeStorage('themeValue', themeValue)
      app.changeStorage('theme', theme)
    }
    const event = async () => {
      await setData()
      await changeStorage()
    }
    event()
  },
  unitValueRadioChange(e) {
    const t = this
    var unit = {
      metric: false,
      SI: false,
      imperial: false
    }
    const setData = () => {
      e.detail.value == 'metric'? (unit['metric'] = true) :e.detail.value == 'imperial'? (unit['imperial'] = true) :(unit['SI'] = true)
      t.setData({
        modalName: null,
        isChangeSetting: true
      })
    }
    const changeStorage = () => {
      log('[isChangeSetting]', true)
      t.store.data.unitValue = e.detail.value.toString()
      t.store.data.unit = unit
      app.changeStorage('unitValue', e.detail.value.toString())
      app.changeStorage('unit', unit)
    }
    const event = async () => {
      await setData()
      await changeStorage()
    }
    event()
  },
  languageRadioChange: function (e) {
    const t = this
    var language = {
      languageChecked_zh_TW: false,
      languageChecked_zh_CN: false,
      languageChecked_en_US: false,
      languageChecked_en_GB: false
    }
    var languageValue = e.detail.value.toString()
    const setData = () => {
      log('[languageValue] =>', e.detail.value.toString())
      e.detail.value == 'zh_TW' ? (language['languageChecked_zh_TW'] = true):
      e.detail.value == 'zh_CN' ? (language['languageChecked_zh_CN'] = true):
      e.detail.value == 'en_US' ? (language['languageChecked_en_US'] = true): (language['languageChecked_en_GB'] = true)
      this.setData({
        modalName: null,
        isChangeSetting: true
      })
      log('[isChangeSetting]', true)
    }
    const changeStorage = () => {
      t.store.data.languageValue = languageValue
      t.store.data.language = language
      app.changeStorage('language', language)
      app.changeStorage('languageValue', languageValue)
    }
    const event = async () => {
      await setData()
      await changeStorage()
    }
    event()
  },
  updateComponnet: function () {
    var src = this.data.src ? this.data.src : this.data.bingImage; //裁剪图片不存在时，使用default图片，注意加载时的相对路径
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
    log('[chooseCropImage]',e)
    let type = e.detail.type
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
        log('[uploadFile]', res)
        t.setData({
          visible: false,
          cusImage: event.detail.resultSrc,
          hasCusImage: true,
          modalName: null
        })
        app.saveData('hasCusImage', true)
        app.saveData('cusImageFileID', res.fileID)
        console.log(res.fileID)
      }).catch(error => {
        log(error)
      })
    }
    let fileName = util.formatDateClear(new Date()).concat(app.globalData.openid)
    cloudUpload(event.detail.resultSrc, fileName)
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
    const t = this
    wx.showModal({
      title: t.store.data.languageValue == 'zh_TW' ?'沒錢開發中':t.store.data.languageValue == 'zh_CN'?'没钱开发中':'No money',
      content: t.store.data.languageValue == 'zh_TW' ?'不要期待':t.store.data.languageValue == 'zh_CN'?'不要期待':'Do not expect'
    })
  },
  refreshLocation() {
    console.log('[refreshLocation]')
    const t = this
    //自动获取系统定位的location,请求数据
    t.getLocationByAuto()
    app.changeStorage('getLocationMethod', 'auto')
  },
  scrollTo(viewId) {
    let query = wx.createSelectorQuery();
    query.select(viewId).boundingClientRect();
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      if (res[0] && res[1])
        wx.pageScrollTo({
          scrollTop: res[0].top + res[1].scrollTop,
          duration: 1200
        });
    });
  },
  _scrollTo(e) {
    const t = this
    let query = wx.createSelectorQuery();
    query.select(e.detail.viewId).boundingClientRect();
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      if (res[0] && res[1])
        wx.pageScrollTo({
          scrollTop: res[0].top + res[1].scrollTop - t.data.windowHeight/3,
          duration: 1200
        });
    });
  },
  getTemperatureChartData (){
    var chartData = []
    var dailyWeather = this.data.forecastData.daily
    for (var s = dailyWeather, d = 1; d < 8; d++) {
      var u = {
        x: s[d].date,
        y: [s[d].min, s[d].max]
      };
      chartData.push(u);
    }
    let range = {
        max : Math.max.apply(Math, dailyWeather.map(function (o) {
        return o.max
       })),
        min:Math.min.apply(Math, dailyWeather.map(function (o) {
          return o.min
        }))
    }
    return {chartData,range}
  },
  initTemperatureChart(F2,config){
    let chartData = this.getTemperatureChartData().chartData
    let range = this.getTemperatureChartData().range
    temperatureChart = new F2.Chart(config);
    return temperatureChart.clear(),
    temperatureChart.legend(!1),
    temperatureChart.axis("y", !1),
    temperatureChart.axis("x", !1),
    temperatureChart.tooltip(false),
    temperatureChart.source(chartData, {
      x: {
        tickCount: 7
      },
      y: {
        min: range.min,
        max: range.max
      }
    }),
    chartData.map(function (obj) {
      temperatureChart.guide().text({
        top: true,
        position: [obj.x, obj.y[0]],
        content: obj.y[0],
        style: {
          textAlign: 'center',
          textBaseline: 'top',
          fontSize: 12,
          fill: '#8799a3'
        },
        offsetY: 10
      });
      temperatureChart.guide().text({
        top: true,
        position: [obj.x, obj.y[1]],
        content: obj.y[1],
        style: {
          textAlign: 'center',
          textBaseline: 'bottom',
          fontSize: 12,
          fill: '#8799a3'
        },
        offsetY: -10
      });
    }),
    temperatureChart.interval().position('x*y')
      .animate({
        appear: {
          animation: 'shapesScaleInY'
        }
      })
      .size(9)
      .style({
        radius: [4, 4, 4, 4]
      })
      .color('l(90) 0:#d5effc 1:#bcc8d4'),
      temperatureChart.render(),
      temperatureChart;
  },
  getHourlyRainChartData(){
    var chartData = []
    var hourly = this.data.forecastData.hourly
    for (var s = hourly, d = 0; d < 48; d++) {
      var u = {
        time: s[d].precipitation.datetime,
        value: s[d].precipitation.value,
      };
      chartData.push(u);
    }
    // log('[getHourlyRainChartData rainWeather]',chartData)
    return chartData  
  },
  getRadarChartData(){
    const t = this
    const data = [{
      item: 'Aqi',
      user: ' ',
      score: t.data.forecastData.realtime.airQuality.aqi
    }, {
      item: 'NO2',
      score: t.data.forecastData.realtime.airQuality.no2
    },{
      user: ' ',
      item: 'O3',
      score: t.data.forecastData.realtime.airQuality.o3
    }, {
      user: ' ',
      item: 'PM10',
      score: t.data.forecastData.realtime.airQuality.pm10
    }, {
      user: ' ',
      item: 'PM25',
      score: t.data.forecastData.realtime.airQuality.pm25
    }, {
      user: ' ',
      item: 'SO2',
      score: t.data.forecastData.realtime.airQuality.so2
    }, {
      user: ' ',
      item: 'CO',
      score: t.data.forecastData.realtime.airQuality.co
    }];
    return data  
  },
  initRainChart(F2, config) {
    let chartData = this.getHourlyRainChartData()
    // log('[initChartFuc]', chartData)
    rainChart = new F2.Chart(config);
    return rainChart.clear(), 
    rainChart.legend(!1),
    rainChart.source(chartData, {
      time: {
        type: 'timeCat',
        mask: 'MM/DD',
        tickCount: 3,
        range: [ 0, 1 ]
      },
      value: {
        tickCount: 2,
        min: 0,
        alias: '降水强度'
      }
    }),
    rainChart.axis('time', false),
    rainChart.tooltip({
      showItemMarker: false,
      alwaysShow: false,
      triggerOn: ['touchstart', 'touchmove'],
      triggerOff: 'touchend',
      background: {
        radius: 2,
        fill: '#4AA2FC',
        padding: [3, 5]
      },
      showCrosshairs: true, // 是否显示辅助线，点图、路径图、线图、面积图默认展示
      crosshairsStyle: {
        stroke: 'rgba(71,231,255,1)',
        lineWidth: 1
      },
      tooltipMarkerStyle: {
        fill: '#4AA2FC',
        fillOpacity: 0.2
      },
      onShow: function onShow(ev) {
        const items = ev.items;
        items[0].name = null;
        log(items[0].origin)
        items[0].value = items[0].origin.time
      }
    }),
    rainChart.area()
      .position('time*value')
      .color('l(90) 0:#1890FF 1:#f7f7f7')
      .shape('smooth'),
    rainChart.line()
      .position('time*value')
      .color('l(90) 0:#1890FF 1:#8dd9f7')
      .shape('smooth'),
    rainChart.render(),
    rainChart;
  },
  initRadarChart(F2, config) {
    const t = this
    const data = [{
      item: 'Aqi',
      user: ' ',
      score: t.data.forecastData.realtime.airQuality.aqi
    }, {
      item: 'NO2',
      score: t.data.forecastData.realtime.airQuality.no2
    },{
      user: ' ',
      item: 'O3',
      score: t.data.forecastData.realtime.airQuality.o3
    }, {
      user: ' ',
      item: 'PM10',
      score: t.data.forecastData.realtime.airQuality.pm10
    }, {
      user: ' ',
      item: 'PM25',
      score: t.data.forecastData.realtime.airQuality.pm25
    }, {
      user: ' ',
      item: 'SO2',
      score: t.data.forecastData.realtime.airQuality.so2
    }, {
      user: ' ',
      item: 'CO',
      score: t.data.forecastData.realtime.airQuality.co
    }];
    radarChart = new F2.Chart(config);
    radarChart.legend(false)
    radarChart.coord('polar');
    radarChart.source(data, {
      score: {
        min: 0,
        max: 250,
        nice: false,
        tickCount: 4
      }
    });
    radarChart.axis('score', {
      label: function label(text, index, total) {
        if (index === total - 1) {
          return null;
        }
        return {
          top: true
        };
      },
      grid: {
        lineDash: null,
        type: 'arc' // 弧线网格
      }
    });
    radarChart.axis('item', {
      grid: {
        lineDash: null
      }
    });
    radarChart.area().position('item*score').color('user')
    .animate({
      appear: {
        animation: 'groupWaveIn'
      }
    });
    radarChart.line().position('item*score').color('user')
      .animate({
        appear: {
          animation: 'groupWaveIn'
        }
      });
    radarChart.point().position('item*score').color('user')
      .style({
        stroke: '#fff',
        lineWidth: 1
      })
      .animate({
        appear: {
          delay: 300
        }
      });
  
    radarChart.render();
    
    return radarChart
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
        let copyrightlink = 'https://bing.ioslide.com' + t.data.bingImageLists[bingIndex].copyrightlink
        let bingImage = 'https://cn.bing.com' + t.data.bingImageLists[bingIndex].url
        t.setData({
          copyrightlink:copyrightlink,
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
  setTemperatureImage(e){
    this.setData({
      temperatureImage:e.detail.temperatureImage,
      temperatureImageWidth:e.detail.width
    })
  },
  changeAirQuatityView(){
    const t = this
    if(t.data.showAirQuatityRadar == true){
      this.animate('#airQuatityRadar', [
        { opacity: 1.0, ease:'ease-in' },
        { opacity: 0.0, ease:'ease-out' },
        ], 280, function () {
          this.animate('#airQuatityItem', [
            { opacity: 0, ease:'ease-in' },
            { opacity: 1, ease:'ease-out' },
            ], 280)
      }.bind(this))  
    }else{
      this.animate('#airQuatityItem', [
        { opacity: 1.0, ease:'ease-in' },
        { opacity: 0.0, ease:'ease-out' },
        ], 280, function () {
          this.animate('#airQuatityRadar', [
            { opacity: 0, ease:'ease-in' },
            { opacity: 1, ease:'ease-out' },
            ], 280)
      }.bind(this))  
    }
    t.setData({
      showAirQuatityRadar:!t.data.showAirQuatityRadar
    })
  },
  get500pxImage(count,keyword){
      return wx.request({
        url: 'https://500px.com.cn/community/searchv2?client_type=1&imgSize=p2%2Cp4&key='+ keyword +'&searchType=photo&page=1&size='+ count +'&type=json&avatarSize=a1&resourceType=0%2C2',
        fail: (res) => {
          log(res)
        },
        header: {
          "content-type": "application/json"
        },
        method: 'GET',
        success: (result) => {
          let resultData = result.data.data[count-1]
          log('[get500pxImage]',resultData)
          return resultData
        }
      })
  },
  changeRainChartData(){
    const t = this
    t.setData({
      isHourlyRainChart:!t.data.isHourlyRainChart
    })
    if(t.data.isHourlyRainChart == true){
      t.setData({
        rainChartName:t.store.data.languageValue == 'zh_TW' ? '小時':t.store.data.languageValue == 'zh_CN'? '小时':'Hourly'
      })
      let rainChartData= t.getHourlyRainChartData()
      rainChart.changeData(rainChartData)
    }else{
      t.setData({
        rainChartName:t.store.data.languageValue == 'zh_TW' ? '天':t.store.data.languageValue == 'zh_CN'? '天':'Daily'
      })
      let rainChartData= t.getDailyRainChartData()
      rainChart.changeData(rainChartData)
    }
  },
  getDailyRainChartData(){
    const t = this
    var chartData = []
    let daily = t.data.forecastData.daily
    for (let s = daily, d = 0; d < 16; d++) {
      let u = {
        time: s[d].precipitation.date,
        value: s[d].precipitation.max,
      };
      chartData.push(u);
    }
    return chartData
  },
  loadingProgress(canLoading){
    const t = this
    log('[loading]',canLoading)
    const loadingComponent = t.selectComponent('#loading');
    if(canLoading == true){
      loadingComponent.startLoading();
    }else{
      loadingComponent.stopLoading();
    }
  }
});