Page({
  data: {

  },
  onLoad: function (options) {
    let
    pages = getCurrentPages(),
    prevPage = pages[pages.length - 2],
    data= prevPage.data
    this.setData({
      copyrightlink : data.copyrightlink
    })
    console.log(prevPage)
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})