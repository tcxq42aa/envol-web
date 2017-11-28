<template>
  <v-container fluid>
    <div class="index-panel orange">
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
            <v-btn v-if="paper" round class="orange white--text btn__orange" :href="'/practice?date=' + today">开始学习</v-btn>
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
            <v-btn v-if="paper" outline round class="orange--text" :href="'/read?date=' + today">开始阅读</v-btn>
          </v-card-actions>
        </v-flex>
      </v-layout>
    </v-card>
    <v-card v-if="paper && paper.wordsTotal == 0" style="width: 50%;margin: 0 auto;">
      <v-layout row wrap>
        <v-flex xs12 class="seg-vert">
          <v-card-title primary-title>
            <div style="width: 100%">
              <h4 class="title text-xs-center">今日测试</h4>
              <div class="card-content text-xs-center">
                <img v-if="paper" src="../assets/group12@2x.png" alt="a" width="95px" class="mt-2">
              </div>
            </div>
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn v-if="paper" round class="orange white--text btn__orange" :href="'/practice?date=' + today">开始测试</v-btn>
          </v-card-actions>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
  import '../stylus/index.styl'
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
    data() {
      return {
        paper: null,
        wordsTotal: 0,
        tractate: '',
        statistical: [],
        userInfo: userInfo || {}
      }
    },
    computed: {
      today() {
        return qs.parse(location.search).date || ''
      },
      tractateStr(){
        return this.tractate.replace(/\\r|\\n/g, '')
      },
      todayStr(){
        var monthArr = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
        var today = new Date();
        return monthArr[today.getMonth()] + ' ' + today.getDate()
      },
      wordsTotalStr(){
        return this.statistical.map(function(item) { return item.wordsTotal}).reduceRight(function(a,b){return (a+b)}, 0)
      }
    }
  }
</script>
