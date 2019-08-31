const cloud = require('wx-server-sdk');
const cheerio = require('cheerio');
const axios = require('axios');
const dayjs = require('dayjs');
const weekOfYear = require('dayjs/plugin/weekOfYear');
const rankCollectionName = 'rankings';

dayjs.extend(weekOfYear);

cloud.init({
	// env: 'test-7w5bo'
	env: 'game-pcm9t'
})

// 云函数入口函数
exports.main = async (event, context) => {
  let wxContext = cloud.getWXContext()
  let db = cloud.database();
  let type = 'ms';
  let fullYear = new Date().getFullYear();
  let week = dayjs().week();

  try{
  		let mappingTable = {
  			ms: {
  				id: 6,
  				path: 'men-s-singles'
  			},
  			ws: {
  				id: 7,
  				path: 'women-s-singles'
  			},
  			md: {
  				id: 8,
  				path: 'men-s-doubles'
  			},
  			wd: {
  				id: 9,
  				path: 'women-s-doubles'
  			},
  			mx: {
  				id: 10,
  				path: 'mixed-doubles'
  			}
  		};
    	let url = `https://bwfbadminton.cn/rankings/2/bwf-world-rankings/${mappingTable[type].id}/${mappingTable[type].path}/${fullYear}/${week}/?rows=10&page_no=1`;
    	let homePage = await axios.get(url);
    	let $ = cheerio.load(homePage.data);
    	let frontTen = $('.tblRankingLanding tbody tr').not('.tr-ranking-detail');
    	let contentTabs = $('.content-tabs li');
    	let frontTenSportsman = [];

    	for(let i = 0; i < 10; i++){
    		frontTenSportsman.push({
    			rank: i + 1,
    			name: frontTen.eq(i).find('.player a').attr('title'),
    			country: frontTen.eq(i).find('.country span').text().trim(),
    			integral: frontTen.eq(i).find('.point strong').text().trim().split(/\s*\/\s*/)[0]
    		})
    	}

    	await db.collection(`sportsman-${type}`).limit(40).get().then(res => {
    		frontTenSportsman = frontTenSportsman.map(item => {
    			let filter = res.data.filter(man => {
    				return man.name === item.name;
    			})
    			item.cn_name = filter.length > 0 ? filter[0].cn_name : item.name;
    			item.cn_country = filter.length > 0 ? filter[0].cn_country : item.country;
    			return item;
    		})
    	});
    	if(frontTen.length >= 10){
  	  	// 删除运动员
  	  	await db.collection(rankCollectionName).where({
  	  		type
  	  	}).remove();
  	  	// 存到数据库
  	  	return await db.collection(rankCollectionName).add({
  	  		data: {
  	  			type,
            update_time: dayjs().format('YYYY-MM-DD'),
            year: fullYear,
            week,
  	  			sportsman: frontTenSportsman
  	  		}
  	  	})
	  	}
	}catch(err){
		console.error(err);
	}
}
