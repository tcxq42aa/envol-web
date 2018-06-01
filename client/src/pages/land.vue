<template>
  <v-container class="orange land-container">
    <img src="../assets/logo@2x.png" height="22px" class="mb-3"/>
    <div class="share-card card">
      <div class="share-card-top">
        <div class="mt-4 subheading">欢迎加入</div>
        <div class="orange--text mb-2" style="font-weight: bold">
          <p style="font-size: 18px" class="mt-1 mb-1">法棍阅读达人</p>
          <div class="land-line">{{season}}</div>
        </div>
        <div class="mt-3 mb-5">开课时间：{{beginDate}}</div>
      </div>
      <div class="share-card-bottom">
        <p style="font-size: 14px" class="ma-0 mt-3 mb-2 orange--text">
          长按二维码 添加Chef法小棍微信
        </p>
        <div class="mb-2">
          {{lastDate}}前务必添加完成
        </div>
        <div class="mb-3">
          添加时请备注【三期N2】或【三期N3】
        </div>
        <div style="min-height: 142px">
          <img src="../assets/qrcode.jpg" alt="扫描二维码" width="135px" style="margin: 0 auto"/>
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
  import axios from 'axios'
  export default {
    created() {
      let semesterId = this.$route.query.semesterId;
      let url = '/api/semester/detail';
      if(semesterId) {
        url = url + '?semesterId=' + semesterId;
        axios.get(url).then( ({ data: { semester: { name, beginDate }} }) => {
          let m;
          if(m = name.match(/第.+期/)) {
            this.season = m[0];
          }
          let date = new Date(beginDate);
          this.beginDate = (date.getMonth() + 1) + '月' + date.getDate() + '日';
          this.lastDate = (date.getMonth() + 1) + '月' + (date.getDate() - 1) + '日';
        });
      }
    },
    data() {
      return {
        season: '',
        beginDate: '',
        lastDate: ''
      }
    }
  }

</script>
<style>
  canvas {
    display: block;
  }
</style>
