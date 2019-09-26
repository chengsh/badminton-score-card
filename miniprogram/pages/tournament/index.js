import callFunction from '../../unit/callFunction';

const app = getApp()

Page({
  data: {
    type: 'remaining',
    tournament: [],
    // 全部
    all: [],
    // 剩余
    remaining: [],
    // 已结束
    completed: [],
    year: new Date().getFullYear(),
    cache: {}
  },

  onLoad: function() {
    wx.hideLoading();
    this.getTournament();
  },
  onHide(){
    this.data.cache = {};
  },
  onShareAppMessage(){
    return {
      title: `${this.data.year}年国际羽毛球赛事`
    }
  },
  dateFormat(start, end){
    let startDate = new Date(start);
    let endDate = new Date(end);
    let startFormat = startDate.getMonth() + 1 + '月' + startDate.getDate() + '日';
    let endFormat = endDate.getMonth() + 1 + '月' + endDate.getDate() + '日';

    return startFormat + '-' + endFormat;
  },
  switchTournament(e){
    let type = e ? e.currentTarget.dataset.type : 'remaining';

    this.setData({
      tournament: this.data[type],
      type
    })
  },
  getTournament(){
    let now = new Date().getTime();
    let year = this.data.year;

    if(this.data.cache[year]){
      let result = this.data.cache[year];

      setData(result);
      return;
    }
    callFunction({
      name: 'getTournament',
      data: {
        year
      }
    }).then(res => {
      let result = res.data.length > 0 ? res.data : [];
      let completed = [];
      let remaining = [];

      result = result.map(item => {
        item.date = this.dateFormat( item['start-date'],item['end-date'] );
        if(item['end-date'] < now){
          completed.push(item);
        }else{
          remaining.push(item);
        }
        return item;
      })
      this.data.cache[year] = result;
      this.setData({
        all: result,
        tournament: remaining,
        completed,
        remaining
      })
    })
  }

})
