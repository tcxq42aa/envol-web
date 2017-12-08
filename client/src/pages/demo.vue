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
    <h3>44</h3>
  </div>
</template>
<script>
  export default {
    mounted() {
      console.log('demo');
    }
  }
</script>
