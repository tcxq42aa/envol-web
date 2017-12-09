<template>
  <v-container fluid>
    <div class="index-panel orange" id="index-header">
      <router-link :to="'/handout?date=' + today">
        <div class="handout-entry">今日讲义</div>
      </router-link>

      <v-avatar
        size="75px"
        class="grey index-avatar"
      >
        <img :src="userInfo.headimgurl" alt="avatar">
      </v-avatar>
      <div class="white--text mt-3 mb-3 subheading">{{userInfo.nickname}}</div>
      <v-layout row wrap class="white--text text-xs-center">
        <v-flex xs6 class="seg-vert-small">
          <div class="display-1">{{wordsTotalStr}}</div>
          <div class="titke">词汇量</div>
        </v-flex>
        <v-flex xs6>
          <div class="display-1">{{statistical.length}}</div>
          <div class="titke">坚持学习/天</div>
        </v-flex>
      </v-layout>
    </div>
    <v-card v-if="paper && paper.wordsTotal > 0">
      <v-layout row wrap>
        <v-flex xs6 class="seg-vert">
          <v-card-title primary-title>
            <div style="width: 100%">
              <h4 class="title text-xs-center">今日词表</h4>
              <div class="card-content text-xs-center">
                <img v-if="paper" src="../../public/a.png" alt="a" width="65px" class="mt-2">
              </div>
            </div>
          </v-card-title>
          <v-card-actions class="justify-center">
            <router-link :to="'/wordList?date=' + today">
              <v-btn v-if="paper" round class="orange white--text btn__orange">开始学习</v-btn>
            </router-link>
          </v-card-actions>
        </v-flex>
        <v-flex xs6>
          <v-card-title primary-title>
            <div style="width: 100%">
              <h4 class="title text-xs-center">今日阅读</h4>
              <div v-if="paper" class="card-content">
                <div class="mb-1"><strong>{{todayStr}}</strong></div>
                <div class="tractate" v-html="tractateStr"></div>
              </div>
            </div>
          </v-card-title>
          <v-card-actions class="justify-center">
            <router-link :to="'/read?date=' + today">
              <v-btn v-if="paper" outline round class="orange--text">开始阅读</v-btn>
            </router-link>
          </v-card-actions>
        </v-flex>
      </v-layout>
    </v-card>
    <v-card v-if="paper && paper.wordsTotal == 0" style="width: 50%;margin: 0 auto;">
      <v-layout row wrap>
        <v-flex xs12 class="seg-vert">
          <v-card-title primary-title>
            <div style="width: 100%">
              <h4 class="title text-xs-center">章节测试</h4>
              <div class="card-content text-xs-center">
                <img v-if="paper" src="../assets/group12@2x.png" alt="a" width="95px" class="mt-2">
              </div>
            </div>
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn :href="'/practice?date=' + today" v-if="paper" round class="orange white--text btn__orange">开始测试</v-btn>
          </v-card-actions>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
  import '../stylus/index.styl'
  import SiriWave from '../service/sw';
  import { todayFullStr } from './util.vue';
  import { bus } from '../bus.vue'
  var qs = require('querystringify');
  export default {
    created(){
      document.title = '法棍阅读';
      this.handler = (data) => {
        this.paper = data.paper;
        this.tractate = this.paper && this.paper.tractate;
        this.semesterId = this.paper && this.paper.semesterId;
        this.statistical = data.statistical;
      }
      bus.$on('done', this.handler)
    },
    destroyed(){
      bus.$off('done', this.handler)
    },
    mounted() {
      const SW = new SiriWave({
        width: document.body.clientWidth,
        height: 130,
        container: document.getElementById('index-header')
      });
      SW.setSpeed(0.006);
      SW.start();
      setInterval(function(){
        SW.setNoise(0.15);
      }, 0);

      setTimeout(()=>{
        const SW2 = new SiriWave({
          width: document.body.clientWidth,
          height: 170,
          bgColor: 'rgba(255,255,255,0.04)',
          container: document.getElementById('index-header')
        });
        SW2.setSpeed(0.004);
        SW2.start();
        setInterval(function(){
          SW2.setNoise(0.1);
        }, 0);
      }, 300);
    },
    data() {
      return {
        paper: null,
        wordsTotal: 0,
        tractate: '',
        statistical: [],
        userInfo: userInfo || {},
        todayStr: todayFullStr()
      }
    },
    computed: {
      today() {
        return qs.parse(location.search).date || ''
      },
      tractateStr(){
        return this.tractate.replace(/\\r|\\n/g, '')
      },
      wordsTotalStr(){
        return this.statistical.map(function(item) { return item.wordsTotal}).reduceRight(function(a,b){return (a+b)}, 0)
      }
    }
  }
</script>
