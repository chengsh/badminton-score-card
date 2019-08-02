<template>
  <div class="game-score">
    <h3 class="game-title" @click="jump">某某公司第一届羽毛球比赛</h3>
    <div class="game-scoring">
      <div class="red">
        <h3 class="team-name">梦之队</h3>
        <div class="team-scoring">
          <span class="number">18</span>
        </div>
      </div>
      <div class="blue">
        <h3 class="team-name">星之队</h3>
        <div class="team-scoring">
          <span class="number">18</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Score',
  props: {

  },
  methods: {
    jump () {
      mpvue.navigateTo({
        url: '../control/main'
      })
    }
  },
  mounted: () => {

  }
}
</script>

<style scoped lang="less">
.game-score{
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.game-title{
  text-align: center;
  font-size: 18rpx;
  margin: 18rpx;
  height: 18rpx;
  line-height: 18rpx;
}
.game-scoring{
  height: calc(100vh - 18rpx);
  display: flex;
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
    width: 90%;
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
</style>
