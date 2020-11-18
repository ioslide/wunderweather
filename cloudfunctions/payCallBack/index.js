// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
 // API 调用都保持和云函数当前所在环境一致
 env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
 return { "errcode": 0 }//第四个坑：注意，一定要返回这个对象，否则回调回一直触发。尤其是自己的逻辑复杂的时候一定要保证所有case的返回都带上这个对象。
}