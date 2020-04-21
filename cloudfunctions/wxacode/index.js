const cloud = require('wx-server-sdk')
cloud.init({
  env: 'wunderweather-nwepb'
})
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.wxacode.get({
        path: 'page/index/index',
        width: 430,
        is_hyaline:true
      })
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}
// const wxacodeResult = await cloud.openapi.wxacode.get({
//   path: 'pages/openapi/openapi',
//   width: 430,
//   is_hyaline: true
// })
// const fileExtensionMatches = wxacodeResult.contentType.match(/\/([^\/]+)/)
// const fileExtension = (fileExtensionMatches && fileExtensionMatches[1]) || 'jpg'
// const uploadResult = await cloud.uploadFile({
//   // 云文件路径，此处为演示采用一个固定名称
//   cloudPath: `wxacode_default_openapi_page.${fileExtension}`,
//   // 要上传的文件内容可直接传入图片 Buffer
//   fileContent: wxacodeResult.buffer,
// })
// if (!uploadResult.fileID) {
//   throw new Error(`upload failed with empty fileID and storage server status code ${uploadResult.statusCode}`)
// }
// return uploadResult.fileID