// 云函数入口文件
const cloud = require('wx-server-sdk')
const collectionName = 'rankings';
const paramError = (errMsg = '参数错误') => {
  return Promise.reject(errMsg);
}

cloud.init({
  // env: 'test-7w5bo'
  env: 'game-pcm9t'
});
// 云函数入口函数
exports.main = async (event) => {
  const db = cloud.database();

  return await db.collection(collectionName).where({
    type: event.type
  }).get();
}

