// 云函数入口文件
const cloud = require('wx-server-sdk')
const collectionName = 'tournament';


cloud.init({
  // env: 'test-7w5bo'
  env: 'game-pcm9t'
});
// 云函数入口函数
exports.main = async (event) => {
  const db = cloud.database();

  return await db.collection(collectionName).where({
    year: event.year || new Date().getFullYear()
  }).get();
}

