
const cloud = require('wx-server-sdk');
const rp = require('request-promise');
cloud.init({
  env: 'wunderweather-nwepb'
})

exports.main = async (event, context) => {
  const db = cloud.database();
  let getAccessToken = await db.collection("oa-subscribe-accessToken").doc("ACCESS_TOKEN").get();
  let accessToken = getAccessToken.data.token;
  let getUserInfo = {
    method: 'GET',
    uri: 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + accessToken + '&openid='+ 'oyI3f0tDMZ-_fUN5MPuZwuZ7_BDQ' +'&lang=zh_CN',  //这里是公众号的openid
    json: true
  }
  let userInfo = await rp(getUserInfo)
  console.log('[userInfo]',userInfo)
  return {
    userInfo:userInfo
  }
}