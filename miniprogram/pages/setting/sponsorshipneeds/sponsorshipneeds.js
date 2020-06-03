const app = getApp();
const log = console.log.bind(console)
import create from '../../../utils/create'
import store from '../../../store/index'
const util = require('../../../utils/util.js')
create(store, {
  data: {
    priceLists:[0.01,6.66,8.88,18.88,16.66,28.88,50,66,88,100],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    windowHeight: app.globalData.windowHeight,
    windowWidth: app.globalData.windowWidth,
    loadding: false,
    show: false,
    bottom: 0,
    inputing: false,
    inputText: "",
    focus: !0,
    price:8.88,
    hasUserInfo: false,
    msgLists:[],
    avatar: "https://weather.ioslide.com/aichat/home.png",
    use:[
      'themeValue',
      'languageValue'
    ]
  },
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.onKeyboardHeightChange(res => {
      this.setData({
        bottom: res.height
      })
    })
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
  },
  getSponsorshipMsg(){
    log('[getSponsorshipMsg]')
    const t = this
    let cloudData = {
      action: 'getSponsorshipMsg'
    }
    wx.cloud.callFunction({
      name: 'onSponsorship',
      data: cloudData,
      success: res => {
        log(res)
        t.setData({
          msgLists:res.result.data
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
  onShareAppMessage: function (a) {
    return {
      title: '奇妙天气',
      imageUrl: 'https://weather.ioslide.com/shareimg.png',
      path: "/pages/index/index"
    };
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
  log(e)
  const t = this
  if(e.detail.errMsg == "getUserInfo:fail auth deny"){
    t.setData({
      inputing:false,
      hasUserInfo: false
     })
  }
  if(e.detail.errMsg == "getUserInfo:ok"){
    app.globalData.userInfo = e.detail.userInfo
    t.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
},
bindconfirmInput: function(e) {
    log(e)
    const t = this
    let params = {
      totalCost: t.data.price ,
      merchandiseDescription: '奇妙天气'
    }
    wx.BaaS.pay(params).then(res => {
      console.log('微信支付流水号', res.transaction_no)
      wx.showToast({
        title: 'Loading',
        icon: 'loading',
        duration: 1000,
        mask:true
      })
      t.setData({
          inputText: ""
      });
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
        },
        fail: err => {
          log(err)
        }
      })
    }, err => {
      if (err.code === 603) {
        console.log('用户尚未授权')
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 1000,
          mask:true
        })
      } else if (err.code === 607) {
        console.log('用户取消支付')
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 1000,
          mask:true
        })
      } else if (err.code === 608){
        console.log(err.message)
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 1000,
          mask:true
        })
      }
    })
},
inputVoiceStart: function() {
},
inputVoiceEnd: function() {
},
bindPickerPriceChange: function (e) {
  console.log('picker发送选择改变，携带值为', this.data.priceLists[e.detail.value])
  let price = this.data.priceLists[e.detail.value]
  this.setData({
    price: price
  })
},
})