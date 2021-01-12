const app = getApp()
const log = console.log.bind(console)
const error = console.error.bind(console)
const warn = console.warn.bind(console)
const util = require('../../utils/util.js')
const scui = require('../../weatherui/sc-ui');
const dayjs = require('../../weatherui/assets/lib/day/day.js')
import _ from '../../utils/lodash.min.js';
import create from '../../utils/create'
import store from '../../store/index'
create(store, {
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    datePicker: {},
    timePicker: {},
    haveUnionid: '',
    use: [
      'style',
      'themeValue',
      'languageValue',
      'subscribeType'
    ]
  },
  onLoad(){
    const t = this
    let haveUnionid = wx.getStorageSync('haveUnionid')
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                t.setData({
                  haveUnionid : true
                }),
                t.getContext()
              }
            });
          }else{
            t.setData({
              haveUnionid : false
            })
          }
        }
      })
  },
  onHide(){
    const t = this
    t.changeSubscribeType()
  },
  changeSubscribeType(){
    const t = this
    let subscribeType = {
      oneTime: t.store.data.subscribeType.oneTime,
      longTerm: t.store.data.subscribeType.longTerm,
      warning: t.store.data.subscribeType.warning
    }
    app.changeStorage('subscribeType', subscribeType)
  },
  onReady() {
    const t = this
    t.data.datePicker = scui.DatePicker("#datepicker")
    t.data.timePicker = scui.TimePicker("#timepicker")
  },
  backPage: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  bindGetUserInfo (e) {
    console.log(e)
    const t = this
    if(e.detail.errMsg == "getUserInfo:fail auth deny"){
      wx.showToast({
        title: '请完成授权',
      })
    }else if(e.detail.errMsg == "getUserInfo:ok"){
      t.setData({
        haveUnionid : true
      }),
      t.getContext()
    }
  },
  getContext(){
    const t = this
    wx.cloud.callFunction({
      name: "openapi",
      data: {
        action: 'getContext',
      },
    }).then(function (res) {
      log('[wxContext]',res.result)
      app.globalData.openid = res.result.openid
      app.globalData.unionid  = res.result.unionid
      wx.setStorage({
        data: res.result,
        key: 'wxContext',
      })
      wx.setStorage({
        data: true,
        key: 'hasWxContext',
      })
      wx.setStorage({
        data: true,
        key: 'haveUserInfo',
      })
      return  res.result
    }).catch(console.error), wx.login({
      success: function (e) {
        // GET https://api.weixin.qq.com/sns/jscode2session?appid=wx7b4bbc2d9c538e84&secret=4ebadf0e08f79dccd6b894ffa8716d49&js_code=001BBC000k8oYK1b6d400cPaTO2BBC0j&grant_type=authorization_code
        console.log("login ", e);
      }
    })
  },
  onShareAppMessage(a) {
    const t = this
    return {
      title: '奇妙天气',
      path: "/pages/index/index",
      imageUrl: "https://weather.ioslide.com/weather/onShareAppMessage.png"
    };
  },
  onShareTimeline: function () {
    return {
      title: '奇妙天气',
      query: {
        key: '奇妙天气'
      },
      imageUrl: "https://weather.ioslide.com/weather/onShareAppMessage.png"
    }
  },
  // changeSbscribeType(){
  //   const t = this

  // },
  switchChange(e) {
    const t = this

    log(e, e.currentTarget.dataset.cur)
    let target = e.currentTarget.dataset.cur
    t.store.data.subscribeType[target] = !t.store.data.subscribeType[target]
    // let subscribeType = {
    //   oneTime: t.store.data.subscribeType.oneTime,
    //   longTerm: t.store.data.subscribeType.longTerm,
    //   warning: t.store.data.subscribeType.warning
    // }
    // app.changeStorage('subscribeType', subscribeType)
    if (e.currentTarget.dataset.cur == 'longTerm' && t.store.data.subscribeType.longTerm == true) {
      this.data.timePicker.open();
    } else if (e.currentTarget.dataset.cur == 'longTerm' && t.store.data.subscribeType.longTerm == false) {
      t.unSubscribeLongTermDailyWeather()
    } else if (e.currentTarget.dataset.cur == 'oneTime' && t.store.data.subscribeType.oneTime == true) {
      this.data.datePicker.open();
    } else if (e.currentTarget.dataset.cur == 'oneTime' && t.store.data.subscribeType.oneTime == false) {
      t.unSubscribeOneTimeDailyWeather()
    } else if (e.currentTarget.dataset.cur == 'warning' && t.store.data.subscribeType.warning == true) {
      t.subscribeWarning()
    }else if (e.currentTarget.dataset.cur == 'warning' && t.store.data.subscribeType.warning == false) {
      t.unSubscribeWarning()
    }
  },
  timePickerOpen(e) {
    log('timePickerOpen', e)
  },
  timePickerClose(e) {
    log('timePickerClose', e)
  },
  timePickerOpened(e) {
    log('timePickerOpened', e)
  },
  timePickerClosed(e) {
    log('timePickerClosed', e)
  },
  timePickerCancel(e) {
    const t = this
    t.store.data.subscribeType.longTerm = !t.store.data.subscribeType.longTerm
    log('timePickerCancel', e)
  },
  timePickerSubmit(e) {
    log(e);
    const t = this
    var
      pages = getCurrentPages(),
      prevPage = pages[0];
    let pickTime = dayjs(e.detail.value.toString()).hour().toString() + dayjs(e.detail.value.toString()).minute().toString()
    log(pickTime)
    const templateId = 'oOTpsU26qGPpShCbFypuJj6eLlpDm_Yba9Jz500G4dk'
    const subDailyWeatherCloudFn = () => {
      let longtermData = {
        action: 'subscribeLongtermDailyWeather',
        unit: t.store.data.unitValue,
        language: t.store.data.languageValue,
        city: prevPage.data.forecastData.city,
        startTime: pickTime,
        latitude: prevPage.data.latitude,
        longitude: prevPage.data.longitude,
        templateId: templateId,
        done: false,
        openid:app.globalData.openid,
        unionid:app.globalData.unionid
      }
      wx.cloud.callFunction({
        name: 'openapi',
        data: longtermData,
        success: res => {
          wx.hideLoading({
            success: () => {
              wx.showToast({
                title: t.store.data.languageValue == 'zh_TW' ? '訂閱成功' : t.store.data.languageValue == 'zh_CN' ? '订阅成功' : t.store.data.languageValue == 'ja' ? '正常にサブスクライブしました' : 'Successfully subscribed',
                icon: 'success',
                duration: 1000,
                mask: true
              });
            }
          });
          t.store.data.subscribeType.longTerm = true
          t.changeSubscribeType()
        },
        fail: err => {
          wx.hideLoading({
            success: () => {
              wx.showToast({
                title: t.store.data.languageValue == 'zh_TW' ? '訂閱失敗' : t.store.data.languageValue == 'zh_CN' ? '订阅失败' : t.store.data.languageValue == 'ja' ? 'サブスクリプションに失敗しました' : 'Subscription failed',
                icon: 'success',
                duration: 1000,
                mask: true
              });
            }
          });
          t.store.data.subscribeType.longTerm = false
          t.changeSubscribeType()
        }
      })
    }
    subDailyWeatherCloudFn()
  },
  
  unSubscribeLongTermDailyWeather() {
    const t = this
    let longTermData = {
      action: 'unSubscribeLongTermDailyWeather',
      openid:app.globalData.openid,
      unionid:app.globalData.unionid,
      templateId: 'oOTpsU26qGPpShCbFypuJj6eLlpDm_Yba9Jz500G4dk'
    }
    wx.cloud.callFunction({
      name: 'openapi',
      data: longTermData,
      success: res => {
        wx.hideLoading({
          success: () => {
            wx.showToast({
              title: t.store.data.languageValue == 'zh_TW' ? '取消訂閱成功' : t.store.data.languageValue == 'zh_CN' ? '取消订阅成功' : t.store.data.languageValue == 'ja' ? '正常に登録解除' : 'Unsubscribe successfully',
              icon: 'success',
              duration: 1000,
              mask: true
            });
          }
        });
        t.store.data.subscribeType.longTerm = false
        t.changeSubscribeType()
        log(`[unSubscribeLongTermDailyWeather] => Success => ${res}`)
      },
      fail: err => {
        wx.hideLoading({
          success: () => {
            wx.showToast({
              title: t.store.data.languageValue == 'zh_TW' ? '取消訂閱失敗' : t.store.data.languageValue == 'zh_CN' ? '取消订阅失败' : t.store.data.languageValue == 'ja' ? '登録解除に失敗しました' : 'Failed to unsubscribe',
              icon: 'success',
              duration: 1000,
              mask: true
            });
          }
        });
        t.store.data.subscribeType.longTerm = true
        t.changeSubscribeType()
        log(`[unSubscribeLongTermDailyWeather] => Fail => ${err}`)
      }
    })
  },
  datePickerSubmit(e) {
    const t = this
    var
      pages = getCurrentPages(),
      prevPage = pages[0];
    let submitValue = e.detail.value
    let time = util.formatDate(submitValue)
    let date = util.getDates(7, time)
    let startTime = date[0].time
    log('nowTime,startTime,submitValue', startTime, dayjs().isAfter(dayjs(startTime)))

    if (dayjs().isAfter(dayjs(startTime)) == true) {
      t.store.data.subscribeType.oneTime = false
      wx.showToast({
        title: t.store.data.languageValue == 'zh_TW' ? '不能選擇過去時間,請重新選擇' : t.store.data.languageValue == 'zh_CN' ? '不能选择过去时间,请重新选择' : t.store.data.languageValue == 'ja' ? '「過去の時間を選択できません。もう一度選択してください」' : 'Cannot select the past time, please select again',
        duration: 1500,
        icon: 'none',
        mask: true,
      })
      return
    }
    let templateId = '4qBy3Pm6pqvOCP_RgX8MOhxYMwO36_YyxCkduHnsAbg'
    const subDailyWeatherCloudFn = () => {
      let onetimeData = {
        action: 'subscribeOnetimeDailyWeather',
        page: 'pages/index/index',
        unit: t.store.data.unitValue,
        language: t.store.data.languageValue,
        city: prevPage.data.forecastData.city,
        startTime: startTime,
        latitude: prevPage.data.latitude,
        longitude: prevPage.data.longitude,
        templateId: templateId,
        done: false,
        openid:app.globalData.openid,
        unionid:app.globalData.unionid
      }
      prevPage.data.subData = onetimeData
      log('[onetimeData]', onetimeData)
      wx.cloud.callFunction({
        name: 'openapi',
        data: onetimeData,
        success: res => {
          wx.hideLoading({
            success: () => {
              wx.showToast({
                title: t.store.data.languageValue == 'zh_TW' ? '訂閱成功' : t.store.data.languageValue == 'zh_CN' ? '订阅成功' : t.store.data.languageValue == 'ja' ? '正常にサブスクライブしました' : 'Successfully subscribed',
                icon: 'success',
                duration: 1000,
                mask: true
              });
            }
          });
          t.store.data.subscribeType.oneTime = true
          t.changeSubscribeType()
          log(`[subDailyWeatherCloudFn] => OK =>`, res)
        },
        fail: err => {
          wx.hideLoading({
            success: () => {
              wx.showToast({
                title: t.store.data.languageValue == 'zh_TW' ? '訂閱失敗' : t.store.data.languageValue == 'zh_CN' ? '订阅失败' : t.store.data.languageValue == 'ja' ? 'サブスクリプションに失敗しました' : 'Subscription failed',
                icon: 'success',
                duration: 1000,
                mask: true
              });
            }
          });
          t.store.data.subscribeType.oneTime = false
          t.changeSubscribeType()
          log(`[subDailyWeatherCloudFn] => Fail => `, err)
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
            t.unSubscribeOneTimeDailyWeather()
          }
        }
      },
      fail: result => {
        wx.hideLoading({
          success: () => {
            wx.showToast({
              title: '订阅失败，微信版本过低',
              duration: 1500,
              icon: 'none',
              mask: true,
            })
          }
        });
        t.store.data.subscribeType.oneTime = false
        t.changeSubscribeType()
        log(result)
      }
    });
  },
  unSubscribeOneTimeDailyWeather() {
    const t = this
    const templateId = '4qBy3Pm6pqvOCP_RgX8MOhxYMwO36_YyxCkduHnsAbg'
    let onetimeData = {
      action: 'unSubscribeOneTimeDailyWeather',
      templateId: templateId,
      done:false,
      openid:app.globalData.openid,
      unionid:app.globalData.unionid
    }
    wx.cloud.callFunction({
      name: 'openapi',
      data: onetimeData,
      success: res => {
        wx.hideLoading({
          success: () => {
            wx.showToast({
              title: t.store.data.languageValue == 'zh_TW' ? '取消訂閱成功' : t.store.data.languageValue == 'zh_CN' ? '取消订阅成功' : t.store.data.languageValue == 'ja' ? '正常に登録解除' : 'Unsubscribe successfully',
              icon: 'success',
              duration: 1000,
              mask: true
            });
          }
        });
        t.store.data.subscribeType.oneTime = false
        t.changeSubscribeType()
        log(`[unSubscribeOneTimeDailyWeather] => Success => ${res}`)
      },
      fail: err => {
        wx.hideLoading({
          success: () => {
            wx.showToast({
              title: t.store.data.languageValue == 'zh_TW' ? '取消訂閱失敗' : t.store.data.languageValue == 'zh_CN' ? '取消订阅失败' : t.store.data.languageValue == 'ja' ? '登録解除に失敗しました' : 'Failed to unsubscribe',
              icon: 'success',
              duration: 1000,
              mask: true
            });
          }
        });
        t.store.data.subscribeType.oneTime = true
        t.changeSubscribeType()
        log(`[unSubscribeOneTimeDailyWeather] => Fail => ${err}`)
      }
    })
  },
  subscribeWarning(){
    const t = this
    var
    pages = getCurrentPages(),
    prevPage = pages[0];
    let templateId = 'rKArzpKfNo9HrTqsaOKnsV77gpTrkJaciWdmQnOidqs'
    const subDailyWeatherCloudFn = () => {
      let subData = {
        action: 'subscribeWarning',
        unit: t.store.data.unitValue,
        language: t.store.data.languageValue,
        latitude: prevPage.data.latitude,
        longitude: prevPage.data.longitude,
        done:false,
        templateId: templateId,
        openid:app.globalData.openid,
        unionid:app.globalData.unionid
      }
      wx.cloud.callFunction({
        name: 'openapi',
        data: subData,
        success: res => {
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: t.store.data.languageValue == 'zh_TW' ? '訂閱成功' : t.store.data.languageValue == 'zh_CN' ? '订阅成功' : t.store.data.languageValue == 'ja' ? '正常にサブスクライブしました' : 'Successfully subscribed',
                icon: 'success',
                duration: 1000,
                mask: true
              });
            },
          })
          t.store.data.subscribeType.warning = true
          t.changeSubscribeType()
        },
        fail: err => {
          wx.hideLoading({
            success: () => {
              wx.showToast({
                title: t.store.data.languageValue == 'zh_TW' ? '訂閱失敗' : t.store.data.languageValue == 'zh_CN' ? '订阅失败' : t.store.data.languageValue == 'ja' ? 'サブスクリプションに失敗しました' : 'Subscription failed',
                icon: 'success',
                duration: 1000,
                mask: true
              });
            }
          });
          t.store.data.subscribeType.warning = false
          t.changeSubscribeType()
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
            t.store.data.subscribeType.warning = false
          }
        }
      },
      fail: result => {
        t.store.data.subscribeType.warning = false
        wx.showToast({
          title: '订阅失败，微信版本过低',
          duration: 1500,
          icon: 'none',
          mask: true,
        })
        t.changeSubscribeType()
        log(result)
      }
    });
  },
  unSubscribeWarning() {
    const t = this
    let templateId = 'rKArzpKfNo9HrTqsaOKnsV77gpTrkJaciWdmQnOidqs'
    let longTermData = {
      action: 'unSubscribeWarning',
      openid:app.globalData.openid,
      unionid:app.globalData.unionid,
      templateId: templateId
    }
    wx.cloud.callFunction({
      name: 'openapi',
      data: longTermData,
      success: res => {
        wx.hideLoading({
          success: () => {
            wx.showToast({
              title: t.store.data.languageValue == 'zh_TW' ? '取消訂閱成功' : t.store.data.languageValue == 'zh_CN' ? '取消订阅成功' : t.store.data.languageValue == 'ja' ? '正常に登録解除' : 'Unsubscribe successfully',
              icon: 'success',
              duration: 1000,
              mask: true
            });
          }
        });
        t.store.data.subscribeType.warning = false
        t.changeSubscribeType()
        log(`[unSubscribeWarning] => Success => ${res}`)
      },
      fail: err => {
        wx.hideLoading({
          success: () => {
            wx.showToast({
              title: t.store.data.languageValue == 'zh_TW' ? '取消訂閱失敗' : t.store.data.languageValue == 'zh_CN' ? '取消订阅失败' : t.store.data.languageValue == 'ja' ? '登録解除に失敗しました' : 'Failed to unsubscribe',
              icon: 'success',
              duration: 1000,
              mask: true
            });
          }
        });
        t.store.data.subscribeType.warning = true
        t.changeSubscribeType()
        log(`[unSubscribeWarning] => Fail => ${err}`)
      }
    })
  },
  datePickerOpen(e) {
    log('datePickerOpen', e)
  },
  datePickerClose(e) {
    log('datePickerClose', e)
  },
  datePickerOpened(e) {
    log('datePickerOpened', e)
  },
  datePickerClosed(e) {
    log('datePickerClosed', e)
  },
  datePickerCancel(e) {
    const t = this
    t.store.data.subscribeType.oneTime = !t.store.data.subscribeType.oneTime
    log('datePickerCancel', e)
  },
})