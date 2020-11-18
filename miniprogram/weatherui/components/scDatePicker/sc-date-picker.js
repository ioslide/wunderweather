"use strict";
const util = require('../../../utils/util.js')
const config = require('../../../weatherui/config/config.js').default
var dayjs = require("../../assets/lib/day/day"),
  dialogCount = 0;
Component({
  properties: {
    subData: {
				type: Object
			}
  },
  data: {
    yearView: !1,
    dayList: [],
    alreadyMonth: {},
    yearList: [],
    yearRange: 50,
    selectYear: 0,
    selectDateObject: null,
    showDate: null,
    showDateObject: null,
    currentSwiperItemDateIndex: 1,
    currentSwiperItemYearIndex: 0,
    duration: 300,
    lockedTap: !1,
    week: {
      0: "日",
      1: "一",
      2: "二",
      3: "三",
      4: "四",
      5: "五",
      6: "六"
    },
    defaultOption: {
      date: null
    }
  },
  relations: {
    "../scDialog/sc-dialog": {
      type: "child"
    }
  },
  externalClasses: ["sc-class"],
  ready: function () {
    const that = this 
    console.log('subData',that.data.subData)
    this.setData({
      subData : that.data.subData,
      dialogCount: dialogCount++
    }), this.data.dialog = this.selectComponent("#sc-date-picker-dialog-" + this.data.dialogCount)
  },
  methods: {
    _nextMonthDay: function () {
      var t = this.data.showDate.clone().add(1, "months"),
        e = this._monthDay(t);
      if (e.length > 0) return e
    },
    _lastMonthDay: function () {
      var t = this.data.showDate.clone().add(-1, "months"),
        e = this._monthDay(t);
      if (e.length > 0) return e
    },
    _monthDay: function (t) {
      var e = dayjs(t),
        a = [],
        s = e.format("YYYY-MM");
      if (this.data.alreadyMonth[s]) a = this.data.alreadyMonth[s];
      else {
        var n = e.year(),
          i = e.month(),
          o = e.clone();
        o = o.set("date", 1);
        for (var r = o.day(), d = e.daysInMonth(), h = 0; h < r; h++) a.push(null);
        for (var c = 1; c <= d; c++) {
          var l = dayjs();
          l = l.set("year", n).set("month", i).set("date", c), a.push(l.toObject())
        }
        this.data.alreadyMonth[s] = a
      }
      return a
    },
    _change: function (t) {
      const that = this 
      var e = this,
        a = t.detail.current,
        s = this.data.showDate.add(a - this.data.currentSwiperItemDateIndex, "months");
      this.setData({
        showDate: s,
        showDateObject: s.toObject(),
        currentSwiperItemDateIndex: a
      }), a === this.data.dayList.length - 1 && (this.setData({
        lockedTap: !0
      }), setTimeout(function () {
        var t = e.data.dayList;
        t.push(e._nextMonthDay()), e.setData({
          lockedTap: !1,
          dayList: t,
          currentSwiperItemDateIndex: a
        })
      }, this.data.duration)), 0 === a && (this.setData({
        lockedTap: !0
      }), setTimeout(function () {
        var t = e.data.dayList;
        t.unshift(e._lastMonthDay()), e.setData({
          lockedTap: !1,
          dayList: t,
          currentSwiperItemDateIndex: 1
        })
      }, this.data.duration))
    },
    _next: function () {
      this.data.showDate = this.data.showDate.add(1, "months"), this.setData({
        currentSwiperItemDateIndex: ++this.data.currentSwiperItemDateIndex
      })
    },
    _last: function () {
      this.data.showDate = this.data.showDate.add(-1, "months"), this.setData({
        currentSwiperItemDateIndex: --this.data.currentSwiperItemDateIndex
      })
    },
    _selectDate: function (t) {
      var e = t.currentTarget.dataset.date,
        a = dayjs();
      a = a = a.set("year", e.years).set("month", e.months).set("date", e.date), e && this.setData({
        selectDateObject: e,
        selectWeek: a.day()
      })
    },
    _changeViewToYear: function () {
      this.setData({
        yearView: !this.data.yearView
      })
    },
    _selectYear: function (t) {
      var e = t.currentTarget.dataset.year;
      if (e !== this.data.selectYear) {
        var a = this.data.showDate.clone();
        a = a.set("year", e).set("month", a.month()).set("date", a.date()), this.setData({
          selectYear: e,
          selectDateObject: a.toObject(),
          selectWeek: a.day(),
          showDate: a,
          currentSwiperItemDateIndex: 1,
          showDateObject: a.toObject()
        }), this.setData({
          dayList: [this._lastMonthDay(), this._monthDay(a.clone()), this._nextMonthDay()]
        })
      }
      this.setData({
        yearView: !1
      })
    },
    _open: function (t) {
      var e = JSON.parse(JSON.stringify(this.data.defaultOption)),
        a = Object.assign(e, t);
      a.date = a.date || new Date;
      for (var s = dayjs(a.date || new Date), n = s.year(), i = this.data.yearRange, o = [], r = -i; r < i; r++) o[r + i] = n + r;
      this.setData({
        selectDateObject: s.toObject(),
        showDate: s,
        showDateObject: s.toObject(),
        selectWeek: s.day(),
        currentSwiperItemDateIndex: 1,
        currentSwiperItemYearIndex: i - 2,
        yearList: o,
        selectYear: n
      }), this.setData({
        dayList: [this._lastMonthDay(), this._monthDay(s.clone()), this._nextMonthDay()]
      }), this.data.dialog._open()
    },
    _close: function () {
      this.data.dialog._close()
    },
    _submit: function () {
      const that = this 
      console.log('subData',that.data.subData)
      console.log(this.data.selectDateObject)
      var t = this.data.selectDateObject,
        e = t.years,
        a = t.months,
        s = t.date,
        n = t.hours,
        i = t.minutes,
        o = t.seconds,
        r = t.milliseconds,
        d = dayjs();
      d = d.set("year", e).set("month", a).set("date", s).set("hour", n).set("minute", i).set("second", o).set("millisecond", r), 
      this.triggerEvent("submit", {
        value: d.toDate()
      }), 
      this._close()

      // const templateId = config.subTemplateId
      // let time = util.formatDate(d.toDate())
      // let date = util.getDates(7, time)
      // var startTime = date[0].time
      // that.data.subData['startTime'] = startTime
      // console.log('[subData] =>', that.data.subData)

      // const subDailyWeatherCloudFn = () => {
      //   that.setData({
      //     subData : that.data.subData
      //   })
      //    console.log(that.data.subData)
      //   wx.cloud.callFunction({
      //     name: 'openapi',
      //     data: cloudData,
      //     success: res => {
      //       wx.hideLoading({
      //         success: () => {
      //           wx.showToast({
      //             title: '订阅成功',
      //             icon: 'success',
      //             duration: 1000,
      //             mask: true
      //           });
      //         }
      //       });
      //       console.log(`[subDailyWeatherCloudFn] => OK =>`,res)
      //     },
      //     fail: err => {
      //       console.log(`[subDailyWeatherCloudFn] => Fail => `,err)
      //     }
      //   })
      // }
      // const unSubDailyWeatherCloudFn = () => {
      //   let subData = {
      //     action: 'deleteSubscribeMessage',
      //     startTime: startTime,
      //     templateId: templateId
      //   }
      //   that.setData({
      //     subData : subData
      //   })
      //   wx.cloud.callFunction({
      //     name: 'openapi',
      //     data: cloudData,
      //     success: res => {
      //       wx.showToast({
      //         mask: true,
      //         title: '取消订阅成功',
      //         icon: 'success',
      //         duration: 1000,
      //       });
      //       console.log(`[unSubDailyWeatherCloudFn] => Success => ${res}`)
      //     },
      //     fail: err => {
      //       console.log(`[unSubDailyWeatherCloudFn] => Fail => ${err}`)
      //     }
      //   })
      // }
      // wx.requestSubscribeMessage({
      //   tmplIds: [templateId],
      //   success: res => {
      //     if (res.errMsg === 'requestSubscribeMessage:ok') {
      //       if (res[templateId] === 'accept') {
      //         wx.showLoading({
      //           title: 'Loading',
      //         })
      //         subDailyWeatherCloudFn()
      //       } else {
      //         unSubDailyWeatherCloudFn()
      //       }
      //     }
      //   },
      //   fail: result =>{
      //     console.log(result)
      //   }
      // });
    },
    dialogOpen: function () {
      this.triggerEvent("open", {
        bubbles: !0
      })
    },
    dialogClose: function () {
      this.triggerEvent("close", {
        bubbles: !0
      })
    },
    dialogOpened: function () {
      this.triggerEvent("opened", {
        bubbles: !0
      })
    },
    dialogClosed: function () {
      this.triggerEvent("closed", {
        bubbles: !0
      })
    }
  }
});