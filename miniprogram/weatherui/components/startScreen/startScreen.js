const log = console.log.bind(console)
const app = getApp()
const globalData = getApp().globalData
const config = require('../../../weatherui/config/config.js').default
const poetry = require('../../../utils/poetry.js')
import create from '../../../utils/create'
import store from '../../../store/index'

create.Component(store,{
  properties: {

  },
  data: {
    isManualGetNewLocation:false,
    StatusBar: globalData.StatusBar,
    CustomBar: globalData.CustomBar,
    Custom: globalData.Custom,
    windowWidth: globalData.windowWidth,
    windowHeight: globalData.windowHeight,
    qrImageURL:globalData.qrImageURL,
    hourlyKeypoint:"",
    use: [
      'themeValue',
      'startScreen',
      'languageValue'
    ]
  },
  lifetimes: {
    attached: function () {
      const t = this
      let e = t.properties
      t.setData({
        StatusBar: globalData.StatusBar,
        CustomBar: globalData.CustomBar,
        Custom: globalData.Custom,
        windowWidth: globalData.windowWidth,
        windowHeight: globalData.windowHeight,
        qrImageURL: globalData.qrImageURL
      })
      t.screenFadeIn()
    },
    moved: function () { },
    detached: function () { },
  },
  pageLifetimes: {
    show: function () { 
      log(this.data)
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 1];
      let data = prevPage.data
      this.setData({
        hourlyKeypoint: data.forecastData.hourlyKeypoint
      })
    },
    hide: function () { },
    resize: function () { },
  },
  data: {

  },
  methods: {
    screenFadeIn() {
      const t = this
      var windowWidth = t.data.windowWidth
      log('[screenFadeIn]', t.store.data.startScreen)
      const poetryScreenFadeIn = () => {
        wx.loadFontFace({
          family: 'wencangshufang',
          source: 'url("https://weather.ioslide.com/weather/font/wencangshufang/WenCangShuFang-2.ttf")',
          success: res => {
            log('[loadFontFace]', res)
          },
          complete: res =>{
            log('[poetryScreenFadeIn]')
            let poetry_storage = wx.getStorageSync('poetry_storage') || [{
              content: '春眠不觉晓'
            }]
            let poetryTextAction = wx.createAnimation({
              duration: 1300,
              timingFunction: 'ease-in-out',
              delay: 0,
            });
            poetryTextAction.opacity(1).step()
            t.setData({
              poetry: poetry_storage[0].content,
              guideScreenTextAni: poetryTextAction.export()
            })
          }
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
          delay: 200,
        });
        poetryScreenAction.opacity(0).step()
        t.setData({
            defaultScreenAni: poetryScreenAction.export()
          }),
          setTimeout(() => {
            t.setData({
              authScreen: true
            })
          }, 2200)
      }
      const defaultScreenFadeOut = () => {
        let defaultScreenAction = wx.createAnimation({
          duration: 1600,
          timingFunction: 'ease-in-out',
          delay: 200,
        });
        defaultScreenAction.opacity(0).step()
        t.setData({
            defaultScreenAni: defaultScreenAction.export(),
          }),
          setTimeout(() => {
            t.setData({
              authScreen: true
            })
          }, 2200)
      }
      const authScreenFadeOut = () => {
        let authScreenAction = wx.createAnimation({
          duration: 1600,
          timingFunction: 'ease-in-out',
          delay: 100,
        });
        authScreenAction.translate3d(-t.data.windowWidth * 3, 0, 0).opacity(0).step()
        t.setData({
          defaultScreenAni: authScreenAction.export(),
        }),
        setTimeout(() => {
          t.setData({
            authScreen: true
          })
        }, 2200)
      }
      const screenFadeOut = (screenFadeOutType) => {
          screenFadeOutType == 'poetry' ? poetryScreenFadeOut() : screenFadeOutType == 'auth' ? (authScreenFadeOut(), setTimeout(() => {
            t.store.data.startScreen = 'poetry'
          }, 2500)) : screenFadeOutType == 'default' ? defaultScreenFadeOut() : warn('[startScreen]')
      }
      (async () => {
        await screenFadeOut(t.store.data.startScreen)
        await t.triggerEvent('onIntersectionObserver')
        await t.getPoetry()
        await t.triggerEvent('setRefreshWeatherInterval')
      })()
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
        let eventDetail = {
          canRefreshChart: false
        }
        await wx.showLoading({
          title: t.store.data.languageValue == 'zh_TW' ? '加载中':t.store.data.languageValue == 'zh_CN'? '加载中':t.store.data.languageValue == 'ja'? '読み込み中':'Loading'
        })
        await t.triggerEvent('_getWeatherData',eventDetail)
        await authFinalStepLeaf()
        // await t.screenFadeOut()
        await wx.hideLoading({
          complete: (res) => {},
        })
      })()
  },
  _showDrawerModal(e){
    log('[_showDrawerModal]',e.currentTarget.dataset.target)
    let eventDetail = {
      drawerModalName: e.currentTarget.dataset.target
    }
    this.triggerEvent('_showDrawerModal',eventDetail)
  },
  authScreenNext(e) {
    log('[authScreenNext]', e)
    const t = this
    let windowWidth = t.data.windowWidth
    let windowHeight = t.data.windowHeight
    const authFirstStepLeaf = () =>{
      wx.createSelectorQuery().in(this).select('#authScreenStepContent').boundingClientRect(function(rect){
        log('rect',rect)
        t.animate('#leaf', [
          { translate3d: [0,0,0], rotate3d: [0,0,1,45],scale:[1],ease:'ease-in-out' },
          { translate3d: [windowWidth,-rect.top,0],rotate3d: [0,10,-1,45],scale:[0.3],ease:'ease-in-out'  },
        ], 1000)
      }).exec()
    }
    const authSecondStepLeaf = () =>{
      wx.createSelectorQuery().in(this).select('#authScreenStepContent').boundingClientRect(function(rect){
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
        duration: 1100,
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
        duration: 1100,
        timingFunction: 'ease-in-out',
        delay: 0
      });
      authFirstStep.translate3d(-steps, 0, 0).step()
      t.setData({
        defaultScreenAni: authFirstStep.export(),
      })
    }
    e.currentTarget.dataset.target == 'authFirstStep' ? (transX(t.data.windowWidth), log('[backAuthFirstStep]')) : 
    e.currentTarget.dataset.target == 'authSecondStep' ? (transX(t.data.windowWidth), log('[backAuthSecondStep]')) : 
    e.currentTarget.dataset.target == 'authThirdStep' ? (transX(t.data.windowWidth * 2), log('[backAuthThirdStep]')) : 
    e.currentTarget.dataset.target == 'authFourthStep' ? (transX(t.data.windowWidth * 2), log('[backAuthFourthStep]')) : warn('[backStep]')
  },
  getPoetry() {
    log('getPoetry')
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
    e.currentTarget.dataset.target == 'getNewLocationByManual' ? t.triggerEvent('getNewLocationByManual') : 
    e.currentTarget.dataset.target == 'getLocationByAuto' ? t.triggerEvent('getLocationByAuto'): error("switchChange")
  }
  }
})
