<template>
  <div class="game-score">
    <h3 class="game-title" @click="clickHandle">{{game.game_title}}</h3>
    <div class="game-scoring">
      <div class="red">
        <h3 class="team-name">{{game.red.name}}</h3>
        <div class="team-scoring">
          <span class="number">{{game.red.score}}</span>
        </div>
        <div class="game-btns">
          <span class="btn btn-reduce" @click="computed('red', 'reduce')">-</span>
          <span class="btn btn-add" @click="computed('red', 'add')">+</span>
        </div>
      </div>
      <div class="blue">
        <h3 class="team-name">{{game.blue.name}}</h3>
        <div class="team-scoring">
          <span class="number">{{game.blue.score}}</span>
        </div>
        <div class="game-btns">
          <span class="btn btn-reduce" @click="computed('blue', 'reduce')">-</span>
          <span class="btn btn-add" @click="computed('blue', 'add')">+</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Score',
  data () {
    return {
      game_id: '',
      total: 21,
      maxScore: 30,
      game: {
        game_title: '',
        red: {
          name: '',
          score: 0
        },
        blue: {
          name: '',
          score: 0
        }
      }
    }
  },
  props: {

  },
  methods: {
    clickHandle (ev) {
      mpvue.navigateTo({
        url: '../index/main'
      })
    },
    computed (team, operator = 'add') {
      if (this.ifGameOver()) return
      if (operator === 'add') {
        this.game[team].score += 1
      } else {
        this.game[team].score = this.game[team].score - 1 >= 0 ? this.game[team].score - 1 : 0
      }
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
    }
  },
  mounted: function(){
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
  color: white;
  background: linear-gradient(#0b54a7, #166dd1);
  overflow: hidden;
  &:before{
    content: '';
    display: block;
    width: 100vw;
    height: 200vh;
    position: absolute;
    z-index: 0;
    left: 40rpx;
    top: 0;
    background: linear-gradient(#2cc447, #1d9632);
    transform: rotate(33deg);
  }
}
.game-title{
  text-align: center;
  font-size: 32rpx;
  margin: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  color: white;
  z-index: 1;
}
.game-scoring{
  height: calc(100vh - 32rpx);
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
    // height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .team-name{
    width: 90%;
    font-size: 55rpx;
    margin: 0;
    height: 70rpx;
  }
  .team-scoring{
    margin: 16rpx 0 20rpx 0;
    text-align: center;
    overflow: hidden;
    flex: 2;
    .number{
      width: 100%;
      height: 100%;
      font-size: 180rpx;
      overflow: hidden;
    }
  }
  .game-btns{
    display: flex; 
    flex-direction: column;
    flex: 2;
    margin-bottom: 20rpx;
    .btn{
      flex: 1;
      text-align: center;
      font-size: 140rpx;
      margin: 20rpx;
      border-radius: 8rpx;
    }
    .btn-add{
      background-color: rgba(76,145,255,1);
    }
    .btn-reduce{
      background-color: rgba(255,150,0,0.2);
    }
  }
}
</style>
