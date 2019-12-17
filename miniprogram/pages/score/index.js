import callFunction from '../../unit/callFunction';

const app = getApp()
// 轮询间隔
const ASYNC_INTERVAL = 5000;
// 同步按钮禁用间隔
const DISABLED_ASYNC_INTERVAL = 5000;

Page({
  data: {
    // 21分制
    total: 21,
    maxScore: 30,
    // 是否在同步比分
    asyncData: false,
    // 轮询定时器
    asyncTimer: null,
    // 禁用主动触发轮询
    asyncDisable: false,
    game_id: '',
    // 记录历史分数，便于撤销
    history: [],
    historyIndex: 0,
    // 激活工具栏
    toolActive: false,
    // 激活三局比分面板
    allScoreActive: false,
    // 红蓝队大比分
    redWin: 0,
    blueWin: 0,
    game: {
      game_title: '',
      // A/B/C三局
      current_round: 'A',
      // 发球方
      server: '',
      finish: 0,
      round: {
        'A': {
          red: 0,
          blue: 0
        },
        'B': {
          red: 0,
          blue: 0
        },
        'C': {
          red: 0,
          blue: 0
        }
      },
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
    },() => {
      this.getGameById().then((res) => {
        this.pollRequest(res.data.owner);
        wx.setNavigationBarTitle({
          title: this.data.game.game_title
        })
        if(this.data.game.finish){
          this.openAllScore();
        }
        this.computedWin(this.data.game);
      });
    })
  },

  // 计算大比分
  computedWin(game){
    let current_round = game.current_round;
    let redWin = 0;
    let blueWin = 0;
    let winCount = key => {
      let redScore = game.red.score;
      let blueScore = game.blue.score;

      if(key){
        redScore = game.round[key].red;
        blueScore = game.round[key].blue;
      }
      if(blueScore > redScore){
        blueWin += 1;
      }else{
        redWin += 1;
      }
    }
    let commonCode = () => {
      if(game.finish || this.ifRoundOver(game.red.score, game.blue.score)){
        winCount();
      }
    }
    switch(current_round){
      case 'A':
        commonCode();
        break;
      case 'B':
        winCount('A');
        commonCode();
        break;
      case 'C':
        winCount('A');
        winCount('B');
        commonCode();
        break;
    }

    this.setData({
      redWin,
      blueWin
    })
  },

  asyncDataHandle(){
    if(!this.data.asyncDisable){
      this.getGameById();
    }
  },

  // 查看比分，轮询
  pollRequest(owner = true){
    if(!owner && this.data.game.finish != 1){
      clearInterval(this.data.asyncTimer);
      this.data.asyncTimer = setInterval(() => {
        this.getGameById();
      }, ASYNC_INTERVAL);
    }
  },
  onHide(){
    if(this.data.asyncTimer){
      clearInterval(this.data.asyncTimer);
      this.data.asyncTimer = null;
    }
  },
  onShow() {
    // 界面常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    if(!this.data.asyncTimer){
      this.pollRequest(this.data.game.owner);
    }
  },
  onUnload(){
    // 关闭界面常亮
    wx.setKeepScreenOn({
      keepScreenOn: false
    })
    if(this.data.asyncTimer){
      clearInterval(this.data.asyncTimer);
      this.data.asyncTimer = null;
    }
  },
  onShareAppMessage(){
    const {game, game_id} = this.data;

    return {
      title: `${game.red.name} VS ${game.blue.name}，${game.red.score} : ${game.blue.score}`,
      path: `/pages/index/index?page=score&game_id=${game_id}`,
      imageUrl: '../../images/score-online.jpg'
    }
  },
  openAllScore(){
    this.setData({
      allScoreActive: !this.data.allScoreActive
    })
  },

  computed (e) {
    const {dataset} = e.currentTarget;
    const {game, history} = this.data;
    const setHistory = () => {
      this.setData({
        historyIndex: 0,
        history: [{
          redScore: game.red.score,
          blueScore: game.blue.score,
          server: game.server
        }, ...history]
      })
      // 最多记录50条历史记录
      if(history.length > 50){
        this.setData({
          history: history.slice(0, 50)
        })
      }
    }

    if(this.data.toolActive){
      this.setData({
        toolActive: false
      })
    }
    if(this.data.allScoreActive){
      this.setData({
        allScoreActive: false
      })
    }
    // 不是创建人或比赛是结束状态（不可撤销）或比分已经满足结束比赛条件（仍可撤销）
    if (!game.owner || game.finish && dataset.identifier === 'reset' || this.ifGameOver()) return;
    if (dataset.identifier === 'add') {
      setHistory();
      game[dataset.team].score += 1
      game['server'] = `${dataset.team}-${game[dataset.team].score % 2 == 0 ? 'r' : 'l'}`
      this.setData({
        game
      })
      this.updateGameScore();
      this.computedWin(game);
    }else if(dataset.identifier === 'reset'){
      let _this = this;

      wx.showModal({
        title: '重置本局比分',
        content: '确定重置本局比分为0:0？',
        success (res) {
          if (res.confirm) {
            setHistory();
            game['red'].score = 0
            game['blue'].score = 0    
            game['server'] = ''
            _this.setData({
              game
            })
            _this.computedWin(game);
            _this.updateGameScore();  
          }
        }
      })
    }
  },
  clearHistory() {
    this.setData({
      historyIndex: 0,
      history: []
    })
  },
  updateGameScore(params) {
    callFunction({
      name: 'update',
      data: {
        game: this.data.game,
        ...params
      }
    })
  },
  // 判断当前比分是否二比一
  is2_0 () {
    const {game} = this.data;
    const redScore = game.red.score
    const blueScore = game.blue.score
    const roundA = game.round['A'];

    if(game.current_round != 'B') return false;
    if(roundA.red > roundA.blue && redScore > blueScore || roundA.red < roundA.blue && redScore < blueScore){
      return true;
    }
    return false;
  },
  // 判断某一局是否结束
  ifRoundOver(redScore, blueScore){
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
      return true;
    }else{
      return false;
    }
  },
  /**
   * 判断比赛是否结束
   * @return {Boolean} true:结束, false: 未结束
   */
  ifGameOver () {
    const {game} = this.data;
    const redScore = game.red.score
    const blueScore = game.blue.score
    const { current_round } = game
    const _this = this;
    const showToast = () => {
      this.openAllScore();
      wx.showToast({
        title: '比赛结束',
        icon: 'none',
        duration: 2000
      })
    }

    if(game.finish){
      showToast();
      return true;
    }
    if (this.ifRoundOver(redScore, blueScore)) {
      // 打到第三局或者前两局2：0，没必要进行第三局
      if(current_round === 'C' || this.is2_0()){
        showToast();
      }else{
        let title = {
          'A': '一',
          'B': '二'
        }

        wx.showModal({
          title: `第${title[current_round]}局比赛结束`,
          content: `是否开始下一局比赛？`,
          success (res) {
            if (res.confirm) {
              _this.clearHistory();
              game.round[ current_round ] = {
                blue: blueScore,
                red: redScore
              }
              game['red'].score = 0
              game['blue'].score = 0
              game['server'] = redScore > blueScore ? 'red-r' : 'blue-r'
              game['current_round'] = current_round == 'A' ? 'B' : 'C'
              _this.setData({
                game
              })
              _this.updateGameScore();  
              _this.computedWin(game);
            }
          }
        })
      }
      return true
    }
    return false
  },
  getGameById(){
    this.setData({
      asyncData: true,
      asyncDisable: true
    })
    return callFunction({
      name: 'getGameById',
      data: {
        game_id: this.data.game_id
      }
    }).then(res => {
      if(res.data){
        this.setData({
          game: res.data,
          asyncData: false
        })
      }else{
        let duration = 3000;

        clearInterval(this.data.asyncTimer);
        wx.showToast({
          title: res.errMsg || '数据不存在',
          icon: 'none',
          duration,
          success: () => {
            setTimeout(() => {
              wx.redirectTo({
                url: `/pages/index/index`
              })
            }, duration)
          }
        })
      }
      setTimeout(() => {
        this.setData({
          asyncDisable: false
        })
      }, DISABLED_ASYNC_INTERVAL)
      return res;
    })
  },
  // 撤销
  undo() {
    const { historyIndex, history } = this.data;

    if(history[historyIndex]){
      const { redScore, blueScore, server } = history[historyIndex];

      this.data.game.red.score = redScore;
      this.data.game.blue.score = blueScore;
      this.data.game.server = server;
      this.setData({
        game: this.data.game,
        historyIndex: historyIndex + 1
      })
      this.updateGameScore();
      this.computedWin(this.data.game);
    }
  },

  // 激活工具栏
  openTool() {
    this.setData({
      toolActive: !this.data.toolActive
    })
  },

  // 手动结束比赛
  finishGame(){
    const _this = this;
    const {game} = this.data;

    if(game.finish)return;
    wx.showModal({
      title: '立即结束比赛',
      content: '确定要结束本场比赛？',
      success (res) {
        if (res.confirm) {
          _this.clearHistory();
          game['finish'] = 1;
          _this.setData({
            game,
            toolActive: false
          })
          _this.updateGameScore({
            finish: 1
          });  
        }
      }
    })
  }

})
