
// // 云函数入口文件
// const cloud = require('wx-server-sdk');
 
// cloud.init({
//   env: cloud.DYNAMIC_CURRENT_ENV,
// });
 
// // 云函数入口函数
// exports.main = async (event, context) => {
//   const res = await cloud.cloudPay.unifiedOrder({
//     body: event.body, // 商品描述,必填
//     appid: 'wx7b4bbc2d9c538e84', 
//     mchid: '1586719541',
//     outTradeNo: event.orderid, // 商户订单号,必填,不能重复
//     spbillCreateIp: '127.0.0.1', // 终端IP，必填
//     partnerKey: 'my20889938my20889938my20889938my', 
//     subMchId: '1586719541',
//     totalFee: event.money, // 总金额,必填
//     envId: "wunderweather-nwepb",// 结果通知回调云函数环境,你自己小程序的坏境id
//     functionName: 'payBack', // 结果通知回调云函数名,非必填参数,即使为空,也不影响支付,但是官方文档里写的是必填参数,表示已醉
//   });
//   return res;
// };

// 云函数入口文件
const cloud = require('wx-server-sdk');
 
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

//1，引入支付的三方依赖
const tenpay = require('tenpay');
//2，配置支付信息
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
