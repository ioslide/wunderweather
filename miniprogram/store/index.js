
let $$ = {}
let hasUserLocation = wx.getStorageSync('hasUserLocation') || false
const setStoreage = () =>{
  $$ = {
    latitude:31.467735,
    longitude:104.679276,
    getLocationMethod:'auto',
    subscribeType:{
      oneTime :false,
      longTerm:false,
      warning:false
    },
    language: {
      languageChecked_zh_CN: true,
      languageChecked_zh_TW: false,
      languageChecked_en_US: false,
      languageChecked_en_GB: false,
      languageChecked_ja: false
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
    warningValue:false,
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
      KeepScreenOnSwitchChange: true,
      WAI:false
    },
    proMode: false,
    indexHeadImage:{
      indexHeadImageBing:true,
      indexHeadImageNASA:false,
      indexHeadImageWeather:false,
      indexHeadImageCustomize:false
    },
    indexHeadImageValue:'Bing',
    iconValue : 'flatIcon',
    icon:{
      lineIcon:false,
      colorIcon:false,
      solidIcon:false,
      flatIcon:true
    }
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
    latitude:$$.latitude,
    longitude:$$.longitude,
    getLocationMethod:$$.getLocationMethod,
    startScreen: $$.startScreen,
    style: $$.style,
    proMode:$$.proMode,
    indexHeadImage:$$.indexHeadImage,
    indexHeadImageValue:$$.indexHeadImageValue,
    refreshfrequency:$$.refreshfrequency,
    refreshfrequencyValue:$$.refreshfrequencyValue,
    theme: $$.theme,
    themeValue:  $$.theme.themeChecked_auto == true && wx.getSystemInfoSync().theme == 'light' || $$.theme.themeChecked_light == true ? 'light' : 'dark',
    language:$$.language,
    languageValue:$$.languageValue,
    temperatureUnit: $$.temperatureUnit,
    temperatureUnitValue: $$.temperatureUnitValue,
    unit:$$.unit,
    warningValue:$$.warningValue,
    iconValue:$$.iconValue,
    icon:$$.icon,
    unitValue:$$.unitValue,
    subscribeType:$$.subscribeType
  },
  updateAll: true,
  debug: true
}