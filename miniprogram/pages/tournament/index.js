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
    cache: {},
    years: [2019, 2020]
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
      title: `${this.data.year}年国际羽毛球赛事`,
      imageUrl: '../../images/international-game.jpg'
    }
  },
  dateFormat(start, end){
    let startFormat = start.split('-');
    let endFormat = end.split('-');

    return `${startFormat[0]}月${startFormat[1]}日-${endFormat[0]}月${endFormat[1]}日`;
  },
  switchTournament(e){
    let type = e.currentTarget.dataset.type;

    this.setData({
      tournament: this.data[type],
      type
    })
  },
  switchYear(e){
    let year = e.currentTarget.dataset.year;
    this.setData({
      year
    }, () => {
      this.getTournament();
    })
  },
  getTournament(){
    let now = new Date().getTime();
    let year = this.data.year;

    if(this.data.cache[year]){
      let cache = this.data.cache[year];
      let type = this.data.type;

      this.setData({
        all: cache.all,
        tournament: cache[ type ],
        completed: cache.completed,
        remaining: cache.remaining
      });
      return;
    }
    callFunction({
      name: 'getTournament',
      data: {
        year
      }
    }).then(res => {
      let type = this.data.type;
      let result = res.data.length > 0 ? res.data : [];
      let completed = [];
      let remaining = [];

      result = result.map(item => {
        item.start = new Date(item.year, item['start-date'].split('-')[0] - 1, item['start-date'].split('-')[1]).getTime();
        item.end = new Date(item.year, item['end-date'].split('-')[0] - 1, item['end-date'].split('-')[1],23,59,59).getTime();
        return item;
      })
      result.sort((a, b) => {
        return a.start < b.start ? -1 : 1;
      })
      result = result.map(item => {
        item.date = this.dateFormat( item['start-date'],item['end-date'] );
        if(item.end < now){
          completed.push(item);
        }else{
          remaining.push(item);
        }
        return item;
      })
      this.data.cache[year] = {
        all: result,
        completed,
        remaining
      };
      this.setData({
        all: result,
        tournament: this.data.cache[year][type],
        completed,
        remaining
      })
    })
  }

})
