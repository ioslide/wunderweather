
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}
const YearMonthDayCN = (times) =>{
  var dateTime= new Date(times);
  var year=dateTime.getFullYear();
  var month=dateTime.getMonth() + 1;
  var day=dateTime.getDate();
  month < 10 ? month='0'+month : month; 
  hours < 10 ? hours='0'+hours : hours; 
  minutes < 10 ? minutes='0'+minutes : minutes; 
  second < 10 ? second='0'+second : second; 
  let dateStr = year + '年' + month + '月' + day + '日'
  return dateStr;
}
const formatDateClear = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('')
}
var t = "".concat("/data/%E7%A6%8F%E5%88%A9/100/");

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const getDates = (days, todate) => {
  var dateArry = [];
  for (var i = 0; i < days; i++) {
    var dateObj = dateLater(todate, i);
    dateArry.push(dateObj)
  }
  return dateArry;
}
const formatHourTime = (date) =>{
  var dateTime= new Date(date);
  var hours = dateTime.getHours()
  var minutes = date.getMinutes()
  hours < 10 ? hours='0'+hours : hours; 
  minutes < 10 ? minutes='0'+minutes : minutes; 
  let dateStr = hours + ':' + minutes
  return dateStr;
}
const formatMonthDay =(date)  =>{
  var day = date.getDate()
  var month = new Date().toDateString().split(" ")[1]
  var md = month +" "+ day
  return  md
}
const dateLater = (dates, later) =>{
  let dateObj = {};
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  date.setDate(date.getDate() + later);
  let day = date.getDay();
  let yearDate = date.getFullYear();
  let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
  let dayFormate = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  dateObj.time = yearDate + '-' + month + '-' + dayFormate;
  dateObj.week = show_day[day];
  return dateObj;
}
module.exports = {
  formatDate: formatDate,
  formatDateClear:formatDateClear,
  getDates: getDates,
  YearMonthDayCN:YearMonthDayCN,
  formatHourTime: formatHourTime,
  formatMonthDay: formatMonthDay
}

// function e(e, a, t, A) {
//   var c = new Date(e, a, t).getTime() + 24e3 * A * 3600, n = new Date();
//   return n.setTime(c), {
//       year: n.getFullYear(),
//       month: n.getMonth(),
//       day: n.getDate()
//   };
// }

// function e(e) {
//   var a = new Date();
//   return a.setDate(a.getDate() + e), {
//       y: a.getFullYear(),
//       m: a.getMonth(),
//       d: a.getDate()
//   };
// }

// var a = function(e) {
//   return (e = e.toString())[1] ? e : "0" + e;
// };

// module.exports = {
//   formatTime: function(e) {
//       var t = (e = new Date(e)).getFullYear(), A = e.getMonth() + 1, c = e.getDate(), n = e.getHours(), D = e.getMinutes(), _ = e.getSeconds();
//       return [ t, A, c ].map(a).join("/") + " " + [ n, D, _ ].map(a).join(":");
//   },
//   formatTimeHM: function(e) {
//       (e = new Date(e)).getFullYear(), e.getMonth(), e.getDate();
//       var t = e.getHours(), A = e.getMinutes();
//       e.getSeconds();
//       return [ t, A ].map(a).join(":");
//   },
//   getDate: function(e) {
//       var a = new Date();
//       return a.setDate(a.getDate() + e), {
//           y: a.getFullYear(),
//           m: a.getMonth(),
//           d: a.getDate()
//       };
//   },
//   toUTC: function(e, a, t) {
//       return Date.UTC(e, a, t) / 1e3;
//   },
//   calcDays: function(e, a) {
//       var t = a - e;
//       return parseInt(t / 864e5);
//   },
//   calcDate: e,
//   roundRect: function(e, a, t, A, c, n, D) {
//       e.save(), e.beginPath(), e.setFillStyle(D), e.arc(a + n, t + n, n, Math.PI, 1.5 * Math.PI), 
//       e.moveTo(a + n, t), e.lineTo(a + A - n, t), e.lineTo(a + A, t + n), e.arc(a + A - n, t + n, n, 1.5 * Math.PI, 2 * Math.PI), 
//       e.lineTo(a + A, t + c - n), e.lineTo(a + A - n, t + c), e.arc(a + A - n, t + c - n, n, 0, .5 * Math.PI), 
//       e.lineTo(a + n, t + c), e.lineTo(a, t + c - n), e.arc(a + n, t + c - n, n, .5 * Math.PI, Math.PI), 
//       e.lineTo(a, t + n), e.lineTo(a + n, t), e.fill(), e.closePath(), e.clip(), e.restore();
//   },
//   getHour: function(e) {
//       var a = e.substr(11, 2);
//       e.substr(15, 2);
//       return (a = (a = new Date(e).getHours()).toString()) >= 10 ? a + ":00" : "0" + a + ":00";
//   },
//   formatHour: function(e) {
//       return (e = e.toString())[1] ? e : "0" + e;
//   },
//   formatDay: function(e) {
//       return [ e.substr(8, 2) ].map(a).join("");
//   },
//   formatMonth: function(e) {
//       return [ e.substr(5, 2) ].map(a).join("");
//   },
//   formatWeek: function(e) {
//       var a, t = new Date(e).getDay();
//       return 0 == t ? a = "日" : 1 == t ? a = "一" : 2 == t ? a = "二" : 3 == t ? a = "三" : 4 == t ? a = "四" : 5 == t ? a = "五" : 6 == t && (a = "六"), 
//       a;
//   },
//   formatYear: function(e) {
//       return [ e.substr(0, 4) ].map(a).join("");
//   },
//   formatNumber: a,
//   color: function(e, a) {
//       var t = {};
//       return t.CLASSIC = {
//           CLEAR_DAY: "#ffbb2e",
//           CLEAR_NIGHT: "#596683",
//           PARTLY_CLOUDY_DAY: "#79aac5",
//           PARTLY_CLOUDY_NIGHT: "#596683",
//           CLOUDY: "#657381",
//           LIGHT_RAIN: "#7bc8db",
//           MODERATE_RAIN: "#7bc8db",
//           HEAVY_RAIN: "#7bc8db",
//           STORM_RAIN: "#7bc8db",
//           LIGHT_SNOW: "#a4b2bd",
//           MODERATE_SNOW: "#a4b2bd",
//           HEAVY_SNOW: "#a4b2bd",
//           STORM_SNOW: "#a4b2bd",
//           WIND: "#7c7f97",
//           FOG: "#b8b8b8",
//           LIGHT_HAZE: "#b8b8b8",
//           MODERATE_HAZE: "#b8b8b8",
//           HEAVY_HAZE: "#b8b8b8",
//           DUST: "#b8b8b8",
//           SAND: "#b8b8b8"
//       }, t.THEME2019 = {
//           CLEAR_DAY: "#ffdea5",
//           CLEAR_NIGHT: "#7b8baf",
//           PARTLY_CLOUDY_DAY: "#b9cef0",
//           PARTLY_CLOUDY_NIGHT: "#7b8baf",
//           CLOUDY: "#C1D5E0",
//           LIGHT_RAIN: "#78d1f4",
//           MODERATE_RAIN: "#78d1f4",
//           HEAVY_RAIN: "#78d1f4",
//           STORM_RAIN: "#78d1f4",
//           LIGHT_SNOW: "#cce3ff",
//           MODERATE_SNOW: "#cce3ff",
//           HEAVY_SNOW: "#cce3ff",
//           STORM_SNOW: "#cce3ff",
//           WIND: "#adb0ea",
//           FOG: "#ddc7c0",
//           LIGHT_HAZE: "#ddc7c0",
//           MODERATE_HAZE: "#ddc7c0",
//           HEAVY_HAZE: "#ddc7c0",
//           DUST: "#ddc7c0",
//           SAND: "#ddc7c0"
//       }, t.FRESH = {
//           CLEAR_DAY: "#fdcc56",
//           CLEAR_NIGHT: "#8898db",
//           PARTLY_CLOUDY_DAY: "#63ccec",
//           PARTLY_CLOUDY_NIGHT: "#8898db",
//           CLOUDY: "#7890bd",
//           LIGHT_RAIN: "#25d4c5",
//           MODERATE_RAIN: "#25d4c5",
//           HEAVY_RAIN: "#25d4c5",
//           STORM_RAIN: "#25d4c5",
//           LIGHT_SNOW: "#bfcceb",
//           MODERATE_SNOW: "#bfcceb",
//           HEAVY_SNOW: "#bfcceb",
//           STORM_SNOW: "#bfcceb",
//           WIND: "#D4A281",
//           FOG: "#cacaca",
//           LIGHT_HAZE: "#cacaca",
//           MODERATE_HAZE: "#cacaca",
//           HEAVY_HAZE: "#cacaca",
//           DUST: "#cacaca",
//           SAND: "#cacaca"
//       }, t.CHINA = {
//           CLEAR_DAY: "#ffb61e",
//           CLEAR_NIGHT: "#6b6882",
//           PARTLY_CLOUDY_DAY: "#4c8dae",
//           PARTLY_CLOUDY_NIGHT: "#6b6882",
//           CLOUDY: "#75878a",
//           LIGHT_RAIN: "#48c0a3",
//           MODERATE_RAIN: "#48c0a3",
//           HEAVY_RAIN: "#48c0a3",
//           STORM_RAIN: "#48c0a3",
//           LIGHT_SNOW: "#bacac6",
//           MODERATE_SNOW: "#bacac6",
//           HEAVY_SNOW: "#bacac6",
//           STORM_SNOW: "#bacac6",
//           WIND: "#a88462",
//           FOG: "#808080",
//           LIGHT_HAZE: "#808080",
//           MODERATE_HAZE: "#808080",
//           HEAVY_HAZE: "#808080",
//           DUST: "#808080",
//           SAND: "#808080"
//       }, t.BLACK = {
//           CLEAR_DAY: "#444444",
//           CLEAR_NIGHT: "#444444",
//           PARTLY_CLOUDY_DAY: "#444444",
//           PARTLY_CLOUDY_NIGHT: "#444444",
//           CLOUDY: "#444444",
//           LIGHT_RAIN: "#444444",
//           MODERATE_RAIN: "#444444",
//           HEAVY_RAIN: "#444444",
//           STORM_RAIN: "#444444",
//           LIGHT_SNOW: "#444444",
//           MODERATE_SNOW: "#444444",
//           HEAVY_SNOW: "#444444",
//           STORM_SNOW: "#444444",
//           WIND: "#444444",
//           FOG: "#444444",
//           LIGHT_HAZE: "#444444",
//           MODERATE_HAZE: "#444444",
//           HEAVY_HAZE: "#444444",
//           DUST: "#444444",
//           SAND: "#444444"
//       }, t.FLAT = {
//           CLEAR_DAY: "#f5ab35",
//           CLEAR_NIGHT: "#7c8a99",
//           PARTLY_CLOUDY_DAY: "#22a7f0",
//           PARTLY_CLOUDY_NIGHT: "#7c8a99",
//           CLOUDY: "#95a5a6",
//           LIGHT_RAIN: "#17bbb0",
//           MODERATE_RAIN: "#17bbb0",
//           HEAVY_RAIN: "#17bbb0",
//           STORM_RAIN: "#17bbb0",
//           LIGHT_SNOW: "#bdc3c7",
//           MODERATE_SNOW: "#bdc3c7",
//           HEAVY_SNOW: "#bdc3c7",
//           STORM_SNOW: "#bdc3c7",
//           WIND: "#be8c6b",
//           FOG: "#a0a0a0",
//           LIGHT_HAZE: "#a0a0a0",
//           MODERATE_HAZE: "#a0a0a0",
//           HEAVY_HAZE: "#a0a0a0",
//           DUST: "#a0a0a0",
//           SAND: "#a0a0a0"
//       }, t.ASHY = {
//           CLEAR_DAY: "#dbcaaf",
//           CLEAR_NIGHT: "#939391",
//           PARTLY_CLOUDY_DAY: "#9ca8b8",
//           PARTLY_CLOUDY_NIGHT: "#939391",
//           CLOUDY: "#a6a6a8",
//           RAIN: "#b5c4b1",
//           LIGHT_RAIN: "#b5c4b1",
//           MODERATE_RAIN: "#b5c4b1",
//           HEAVY_RAIN: "#b5c4b1",
//           STORM_RAIN: "#b5c4b1",
//           LIGHT_SNOW: "#c1cbd7",
//           MODERATE_SNOW: "#c1cbd7",
//           HEAVY_SNOW: "#c1cbd7",
//           STORM_SNOW: "#c1cbd7",
//           WIND: "#c7b8a1",
//           FOG: "#b7b1a5",
//           LIGHT_HAZE: "#b7b1a5",
//           MODERATE_HAZE: "#b7b1a5",
//           HEAVY_HAZE: "#b7b1a5",
//           DUST: "#b7b1a5",
//           SAND: "#b7b1a5"
//       }, t[e][a];
//   },
//   isToday: function(e) {
//       var e = new Date(e).getFullYear() + "-" + (new Date(e).getMonth() + 1) + "-" + new Date(e).getDate();
//       console.log(e);
//       var a = new Date();
//       return e == a.getFullYear() + "-" + (a.getMonth() + 1) + "-" + (a = a.getDate());
//   },
//   isYestoday: function(e) {
//       var e = new Date(e), a = new Date(), t = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime(), A = new Date(t - 864e5).getTime();
//       return e.getTime() < t && A <= e.getTime();
//   },
//   currentMonthFirstDay: function(e, a) {
//       return console.log(new Date(e, a - 1, 1)), Number(new Date(e, a - 1, 1));
//   },
//   nextMonthFirstDay: function(e, a) {
//       return console.log(new Date(12 == a ? e + 1 : e, 12 == a ? 1 : a, 1)), Number(new Date(12 == a ? e + 1 : e, 12 == a ? 1 : a, 1));
//   },
//   tomorrow: function() {
//       var a = e(1);
//       return Number(new Date(a.y, a.m, a.d));
//   }
// };