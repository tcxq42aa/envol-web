<template>
  <v-container fluid style="text-align: center">
    <div class="paid-panel orange">
      <img src="../assets/paid-bg@2x.png" height="218px" class="mt-1 mb-3"/>
    </div>
    <div class="paid-card card">
      <p style="line-height: 32px;" class="mb-0">
        Cool！<br>
        你已正式加入法语棍阅读中的一员了。<br>
        希望你能从此爱上法语阅读。<br>
        希望你从小小的farine慢慢发酵成一个外表金<br>
        黄、内心优雅有内涵的美丽baguette。<br>
          <span style="color: rgb( 252, 147, 61)">开课前，<br>
          请务必扫码添加法小棍微信<br>
          具体入学相关事宜将由法小棍<br>
          给大家说明。</span>
      </p>
      <img v-if="grade && grade!='N2'" src="../assets/vovoqrcode@2x.png" alt="扫描二维码" height="135px" width="135px"/>
      <img v-if="grade && grade=='N2'" src="../assets/qrcode.jpg" alt="扫描二维码" height="135px" width="135px"/>
    </div>
  </v-container>
</template>

<script>
  import '../stylus/paid.styl'
  import { bus } from '../bus.vue'

  export default {
    created(){
      document.title = '法棍阅读';
      bus.$on('checked', (res)=> {
        this.grade = res.grade
      });
    },
    data() {
      return {
        grade: ''
      }
    },
    methods: {
    }
  }
</script>
