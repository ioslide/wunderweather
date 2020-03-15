
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')

}
var t = "".concat("/data/%E7%A6%8F%E5%88%A9/100/");

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function getDates(days, todate) {
  var dateArry = [];
  for (var i = 0; i < days; i++) {
    var dateObj = dateLater(todate, i);
    dateArry.push(dateObj)
  }
  return dateArry;
}
function formatHourTime(date) {
  var hour = date.getHours()
  var minute = date.getMinutes()
  var t
  if (minute < 10) {
    if(hour<12){
      t = hour + ":0" + minute +" AM"
    }else{
      t = hour + ":0" + minute + " PM"
    }
  } else {
    if (hour < 12) {
      t = hour + ":" + minute + " AM"
    } else {
      t = hour + ":" + minute + " PM"
    }
  }
  return t
}
function formatMonthDay(date) {
  var day = date.getDate()
  var month = new Date().toDateString().split(" ")[1]
  var md = month +" "+ day
  return  md
}
function dateLater(dates, later) {
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
  BASE_URL: "",
  GET_MEIZHI_URL: t,
  formatDate: formatDate,
  getDates: getDates,
  formatHourTime: formatHourTime,
  formatMonthDay: formatMonthDay
}