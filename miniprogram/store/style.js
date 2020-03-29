let style = {}
const setStoreage = () =>{
  style = {
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
  }
  wx.setStorage({
    data: style,
    key: 'style'
  })
}
const getStoreage = () =>{
  style= wx.getStorageSync('style')
}
let c = wx.getStorageSync('hasUserLocation') || false
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
    style: style
  },
  updateAll: true,
  debug: true
}