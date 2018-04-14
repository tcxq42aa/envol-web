<template>
  <v-container class="orange" style="text-align: center">
    <img src="../assets/logo@2x.png" height="22px" class="mt-1 mb-3"/>
    <div class="share-card card">
      <div class="share-card-top">
        <v-avatar
          size="75px"
          class="uc-avatar"
        >
          <img :src="search.headimgurl">
        </v-avatar>
        <div class="mt-2 subheading">{{search.nickname}}</div>
        <p style="line-height: 2" class="mt-1">
          已在【法棍阅读】测试法语阅读水平，<br>
          他的水平是<span class="orange--text">{{search.level}}</span>，相当于欧标<span class="orange--text">{{europeLevel}}</span>
        </p>
      </div>
      <div class="share-card-bottom">
        <p style="line-height: 2; margin: 10px 0">
          长按识别二维码关注<br>
          【法棍阅读】测测你的阅读水平
        </p>
        <img src="../assets/group@2x.png" alt="扫描二维码" height="130px" width="130px" style="margin: auto"/>
        <p style="line-height: 2;margin-top: -10px">
          爱法语，怎能不阅读？<br>
          开始法语阅读，做个更有深度的法语人。
        </p>
      </div>
    </div>
  </v-container>
</template>
<script>
  import '../stylus/share.styl'
  var qs = require('querystringify');
  export default {
    created() {
      this.search = qs.parse(location.search);
    },
    mounted(){
      console.log(this.search)
    },
    data: {
      search: {}
    },
    computed: {
      europeLevel(){
        const levelArray = {'N1': 'A1', 'N2': 'A2-B1', 'N3': 'B1', 'N4': 'B2'};
        return levelArray[this.search.level];
      }
    }
  }
</script>
