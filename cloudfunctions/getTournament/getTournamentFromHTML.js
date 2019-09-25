function getTournament(year){
	var arr = [];
	document.querySelectorAll('.tblResultLanding').forEach(item => {
	  let a = item.querySelectorAll('a');

	  a.forEach((aitem, i) => {
	    arr.push({
	      "title": aitem.querySelector('h2').textContent,
	      "country": item.querySelectorAll('.venue-country')[i].querySelectorAll('.country_code')[1].textContent.trim().replace(/\n*\s*/g,''),
	      "city": item.querySelectorAll('.venue-country')[i].querySelectorAll('.country_code')[0].textContent.trim().replace(/\n*\s*/g,''),
	      "year": year,
	      "start-date": aitem.querySelector('h3').textContent,
	      "end-date": aitem.querySelector('h3').textContent,
	      "prize": aitem.querySelector('.prize').textContent.trim(),
	      "level": 'Super '+aitem.querySelector('.logo img').src.match(/[^\/]+$/)[0].match(/\d+/)[0]
	    })
	  })
	})

	arr = arr.map(item => {
		let nums = item['start-date'].split(/[^\d]+/).filter(item => {
			return item.length > 0;
		})
		item['start-date'] = new Date( item.year, nums[0] - 1, nums[1] ).getTime();
		item['end-date'] = new Date( item.year, nums[0] - 1, nums[2] ).getTime();
		item.prize = `$${item.prize.replace(/[^\d]+/,'')}`
		return item;
	})

	console.log( JSON.stringify(arr) );
}


getTournament(2019)