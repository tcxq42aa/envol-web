<template>
  <v-container class="orange land-container">
    <img src="../assets/logo@2x.png" height="22px" class="mb-3"/>
    <div class="share-card card">
      <div class="share-card-top">
        <div class="mt-4 subheading">欢迎加入</div>
        <div class="orange--text mb-2" style="font-weight: bold">
          <p style="font-size: 18px" class="mt-1 mb-1">法棍阅读 90天法语达人</p>
          <div class="land-line">第二期</div>
        </div>
        <div class="mt-3 mb-5">开课时间：2月5号</div>
      </div>
      <div class="share-card-bottom">
        <p style="font-size: 14px" class="ma-0 mt-3 mb-2 orange--text">
          长按二维码 添加法小棍微信
        </p>
        <div class="mb-3">
          2月4日前务必添加完成
        </div>
        <div style="min-height: 142px">
          <img v-if="grade && grade!='N2'" src="../assets/vovoqrcode@2x.png" alt="扫描二维码" width="135px" style="margin: 0 auto"/>
          <img v-if="grade && grade=='N2'" src="../assets/qrcode.jpg" alt="扫描二维码" width="135px" style="margin: 0 auto"/>
        </div>
        <div style="font-size: 14px;" class="mb-0">
          人数可能较多，请耐心等待法小棍通过<br>
          大家可到个人中心提前阅读入学须知
        </div>
      </div>
    </div>
  </v-container>
</template>
<script>
  import '../stylus/share.styl'
  import '../stylus/land.styl'
  import { bus } from '../bus.vue'
  export default {
    created() {
      bus.$on('checked', (res)=> {
        this.grade = res.grade
      });
    },
    data() {
      return {
        grade: ''
      }
    }
  }

</script>
<style>
  canvas {
    display: block;
  }
</style>
