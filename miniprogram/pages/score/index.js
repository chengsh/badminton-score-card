//index.js
const app = getApp()

Page({
  data: {
    loading: false,
    game_id: '',
    total: 21,
    maxScore: 30,
    // 记录历史分数，便于撤销
    history: [],
    historyIndex: 0,
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
    this.setData({
      loading: false,
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
    const {game, history} = this.data;

    if (this.ifGameOver() && dataset.identifier !== 'reset') return;
    this.setData({
      historyIndex: 0,
      history: [{
        redScore: game.red.score,
        blueScore: game.blue.score
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
    } else if(dataset.identifier === 'reset'){
      game['red'].score = 0
      game['blue'].score = 0
    }
    this.setData({
      game
    })
    this.updateGameScore();
  },
  updateGameScore() {
    this.setData({
      loading: true
    })
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'curd',
      data: {
        action: 'update',
        game: this.data.game
      }
    }).then(res => {
      this.setData({
        loading: false
      })
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
      return true
    }
    return false
  },
  getGameById(){
    this.setData({
      loading: true
    })
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'curd',
      data: {
        action: 'retriveById',
        game_id: this.data.game_id
      },
      complete: res => {
        this.setData({
          game: res.result.data,
          loading: false
        })
      }
    })
  },
  undo() {
    const { historyIndex, history } = this.data;

    if(history[historyIndex]){
      const { redScore, blueScore } = history[historyIndex];

      this.data.game.red.score = redScore;
      this.data.game.blue.score = blueScore;
      this.setData({
        game: this.data.game,
        historyIndex: historyIndex + 1
      })
      this.updateGameScore();
    }
  }

})
