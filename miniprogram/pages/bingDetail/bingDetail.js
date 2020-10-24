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
})