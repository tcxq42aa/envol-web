<template>
  <div>
    <h3>1122</h3>
    <!--<router-link :to="'/test?semesterId=4'">-->
      <v-btn block round class="btn-test orange--text white" href="/test?semesterId=4">
        开始测试吧
        <img src="../assets/arrow@2x.png" height="15px" style="margin-left: 8px"/>
      </v-btn>
    <!--</router-link>-->
    <h3>22</h3>
    <v-btn flat class="orange--text" value="/uc">
      <span>个人中心</span>
      <img src="../assets/personal3@2x.png" height="25px"/>
    </v-btn>
    <h3>33</h3>
    <button type="button" class="btn-test orange--text white btn btn--block btn--raised btn--round">
      <div class="btn__content">
        开始测试吧
        <img src="/dist/5a85ef4c381a64d5d35d2ab56b281b1e.png" height="15px" style="margin-left: 8px;"></div>
    </button>
    <audio ref="audio" controls preload="metadata"></audio>
    <h3>447</h3>
  </div>
</template>
<script>
  export default {
    mounted() {
      var today = new Date(serverTime);
      console.log(today.getTimezoneOffset());
      let a = today.getTimezoneOffset()*60000 + today.getTime() + 3600000*8;
      today =new Date(a);
//      console.log(today);
      var year = today.getFullYear()
      var month = today.getMonth() + 1
      var day = today.getDate()
      if(month < 10){
        month = '0' + month
      }
      if(day < 10){
        day = '0' + day
      }
      console.log(`${year}${'-'}${month}${'-'}${day}`);
      var self = this;
      wx.ready(function(){
        wx.getNetworkType({
          success: function (res) {
            if(res.errMsg != 'getNetworkType:fail') {
              this.showError = true;
              alert(JSON.stringify(res));
            }
            self.$refs.audio.src = 'https://static.envol.vip/attach/20171019/2xRxVI7sSrJM7otUM9Bp5aMl7s5virCs.mp3';
            self.$refs.audio.load();
          }
        });
      })


    }
  }
</script>
