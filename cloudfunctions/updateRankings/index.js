// 抓取羽毛球运动员排名
const cloud = require('wx-server-sdk');
const cheerio = require('cheerio');
const axios = require('axios');
const sportsmanCollectionName = 'sportsman-ms';
const rankCollectionName = 'rankings';

cloud.init({
	env: 'test-7w5bo'
	// env: 'game-pcm9t'
})

// 云函数入口函数
exports.main = async (event, context) => {
  let wxContext = cloud.getWXContext()
  let db = cloud.database();

  try{
	  let PAGE_URL = 'https://bwfbadminton.cn/rankings/';
	  let homePage = await axios.get(PAGE_URL);
	  let $ = cheerio.load(homePage.data);
	  let frontTen = $('.tblRankingLanding tbody tr').not('.tr-ranking-detail');
	  let frontTenSportsman = [];

	  for(let i = 0; i < 10; i++){
	  	frontTenSportsman.push({
	  		rank: i + 1,
	  		name: frontTen.eq(i).find('.player a').attr('title'),
	  		country: frontTen.eq(i).find('.country span').text().trim(),
	  		integral: frontTen.eq(i).find('.point strong').text().trim().split(/\s*\/\s*/)[0]
	  	})
	  }

	  await db.collection(sportsmanCollectionName).limit(30).get().then(res => {
	  	console.log(res);
	  	frontTenSportsman = frontTenSportsman.map(item => {
	  		let filter = res.data.filter(man => {
	  			return man.name === item.name;
	  		})
	  		item.cn_name = filter.length > 0 ? filter[0].cn_name : item.name;
	  		item.cn_country = filter.length > 0 ? filter[0].cn_country : item.country;
	  		return item;
	  	})
	  });
	  console.log(frontTenSportsman);
	  // 存到数据库
	  await db.collection(rankCollectionName).remove();
	  await db.collection(rankCollectionName).add({
	  	data: frontTenSportsman
	  })
	}catch(err){
		console.error(err);
	}
}
