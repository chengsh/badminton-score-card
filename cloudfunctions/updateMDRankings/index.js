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
  let type = 'md';
  let fullYear = new Date().getFullYear();
  let week = dayjs().week();
  let total = 5;

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
    	let url = `https://bwfbadminton.cn/rankings/2/bwf-world-rankings/${mappingTable[type].id}/${mappingTable[type].path}/${fullYear}/${week}/?rows=${total}&page_no=1`;
    	let homePage = await axios.get(url);
    	let $ = cheerio.load(homePage.data);
    	let frontFive = $('.tblRankingLanding tbody tr').not('.tr-ranking-detail');
    	let contentTabs = $('.content-tabs li');
    	let frontFiveSportsman = [];

    	for(let i = 0; i < total; i++){
    		frontFiveSportsman.push({
    			rank: i + 1,
          name: frontFive.eq(i).find('.player a').eq(0).attr('title'),
          name2: frontFive.eq(i).find('.player a').eq(1).attr('title'),
          country: frontFive.eq(i).find('.country').eq(0).find('span').text().trim(),
          country2: frontFive.eq(i).find('.country').eq(1).find('span').text().trim(),
    			integral: frontFive.eq(i).find('.point strong').text().trim().split(/\s*\/\s*/)[0]
    		})
    	}

    	await db.collection(`sportsman-${type}`).limit(40).get().then(res => {
    		frontFiveSportsman = frontFiveSportsman.map(item => {
    			res.data.forEach(man => {
            if(man.name === item.name){
              item.cn_name = man.cn_name;
              item.cn_country = man.cn_country;
            }
            if(man.name === item.name2){
              item.cn_name2 = man.cn_name;
              item.cn_country2 = man.cn_country;
            }
    			})
          item.cn_name = item.cn_name || item.name;
          item.cn_name2 = item.cn_name2 || item.name2;
          item.cn_country = item.cn_country || item.country;
          item.cn_country2 = item.cn_country2 || item.country2;
    			return item;
    		})
    	});
    	if(frontFive.length >= total){
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
  	  			sportsman: frontFiveSportsman
  	  		}
  	  	})
	  	}
	}catch(err){
		console.error(err);
	}
}
