import callFunction from '../../unit/callFunction';

const app = getApp()

Page({
  data: {
    game_id: '',
    total: 21,
    maxScore: 30,
    // 记录历史分数，便于撤销
    history: [],
    historyIndex: 0,
    // 发球方
    server: '',
    game: {
      game_title: '',
      red: {
        name: '',
        score: ''
      },
      blue: {
        name: '',
        score: ''
      }
    }
  },

  onLoad: function(option) {
    wx.hideLoading();
    this.setData({
      game_id: option.game_id
    })
    this.getGameById();
    // 界面常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },

  computed (e) {
    const {dataset} = e.currentTarget;
    const {game, history, server} = this.data;

    if (dataset.identifier === 'add' && this.ifGameOver()) return;
    this.setData({
      historyIndex: 0,
      history: [{
        redScore: game.red.score,
        blueScore: game.blue.score,
        server
      }, ...history]
    })
    // 最多记录50条历史记录
    if(history.length > 50){
      this.setData({
        history: history.slice(0, 50)
      })
    } 
    if (dataset.identifier === 'add') {
      game[dataset.team].score += 1
      this.setData({
        game,
        server: dataset.team
      })
      this.updateGameScore();
    }else if(dataset.identifier === 'reset'){
      let _this = this;

      wx.showModal({
        title: '重置比分',
        content: '确定重置比分为0:0？',
        success (res) {
          if (res.confirm) {
            game['red'].score = 0
            game['blue'].score = 0    
            _this.setData({
              game,
              server: ''
            })
            _this.updateGameScore();  
          }
        }
      })
    }
  },
  updateGameScore() {
    callFunction({
      name: 'curd',
      data: {
        action: 'update',
        game: this.data.game
      }
    })
  },
  /**
   * 判断比赛是否结束
   * @return {Boolean} true:结束, false: 未结束
   */
  ifGameOver () {
    const redScore = this.data.game.red.score
    const blueScore = this.data.game.blue.score
    const { total, maxScore } = this.data
    /**
     * 三种情况，比赛结束
     * 1、有一方得分=30分
     * 2、一方得分=21分且另一方得分<=19（最常见的情况）
     * 3、双方得分都>=20分且<30且分差>=2分
     */
    if (redScore === maxScore || blueScore === maxScore ||
      (redScore === total && blueScore <= 19) || (blueScore === total && redScore <= 19) ||
      (redScore >= 20 && blueScore >= 20 && Math.abs(redScore - blueScore) >= 2)) {
      wx.showToast({
        title: '比赛结束',
        icon: 'none',
        duration: 2000
      })
      return true
    }
    return false
  },
  getGameById(){
    callFunction({
      name: 'curd',
      data: {
        action: 'retriveById',
        game_id: this.data.game_id
      }
    }).then(res => {
      this.setData({
        game: res.data
      })
    })
  },
  undo() {
    const { historyIndex, history } = this.data;

    if(history[historyIndex]){
      const { redScore, blueScore, server } = history[historyIndex];

      this.data.game.red.score = redScore;
      this.data.game.blue.score = blueScore;
      this.setData({
        game: this.data.game,
        historyIndex: historyIndex + 1,
        server
      })
      this.updateGameScore();
    }
  }

})
