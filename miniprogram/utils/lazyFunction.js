
function throttle(fn, interval) {
  var enterTime = 0;
  var gapTime = interval || 300;
  return function () {
    var context = this;
    var backTime = new Date();
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime;
    }
  };
}

function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 1000;
  return function () {
    clearTimeout(timer);
    var context = this;
    var args = arguments;
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}

export default {
  throttle,
  debounce
};