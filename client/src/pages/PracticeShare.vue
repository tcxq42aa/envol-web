<template>
  <v-container class="orange" style="text-align: center">
    <div class="share-card card">
      <div class="share-card-top">
        <v-avatar
          size="75px"
          class="uc-avatar"
        >
          <img :src="search.headimgurl">
        </v-avatar>
        <div class="mt-2 mb-2 subheading">{{search.nickname}}</div>
        <div class="orange--text mb-2">
          在法棍阅读已坚持完成
        </div>
        <div class="statictis">
          <div>
            <span>{{search.day || 0}}</span>
            <div class="hint">Jours</div>
          </div>
          <div>
            <div>
              <span>{{search.word || 0}}</span>
              <div class="hint">mots</div>
            </div>
          </div>
        </div>
        <p class="orange--text">我在读{{search.book}}</p>
        <img v-if="search.cover" :src="'http://support.envol.vip' + search.cover" alt="" class="mb-2" style="max-width: 50%;min-height: 100px;min-width: 75px"/>
      </div>
      <div class="share-card-bottom">
        <p style="line-height: 2">
          长按识别二维码关注<br>【法棍阅读】
        </p>
        <div class="">
          <img src="../assets/group@2x.png" alt="扫描二维码" width="200px" style="padding-bottom: 80px"/>
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
      document.getElementById('qrcode').src=require('../assets/group@2x.png');
      this.search = qs.parse(location.search);
    },
    mounted(){
      console.log(this.search)
    },
    data() {
      return {
        search: {}
      }
    },
    computed: {
      europeLevel(){
        const levelArray = {'N1': 'A1', 'N2': 'A2-B1', 'N3': 'B1', 'N4': 'B2'};
        return levelArray[this.search.level];
      }
    }
  }
</script>
