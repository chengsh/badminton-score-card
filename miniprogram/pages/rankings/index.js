import callFunction from '../../unit/callFunction';

const app = getApp()

Page({
  data: {
    type: 'ms',
    rankings: [],
    year: '',
    week: '',
    update_time: ''
  },

  onLoad: function() {
    wx.hideLoading();
    this.getRankings();
  },

  getRankings(e){
    let type = e ? e.currentTarget.dataset.type : 'ms';

    callFunction({
      name: 'getRankings',
      data: {
        type
      }
    }).then(res => {
      console.log(res);
      let result = res.data.length > 0 ? res.data[0] : {};

      this.setData({
        rankings: result.sportsman || [],
        year: result.year || '',
        week: result.week || '',
        update_time: result.update_time || '',
        type,
      })
    })
  }

})
