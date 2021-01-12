const app = getApp();
const log = console.log.bind(console)
import create from '../../../utils/create'
import store from '../../../store/index'
const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
const util = require('../../../utils/util.js')
create(store, {
  data: {
    hasFabulous:false,
    dialogList: [],
    priceLists:[0.01,1,5,6.66,8.88,10,18.88,16.66,28.88,50,66,88,188,288,520,666,888],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    windowHeight: app.globalData.windowHeight,
    windowWidth: app.globalData.windowWidth,
    loadding: false,
    show: false,
    inputText:'',
    bottom: 0,
    inputing: false,
    focus: !0,
    price:8.88,
    hasUserInfo: false,
    msgLists:[],
    avatar: "https://weather.ioslide.com/aichat/home.png",
    currentTranslate: {
      create: '04/27 15:37',
      text: '等待说话',
    },
    recording: false,  // 正在录音
    recordStatus: 0,   // 状态： 0 - 录音中 1- 翻译中 2 - 翻译完成/二次翻译
    lastId: -1,    // dialogList 最后一个item的 id
    currentTranslateVoice: '', // 当前播放语音路径
    bottomButtonDisabled: false, // 底部按钮disabled
    use:[
      'themeValue',
      'languageValue'
    ]
  },
  onLoad: function (options) {
    const t = this
    t.initRecord()
    app.getRecordAuth()
    wx.onKeyboardHeightChange(res => {
      t.setData({
        bottom: res.height
      })
    })
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          if (app.globalData.userInfo) { 
            t.setData({ 
              userInfo: app.globalData.userInfo, 
              hasUserInfo: true 
            }) 
          } else { 
            wx.getUserInfo({ 
              success: res => { 
                app.globalData.userInfo = res.userInfo 
                t.setData({ 
                  userInfo: res.userInfo, 
                  hasUserInfo: true 
                }) 
              }
      
            }) 
          }
        }else{
          t.setData({ 
            hasUserInfo: false 
          }) 
        }
      }
    })
  },
  onHide: function() {
    this.setHistory()
  },
  onPageScroll(e) {
    if (e.scrollTop == 0 && !this.data.loadding) {
      this.setData({
        loadding: true
      }, () => {
        setTimeout(() => {
          this.setData({
            // show: true,
            loadding: false
          })
        }, 1000)
      })
    }
  },
  onReady: function () {

  },
  onShow: function () {
    const t = this
    t.getSponsorshipMsg()

    if(t.data.recordStatus == 2) {
      wx.showLoading({
        // title: '',
        mask: true,
      })
    }
  },
  updateSponsorshipStar(e){
    log('[getSponsorshipMsg]',e)
    const t = this
    var msgListsData = arrayLookup(t.data.msgLists,'_id',e.currentTarget.dataset.id,'index');
    function arrayLookup(data,key,value,targetKey){
        var targetValue = "";
        var targetIndex = 0
        for (var i = 0; i < data.length; i++) {
            if(data[i][key]==value){
                targetValue = data[i][targetKey];
                targetIndex = i
                break;
            }
        }
        return {targetValue,targetIndex};
    }
    let msgListsIndex = `msgLists[${msgListsData.targetIndex}].index`;
    let msgListsHasFabulous = `msgLists[${msgListsData.targetIndex}].hasFabulous`;

    let hasFabulous = t.data.msgLists[msgListsData.targetIndex].hasFabulous
    log(hasFabulous)
    if(hasFabulous == false){
      t.setData({
        [msgListsIndex] : msgListsData.targetValue + 1,
        [msgListsHasFabulous] : true
      })
      let cloudData = {
        action: 'updateSponsorshipIndex',
        id : e.currentTarget.dataset.id
      }
      wx.cloud.callFunction({
        name: 'onSponsorship',
        data: cloudData,
        success: res => {
  
        },
        fail: err => {
          log(err)
        }
      })
    }
  },
  getSponsorshipMsg(){
    log('[getSponsorshipMsg]')
    const t = this
    let cloudData = {
      action: 'getSponsorshipMsg'
    }
    wx.showLoading({
      // title: '',
      mask: true,
    })
    wx.cloud.callFunction({
      name: 'onSponsorship',
      data: cloudData,
      success: res => {
        log(res)
        for (var i = 0; i < res.result.data.length; i++) {
          let obj = res.result.data
          obj[i]['hasFabulous'] = false
          log(obj)
          t.setData({
            msgLists:obj
          })
      }
        // t.setData({
        //   msgLists:res.result.data
        // })
        wx.hideLoading({
          success: (res) => {},
        })
      },
      fail: err => {
        log(err)
      }
    })
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  BackPage: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  onShareAppMessage(a) {
    const t = this
    return {
      title: '奇妙天气',
      path: "/pages/index/index",
      imageUrl:"https://weather.ioslide.com/weather/onShareAppMessage.png"
    };
  },
  onShareTimeline: function () {
		return {
	      title: '奇妙天气',
	      query: {
	        key: '奇妙天气'
	      },
        imageUrl:"https://weather.ioslide.com/weather/onShareAppMessage.png"
	    }
	},
  bindInput: function(t) {
    this.setData({
        inputText: t.detail.value
    });
},
chooseType: function(t) {
  const e = this
  if(e.data.hasUserInfo === true){
   e.setData({
    inputing:!e.data.inputing
   })
  }else{
    e.setData({
      inputing:false
     })
  }
},
bindgetUserInfo(e){
  const t = this
  if(e.detail.errMsg == "getUserInfo:fail auth deny"){
    log('getUserInfo:fail auth deny',t.data.hasUserInfo)
    t.setData({
      inputing:false,
      hasUserInfo: false
     })
  }
  if(e.detail.errMsg == "getUserInfo:ok"){
    log('getUserInfo:ok',t.data.hasUserInfo)
    if(t.data.hasUserInfo == true) return
    app.globalData.userInfo = e.detail.userInfo
    t.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
},
uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    var r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid
},
bindconfirmInput: function (e) {
  log(e)
  const t = this
  if(t.data.inputText == '请输入' || t.data.inputText == '' || t.data.inputText == null){ 
    wx.showToast({
      title: '请输入',
      image: '../../../weatherui/assets/images/pleaseWrite.svg',
      duration: 1000,
      success: function (res) {
        console.log("提交成功", res.result)
      },
      fail: function (res) {
        console.log(res);
      }
    });
    return 
  }

  let money = t.data.price * 100 
  let inputMoney = money.toFixed()
  wx.cloud.callFunction({
      name: 'pay',
      data: {
        body:"奇妙天气",
        orderid: Math.floor((Math.random() * 1000) + 1) + "1371" + new Date().getTime(),
        money: inputMoney
      },
      success(res) {
        let payment = res.result;
        wx.requestPayment({
          ...payment,
          success: (res) => {
            wx.showToast({
              title: 'Loading',
              icon: 'loading',
              duration: 1000,
              mask:true
            })
            let cloudData = {
              action: 'uploadSponsorshipMsg',
              msg:e.detail.value,
              index:1,
              name:t.data.userInfo.nickName,
              avatar: t.data.userInfo.avatarUrl,
              price:t.data.price,
              time: util.formatDate(new Date())
            }
            wx.cloud.callFunction({
              name: 'onSponsorship',
              data: cloudData,
              success: res => {
                log(res)
                 wx.hideToast()
                 wx.showToast({
                    title: '感谢',
                    icon: 'success',
                    duration: 1000,
                    mask:true
                  })
                  setTimeout(() => {
                    t.getSponsorshipMsg()
                  }, 600);
                  t.setData({
                    inputText: ""
                });
              },
              fail: err => {
                log(err)
              }
            })
          },
          fail: (err) => {
            console.log('支付失败', err);
            wx.showToast({
              title: '支付失败',
              icon: 'success',
              image: '../../../weatherui/assets/images/failMoney.svg',
              duration: 1000,
              success: function (res) {
        
              },
              fail: function (res) {
                console.log(res);
              }
            });
          }
        });
      },
      fail(res) {
        wx.showToast({
          title: '支付失败',
          icon: 'success',
          image: '../../../weatherui/assets/images/failMoney.svg',
          duration: 1000,
          success: function (res) {
    
          },
          fail: function (res) {
            console.log(res);
          }
        });
      }
    })
},
streamRecord: function(e) {
  const t = this
  wx.vibrateShort()
  log('inputVoiceStart')
  let buttonItem = e.detail.buttonItem || {}
  manager.start({
    lang: t.store.data.languageValue,
  })
  t.setData({
    recordStatus: 0,
    recording: true,
    currentTranslate: {
      // 当前语音输入内容
      create: util.recordTime(new Date()),
      text: '正在聆听中',
      lfrom: 'zh_CN',
      lto: 'zh_CN',
    },
  })
},
  /**
   * 松开按钮结束语音识别
   */
streamRecordEnd: function(e) {
  log('inputVoiceEnd')
    console.log("streamRecordEnd" ,e)
    let detail = e.detail || {}  // 自定义组件触发事件时提供的detail对象
    let buttonItem = detail.buttonItem || {}

    // 防止重复触发stop函数
    if(!this.data.recording || this.data.recordStatus != 0) {
      console.warn("has finished!")
      return
    }

    manager.stop()
},
  /**
   * 初始化语音识别回调
   * 绑定语音播放开始事件
   */
  initRecord: function() {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      let currentData = Object.assign({}, this.data.currentTranslate, {
                        text: res.result,
                      })
      this.setData({
        currentTranslate: currentData,
      })
    }

    // 识别结束事件
    manager.onStop = (res) => {
      log(res)
      let text = res.result

      if(text == '') {
        this.showRecordEmptyTip()
        return
      }

      let lastId = this.data.lastId + 1

      let currentData = Object.assign({}, this.data.currentTranslate, {
                        text: res.result,
                        translateText: '正在翻译中',
                        id: lastId,
                        voicePath: res.tempFilePath
                      })

      this.setData({
        currentTranslateVoice:res.tempFilePath,
        currentTranslate: currentData,
        inputText:res.result,
        recordStatus: 1,
        lastId: lastId,
        inputing:true
      })

      this.translateText(currentData, this.data.dialogList.length)
    }

    // 识别错误事件
    manager.onError = (res) => {

      this.setData({
        recording: false,
        bottomButtonDisabled: false,
      })

    }

    // 语音播放开始事件
    wx.onBackgroundAudioPlay(res=>{

      const backgroundAudioManager = wx.getBackgroundAudioManager()
      let src = backgroundAudioManager.src

      this.setData({
        currentTranslateVoice: src
      })

    })
  },
  
  /**
   * 识别内容为空时的反馈
   */
  showRecordEmptyTip: function() {
    this.setData({
      recording: false,
      bottomButtonDisabled: false,
    })
    wx.showToast({
      title: '请说话',
      icon: 'success',
      image: '../../../weatherui/assets/images/pleaseSpeak.svg',
      duration: 1000,
      success: function (res) {

      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  /**
   * 翻译
   */
  translateText: function(item, index) {
    let lfrom =  item.lfrom || 'zh_CN'
    let lto = item.lto || 'en_US'
    const t = this
    plugin.translate({
      lfrom: lfrom,
      lto: lto,
      content: item.text,
      tts: true,
      success: (resTrans)=>{
        log('[resTrans]',resTrans)
        let passRetcode = [
          0, // 翻译合成成功
          -10006, // 翻译成功，合成失败
          -10007, // 翻译成功，传入了不支持的语音合成语言
          -10008, // 翻译成功，语音合成达到频率限制
        ]

        if(passRetcode.indexOf(resTrans.retcode) >= 0 ) {
          let tmpDialogList = t.data.dialogList.slice(0)

          if(!isNaN(index)) {

            let tmpTranslate = Object.assign({}, item, {
              autoPlay: true, // 自动播放背景音乐
              translateText: resTrans.result,
              translateVoicePath: resTrans.filename || "",
              translateVoiceExpiredTime: resTrans.expired_time || 0
            })

            tmpDialogList[index] = tmpTranslate


            t.setData({
              dialogList: tmpDialogList,
              bottomButtonDisabled: false,
              recording: false,
            })

          } else {
            console.error("index error", resTrans, item)
          }
        } else {
          console.warn("翻译失败", resTrans, item)
        }

      },
      fail: function(resTrans) {
        console.error("调用失败",resTrans, item)
        t.setData({
          bottomButtonDisabled: false,
          recording: false,
        })
      },
      complete: resTrans => {
        t.setData({
          recordStatus: 1,
        })
        wx.hideLoading()
      }
    })

  },

  /**
   * 设置语音识别历史记录
   */
  setHistory: function() {
    try {
      let dialogList = this.data.dialogList
      dialogList.forEach(item => {
        item.autoPlay = false
      })
      wx.setStorageSync('history',dialogList)

    } catch (e) {

      console.error("setStorageSync setHistory failed")
    }
  },
bindPickerPriceChange: function (e) {
  console.log('picker发送选择改变，携带值为', this.data.priceLists[e.detail.value])
  let price = this.data.priceLists[e.detail.value]
  this.setData({
    price: price
  })
},
})