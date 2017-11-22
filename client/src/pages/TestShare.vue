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
        <div class="mt-2 mb-3 subheading">{{search.nickname}}</div>
        <p style="line-height: 2">
          已在【法棍阅读】测试法语阅读水平，<br>
          他的水平是{{search.level}}，相当于欧标{{europeLevel}}
        </p>
      </div>
      <div class="share-card-bottom">
        <p style="line-height: 2">
          长按识别二维码关注<br>
          【法棍阅读】测测你的阅读水平
        </p>
        <div class="">
          <img src="../assets/group@2x.png" alt="扫描二维码" height="200px" width="200px"/>
        </div>
        <p style="line-height: 2">
          爱法语，怎能不阅读？<br>
          开始法语阅读，不再做个肤浅法语人。
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
