<template>
  <v-container class="orange land-container">
    <img src="../assets/logo@2x.png" height="22px" class="mb-3"/>
    <div class="share-card card">
      <div class="share-card-top">
        <div class="mt-4 subheading">欢迎加入</div>
        <div class="orange--text mb-2" style="font-weight: bold">
          <p style="font-size: 18px" class="mt-1 mb-1">法棍阅读 90天法语达人</p>
          <div class="land-line">第一期</div>
        </div>
        <div class="mt-3 mb-5">开课时间：12月11号</div>
      </div>
      <div class="share-card-bottom">
        <p style="font-size: 14px" class="ma-0 mt-3 mb-2 orange--text">
          长按二维码 添加督导Vovo微信
        </p>
        <div class="mb-3">
          12月10日前务必添加完成
        </div>
        <img src="../assets/vovoqrcode@2x.png" alt="扫描二维码" width="135px" style="margin: 0 auto"/>
        <div style="font-size: 14px;" class="mb-0">
          人数可能较多，请耐心等待Vovo通过<br>
          大家可到个人中心提前阅读入学须知
        </div>
      </div>
    </div>
  </v-container>
</template>
<script>
  import '../stylus/share.styl'
  import '../stylus/land.styl'
  export default {
    created() {
    }
  }

</script>
<style>
  canvas {
    display: block;
  }
</style>
