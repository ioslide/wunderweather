
let $$ = {}
let hasUserLocation = wx.getStorageSync('hasUserLocation') || false
const setStoreage = () =>{
  $$ = {
    getLocationMethod:'auto',
    language: {
      languageChecked_zh_TW: false,
      languageChecked_zh_CN: true,
      languageChecked_en_US: false,
      languageChecked_en_GB: false
    },
    languageValue: 'zh_CN',
    refreshfrequency: {
      refreshfrequencyChecked_1: false,
      refreshfrequencyChecked_5: false,
      refreshfrequencyChecked_10: false,
      refreshfrequencyChecked_30: true,
      refreshfrequencyChecked_60: false
    },
    refreshfrequencyValue: '30',
    theme: {
      themeChecked_auto: false,
      themeChecked_light: true,
      themeChecked_dark: false
    },
    themeValue: 'light',
    unit:{
      metric:true,
      SI:false,
      imperial:false
    },
    unitValue:'metric',
    startScreen: 'auth',
    style: {
      imageSwitchChange: true,
      weatherAniSwitchChange: true,
      detailSwitchChange: true,
      hourlySwitchChange: true,
      dailySwitchChange: true,
      rainSwitchChange: true,
      aqiSwitchChange: true,
      sunlightSwitchChange: true,
      moonSwitchChange: true,
      windSwitchChange: true,
      radarSwitchChange: true,
      KeepScreenOnSwitchChange: true
    },
    proMode: false,
    indexHeadImage:{
      indexHeadImageBing:true,
      indexHeadImageNASA:false,
      indexHeadImageWeather:false,
      indexHeadImageCus:false
    },
    indexHeadImageValue:'Bing',
    iconValue : 'flatIcon',
    icon:{
      lineIcon:false,
      colorIcon:false,
      solidIcon:false,
      flatIcon:true
    },
    getWeatherDataAgain : false
  }
  wx.setStorage({
    data: $$,
    key: '$$'
  })
}
const getStoreage = () =>{
  $$ = wx.getStorageSync('$$')
}
const hasUserLocationEvent = (result) => {
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
hasUserLocationEvent(hasUserLocation)

export default {
  data: {
    getLocationMethod:$$.getLocationMethod,
    startScreen: $$.startScreen,
    style: $$.style,
    proMode:$$.proMode,
    indexHeadImage:$$.indexHeadImage,
    indexHeadImageValue:$$.indexHeadImageValue,
    refreshfrequency:$$.refreshfrequency,
    refreshfrequencyValue:$$.refreshfrequencyValue,
    theme: $$.theme,
    themeValue: $$.themeValue,
    language:$$.language,
    languageValue:$$.languageValue,
    temperatureUnit: $$.temperatureUnit,
    temperatureUnitValue: $$.temperatureUnitValue,
    unit:$$.unit,
    iconValue:$$.iconValue,
    icon:$$.icon,
    unitValue:$$.unitValue,
  },
  updateAll: true,
  debug: true
}