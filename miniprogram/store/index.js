
let $$ = {}
let c = wx.getStorageSync('hasUserLocation') || false

const setStoreage = () =>{
  $$ = {
    id: '',
    data: {},
    // page: 'pages/index/index',
    language: {
      switch_languageChecked_ChineseTraditional: false,
      switch_languageChecked_Japan: false,
      switch_languageChecked_Chinese: true,
      switch_languageChecked_English: false
    },
    languageValue: '中文简体',
    refreshfrequency: {
      switch_refreshfrequencyChecked_30: true,
      switch_refreshfrequencyChecked_60: false,
      switch_refreshfrequencyChecked_120: false,
      switch_refreshfrequencyChecked_180: false
    },
    refreshfrequencyValue: '30分钟',
    theme: {
      switch_themeChecked_light: true,
      switch_themeChecked_dark: false
    },
    themeValue: '明亮',
    temperatureUnitValue: '摄氏度',
    temperatureUnit: {
      temperatureUnitValueF: false,
      temperatureUnitValueC: true
    },
    distanceUnit:{
      distanceUnitValueM:false,
      distanceUnitValueI:true
    },
    startScreen:'授权',
    style: {
      imageSwitchChange: true,
      weatherAniSwitchChange: true,
      detailSwitchChange: true,
      dailyhourSwitchChange: true,
      dailySevenSwitchChange: true,
      aqiSwitchChange: true,
      sunlightSwitchChange: true,
      moonSwitchChange: true,
      windSwitchChange: true,
      radarSwitchChange: true,
      KeepScreenOnSwitchChange: true
    },
    proMode: false,
    indexHeadImage:"Bing"
  }
  wx.setStorage({
    data: $$,
    key: '$$'
  })
}
const getStoreage = () =>{
  $$ = wx.getStorageSync('$$')
}
const event = (result) => {
  switch (true) {
    case (result == true):
      getStoreage(result)
      break
    case (result == false):
      setStoreage(result)
      break
    default:
      setStoreage(result)
  }
}
event(c)

export default {
  data: {
    startScreen: $$.startScreen,
    style: $$.style,
    indexHeadImage:$$.indexHeadImage,
    themeValue: $$.themeValue,
    theme: $$.theme,
    temperatureUnit: $$.temperatureUnit,
    distanceUnit:$$.distanceUnit
  },
  updateAll: true,
  debug: true
}