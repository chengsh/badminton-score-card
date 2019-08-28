/**
 * 抓取羽毛球运动员排名
 */
import axios from 'axios';

export default () => {
	return new Promise(async (resolve, reject) => {
		const PAGE_URL = 'https://timeline-merger-ms.juejin.im/v1/get_entry_by_rank?src=web&limit=20&category=5562b415e4b00c57d9b94ac8';
		const homePage = await axios.get(PAGE_URL);
		console.log( homePage );
		// const entryList = homePage.data.d.entrylist;
		// console.log( entrylist );
		// const articles = entryList.map((item) => {
		// 	return {
		// 		title: item.title,
		// 		summary: item.content,
		// 		url: item.originalUrl,
		// 		weekly_id: cateData.Juejin.id
		// 	}		
		// });
	})
}