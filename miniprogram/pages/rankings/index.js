import callFunction from '../../unit/callFunction';

const app = getApp()

Page({
  data: {
    type: 'ms',
    rankings: [],
    year: '',
    week: '',
    update_time: '',
    cache: {}
  },

  onLoad: function() {
    wx.hideLoading();
    this.getRankings();
  },
  onHide(){
    this.data.cache = {};
  },
  onShareAppMessage(){
    return {
      title: `${this.data.year}年第${this.data.week}周羽联世界排名`,
      imageUrl: '../../images/work-ranking.jpg'
    }
  },
  getRankings(e){
    let type = e ? e.currentTarget.dataset.type : 'ms';
    let setData = result => {
      this.setData({
        rankings: result.sportsman || [],
        year: result.year || '',
        week: result.week || '',
        update_time: result.update_time || '',
        type,
      })
    }
    if(e && type === this.data.type)return;
    if(this.data.cache[type]){
      let result = this.data.cache[type];

      setData(result);
      return;
    }
    callFunction({
      name: 'getRankings',
      data: {
        type
      }
    }).then(res => {
      let result = res.data.length > 0 ? res.data[0] : {};
      this.data.cache[type] = result;
      
      setData(result);
    })
  }

})
