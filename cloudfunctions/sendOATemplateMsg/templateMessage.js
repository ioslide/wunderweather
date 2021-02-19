const rp = require('request-promise');
const sendTemplateMsg = async (token, param) => {
  return await rp({
    json: true,
    method: 'POST',
    uri: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + token,
    body: {
      template_id :param.template_id,
      miniprogram: param.miniprogram,
      touser: param.touser,
      data: param.data
    }
  }).then(res => {
    console.log(res,param)
    return true
  }).catch(err => {
    console.log(err)
    return false
  })
}
module.exports = {
  sendTemplateMsg:sendTemplateMsg
}