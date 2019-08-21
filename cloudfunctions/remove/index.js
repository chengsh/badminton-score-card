// 云函数入口文件
const cloud = require('wx-server-sdk')
const collectionName = 'games';

const paramError = (errMsg = '参数错误') => {
  return Promise.reject(errMsg);
}

cloud.init({
  // env: 'test-7w5bo'
  env: 'game-pcm9t'
});
// 云函数入口函数
exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database();

  if(!event.game_id){
    return paramError();
  }
  return await db.collection(collectionName).doc(event.game_id).remove();
}

