// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // env: 'test-7w5bo'
  env: 'game-pcm9t'
});
// 云函数入口函数
exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()

  return {
    openid: OPENID
  }
}