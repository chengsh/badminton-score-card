// 云函数入口文件
const cloud = require('wx-server-sdk')
const releaseEnv = 'game-pcm9t';
const developEnv = 'test-7w5bo';

cloud.init({
	// env: releaseEnv
	env: developEnv
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}