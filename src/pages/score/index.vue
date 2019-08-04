<template>
  <div class="game-score">
    <div class="game-btns">
      <span :class="history[historyIndex] ? 'undo' : 'undo disabled'" @click="undo">
        <img src="/static/images/undo.svg"></img>
      </span>
      <span class="reset" @click="reset"><img src="/static/images/reset.svg"></img></span>
    </div>
    <h3 class="game-title">{{game.game_title}}</h3>
    <div class="game-scoring">
      <div class="red">
        <h3 class="team-name">{{game.red.name}}</h3>
        <div class="team-scoring" @click="computed('red', 'add')">
          <span class="number">{{game.red.score}}</span>
        </div>
      </div>
      <div class="blue">
        <h3 class="team-name">{{game.blue.name}}</h3>
        <div class="team-scoring" @click="computed('blue', 'add')">
          <span class="number">{{game.blue.score}}</span>
        </div>
      </div>
    </div>
    <loading :hidden="!loading" >
      加载中...
    </loading>
  </div>
</template>

<script>

export default {
  data () {
    return {
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
    }
  },
  methods: {
    computed (team, operator = 'add') {
      if (this.ifGameOver()) return;

      this.historyIndex = 0;
      this.history.unshift({
        redScore: this.game.red.score,
        blueScore: this.game.blue.score
      });
      // 最多记录50条历史记录
      if(this.history.length > 50){
        this.history.length = 50;
      } 
      if (operator === 'add') {
        this.game[team].score += 1
      } else {
        this.game[team].score = this.game[team].score - 1 >= 0 ? this.game[team].score - 1 : 0
      }
      this.updateGameScore();
    },
    updateGameScore() {
      this.loading = true;
      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'updateGame',
        data: {
          ...this.game
        }
      }).then(res => {
        this.loading = false;
      })
    },
    /**
     * 判断比赛是否结束
     * @return {Boolean} true:结束, false: 未结束
     */
    ifGameOver () {
      const redScore = this.game.red.score
      const blueScore = this.game.blue.score
      /**
       * 三种情况，比赛结束
       * 1、有一方得分=30分
       * 2、一方得分=21分且另一方得分<=19（最常见的情况）
       * 3、双方得分都>=20分且<30且分差>=2分
       */
      if (redScore === this.maxScore || blueScore === this.maxScore ||
        (redScore === this.total && blueScore <= 19) || (blueScore === this.total && redScore <= 19) ||
        (redScore >= 20 && blueScore >= 20 && Math.abs(redScore - blueScore) >= 2)) {
        return true
      }
      return false
    },
    getGameById(){
      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'getGameById',
        data: {
          id: this.game_id
        },
        complete: res => {
          this.game = res.result.data;
        }
      })
    },
    undo() {
      if(this.history[this.historyIndex]){
        const { redScore, blueScore } = this.history[this.historyIndex];

        this.game.red.score = redScore;
        this.game.blue.score = blueScore;
        this.updateGameScore();
        this.historyIndex += 1;
      }
    },
    reset() {
      this.game.red.score = 0;
      this.game.blue.score = 0;
      this.updateGameScore();
      this.historyIndex = 0;
    }
  },

  mounted () {
    this.game_id = this.$mp.query.game_id;
    this.getGameById();
  }
}
</script>

<style scoped lang="less">
.game-score{
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  color: white;
  background: linear-gradient(#0b54a7, #166dd1);
  overflow: hidden;
  border-top: 3rpx solid #fff;
  &:before{
    content: '';
    display: block;
    width: 50vw;
    height: 100vh;
    position: absolute;
    z-index: 0;
    left: 50%;
    top: 0;
    z-index: 0;
    background: linear-gradient(#2cc447, #1d9632);
  }
}
.game-title{
  text-align: center;
  font-size: 18rpx;
  margin: 18rpx;
  height: 18rpx;
  line-height: 18rpx;
  z-index: 1;
}
.game-scoring{
  position: relative;
  height: calc(100vh - 18rpx);
  display: flex;
  z-index: 1;
  .red{
    flex: 1;
  }
  .blue{
    flex: 1;
  }
  .red,.blue{
    text-align: center;
    height: 100%;
    overflow: hidden;
  }
  .team-name{
    font-size: 30rpx;
    margin: 0;
    height: 30rpx;
  }
  .team-scoring{
    margin: 18rpx 0;
    flex: 6;
    text-align: center;
    overflow: hidden;
    height: calc(100% - 84rpx);
    .number{
      width: 100%;
      height: 100%;
      font-size: 180rpx;
      overflow: hidden;
    }
  }
}
.game-btns{
  width: 100rpx;
  height: 30rpx;
  position: absolute;
  right: 0;
  top: 10rpx;
  z-index: 2;
  .undo,.reset{
    width: 30rpx;
    height: 30rpx;
    border-radius: 50%;
    display: inline-block;
    background: #0b54a7;
    box-shadow: 0 0 5px rgba(0,0,0,0.3);
    text-align: center;
    line-height: 30rpx;
    vertical-align: middle;
    >img{
      width: 100%;
      height: 100%;
    }
    &.disabled{
      opacity: 0.5;
    }
  }
  .undo{
    margin-right: 20rpx;
  }
  .reset>img{
    width: 90%;
    height: 90%;
    transform: translateY(5%);
  }
}
</style>
