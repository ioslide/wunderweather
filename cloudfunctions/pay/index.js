
const cloud = require('wx-server-sdk');
 
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const tenpay = require('tenpay');

const config = {
  appid: 'wx7b4bbc2d9c538e84', 
  mchid: '1586719541',
  partnerKey: 'my20889938my20889938my20889938my', 
  notify_url: 'https://wechat.ioslide.com', 
  spbill_create_ip: '127.0.0.1' 
};

exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const api = tenpay.init(config);

  let result = await api.getPayParams({
    out_trade_no: event.orderid,
    body: event.body,
    total_fee: event.money, //订单金额(分),
    openid: wxContext.OPENID //付款用户的openid
  });
  return result;
}
