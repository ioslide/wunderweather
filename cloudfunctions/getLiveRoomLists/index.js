
const cloud = require('wx-server-sdk')
const APPID = 'wx7b4bbc2d9c538e84'
const APPSECRET = 'f7c6ba05eb3a1b0b58208dd2f1b0c19b'
const rq = require('request-promise')
cloud.init({
  env: 'wunderweather-nwepb'
})

exports.main = async (event, context) => {
  try {
    let res = await rq({
      method: 'GET',
      uri: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + APPID + "&secret=" + APPSECRET,
    });
    res = JSON.parse(res)
    let tokenData = res.access_token
    let roomLists = await rq({
      method: 'POST',
      form: {
        "start": 0, // 起始拉取房间，start = 0 表示从第 1 个房间开始拉取
        "limit": 10 // 每次拉取的个数上限，不要设置过大，建议 100 以内
      },
      uri: " http://api.weixin.qq.com/wxa/business/getliveinfo?access_token=" + tokenData
    });
    roomLists = JSON.parse(roomLists)
    return {
      roomLists:roomLists
    }
  } catch (e) {
    console.error(e)
  }
}