
//timerGetAccessToken
const cloud = require('wx-server-sdk')
const APPID = 'wx7b4bbc2d9c538e84'
const APPSECRET = '4ebadf0e08f79dccd6b894ffa8716d49'

cloud.init({
  env: 'wunderweather-nwepb'
})
const db = cloud.database()
const coll_token = db.collection('accessToken');
const rq = require('request-promise')


exports.main = async (event, context) => {
  try {
    let res = await rq({
      method: 'GET',
      uri: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + APPID + "&secret=" + APPSECRET,
    });
    res = JSON.parse(res)
    let resUpdate = await coll_token.doc('ACCESS_TOKEN').update({
      data: {
        token: res.access_token
      },
      success: function(res) {
        console.log(res)
      }
    })
  } catch (e) {
    console.error(e)
  }
}