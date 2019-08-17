let callFunction = function(param){
	wx.showLoading({
	  title: '加载中',
	})
	wx.cloud.init()
	return new Promise((resolve, reject) => {
		wx.cloud
			.callFunction(param)
			.then((res) => {
				wx.hideLoading();
				if(res.result.code == 200){
					resolve(res.result);
				}else{
					let err = res.result.err || {};

					wx.showToast({
					  title: err.msg || '请求失败',
					  icon: 'none',
					  duration: 2000
					})
					reject(res.result.err);
				}
			}).catch(err => {
				wx.hideLoading();
				wx.showToast({
				  title: err.errMsg,
				  icon: 'none',
				  duration: 2000
				})
				reject(err);
			})
	}) 
}

export default callFunction;