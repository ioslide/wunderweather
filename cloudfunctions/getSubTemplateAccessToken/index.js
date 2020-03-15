
//timerGetAccessToken
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'subweather-5hkjz'
})
const db = cloud.database()
const coll_token = db.collection('accessToken');
const rq = require('request-promise')
const APPID = 'wx673e7d2fe4e6a413';
const APPSECRET = '78e8dad7018be58747ead6b3dc68722a';

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
      }
    })
  } catch (e) {
    console.error(e)
  }
}