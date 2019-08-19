let callFunction = function(param){
	wx.showLoading({
	  title: '加载中',
	})
	wx.cloud.init()
	return new Promise((resolve, reject) => {
		wx.cloud
			.callFunction(param)
			.then((res) => {
				console.log(res);
				wx.hideLoading();
				resolve(res.result);
			}).catch(err => {
				console.log(err);
				wx.hideLoading();
				wx.showToast({
				  title: err.errMsg,
				  icon: 'none',
				  duration: 2000
				})
			})
	}) 
}

export default callFunction;