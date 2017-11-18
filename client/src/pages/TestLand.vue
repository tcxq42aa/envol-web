<template>
  <v-container>
    <div class="card orange test-land-wrap mb-3">
      <img src="../assets/logo@2x.png" height="22px"/>
      <h3 style="margin-bottom: 36px;">法棍阅读入学测试</h3>
      <img src="../assets/cover@2x.png" width="130px" height="85px">
      <p>
        想开始法语阅读，<br>但不知道自己适合读什么？<br>立即开始测试，<br>匹配合适的法语阅读书。
      </p>
    </div>
    <v-btn block round class="btn-test orange--text white" :href="semesterId ? '/test?semesterId=' + semesterId : '/test'">
      开始测试吧
      <img src="../assets/arrow@2x.png" height="15px" style="margin-left: 8px"/>
    </v-btn>
  </v-container>
</template>

<script>
  import '../stylus/test.styl'
  export default {
    created(){
      document.title = '我的课程'
    },
    data() {
      return {
        semesterId: this.$route.query.semesterId,
        userInfo: userInfo || {},
        e6: null,
        modal2: false,
      }
    },
    methods: {
    }
  }
</script>
