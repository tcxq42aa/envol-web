<template>
  <v-container class="read-container">
    <v-snackbar
      :timeout="3000"
      bottom
      v-model="showAudioTooltip"
    >第一遍不能拖动哦</v-snackbar>
    <div class="card pa-3 mb-3" v-if="paper && paper.summary">
      <router-link :to="'/handout?date=' + today" v-if="paper && paper.handout">
        <div class="read-handout-entry orange">查看今日讲义</div>
      </router-link>
      <div class="subheading bold mb-3">前情提要</div>
      <div>{{paper.summary}}</div>
    </div>
    <div class="card pa-3 mb-3" v-if="tractate">
      <div v-html="tractate"></div>
      <div class="btn__test-wrap">
        <v-btn v-if="finished" :href="'/practice?date=' + today" round class="orange white--text btn__orange btn__test">读完了，去测试</v-btn>
        <v-btn v-if="!finished" round class="orange white--text btn__orange btn__test btn--disabled">读完了，去测试</v-btn>
      </div>
    </div>
    <div class="audio-wrap" v-if="paper && paper.audio">
      <div class="audio-progress" @click.stop="handleSkip">
        <div class="audio-progress-point" v-bind:style="{ left: left + 'px' }" @touchmove.stop="handleTouchMove"></div>
        <div class="audio-progress-line" v-bind:style="{ width: left + 'px' }"></div>
      </div>
      <audio ref="audio" controls
             @loadedmetadata="loadedmetadata" preload="metadata"></audio>
      <div class="audio-panel" v-if="paper && paper.audio">
        <div>
          <div>Vitesse</div>
          <v-btn round fab :flat="speedType!=1" :outline="speedType==1" @click="speed(0.9, 1)">慢</v-btn>
          <v-btn round fab :flat="speedType!=2" :outline="speedType==2" @click="speed(1, 2)">常</v-btn>
          <v-btn round fab :flat="speedType!=3" :outline="speedType==3" @click="speed(1.2, 3)">快</v-btn>
        </div>
        <div>
          <span class="grey--text audio-current">{{currentTime}} / {{duration}}</span>
          <v-icon class="orange--text audio-icon" @click="play()" v-if="!isPlay">play_arrow</v-icon>
          <v-icon class="orange--text audio-icon" @click="pause()" v-if="isPlay">pause</v-icon>
        </div>
      </div>
    </div>
    <div v-if="!paper || paper.wordsTotal == 0">
      今日没有课程
    </div>
  </v-container>
</template>

<script>
  import { bus } from '../bus.vue'
  import axios from 'axios'
  import { formatDate } from './util.vue'
  import '../stylus/read.styl'
  var qs = require('querystringify');
  export default {
    created(){
      document.title = '今日阅读';
//      this.handler = (data) => {
//        this.paper = data.paper;
//        this.tractate = this.paper && this.paper.tractate;
//        this.semesterId = this.paper && this.paper.semesterId;
//        this.statistical = data.statistical;
//        this.initAudio();
//      }
//      bus.$on('done', this.handler)
      let date = qs.parse(location.search).date
      let readToday = (date || formatDate(new Date(serverTime).getTime()));
      axios.post('/api/user/today?readToday=' + readToday).then((response) => {
        let appData = response.data.data
        let paper = this.paper = appData.paper;
        if(!paper || paper.wordsTotal == 0) {
          location.replace('/practice?date=' + readToday);
          return;
        }
        this.tractate = this.paper && this.paper.tractate;
        this.semesterId = this.paper && this.paper.semesterId;
        this.statistical = appData.statistical;
        this.initAudio();
        if(!this.paper.audio) {
          this.finished = true;
        }
        if(localStorage.getItem('audio_' + this.paper.id)){
          this.finished = true;
        }
      })
    },
    destroyed(){
//      bus.$off('done', this.handler)
      this.timer && clearInterval(this.timer)
    },
    mounted(){
    },
    data() {
      return {
        showAudioTooltip: false,
        finished: false,
        isPlay: false,
        paper: {},
        tractate: null,
        semesterId: 0,
        statistical: null,
        currentTime: '00:00',
        duration: '00:00',
        audioRef: null,
        timer: null,
        percent: 0,
        left: 0,
        speedType: '2',
      }
    },
    computed: {
      today() {
        return qs.parse(location.search).date || ''
      }
    },
    methods: {
      initAudio(){
        var self = this;
        if(this.paper) {
          wx.ready(()=>{
            wx.getNetworkType({
              success: function (res) {
                var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
                self.$refs.audio.src = attachHost + self.paper.audio;
                self.$refs.audio.load();
                if(res.errMsg != 'getNetworkType:ok') {
                  alert(JSON.stringify(res));
                }
              }
            });
          });
        }
      },
      loadedmetadata(e){
        this.audioRef = e.target;
        this.duration = this.formatTime(e.target.duration)
        this.timer = setInterval(()=>{
          this.currentTime = this.formatTime(this.audioRef.currentTime)
          this.percent = this.audioRef.currentTime / this.audioRef.duration * 100
          this.left = (document.body.clientWidth - 57) * this.percent / 100;
          if(this.percent == 100){
            if(this.isPlay) {
              window.scrollTo(0,999999);
            }
            this.finished = true;
            localStorage.setItem('audio_' + this.paper.id, '1');
            this.percent = 0;
            this.pause();
          }
        }, 1000)
      },
      play(){
        if(!this.audioRef)
          return
        if(this.isPlay) {
          this.pause()
        } else {
          this.isPlay = true
          this.audioRef.play()
        }
      },
      pause(){
        this.isPlay = false
        this.audioRef.pause()
      },
      speed(v, type){
        if(this.audioRef){
          this.speedType = type
          this.audioRef.playbackRate = v
        }
      },
      formatTime(second){
        let min = (second / 60).toFixed(0);
        let sec = (second % 60).toFixed(0);
        if(min == 0){
          min = '00';
        }else if(min < 10){
          min = '0' + min;
        }
        if(sec == 0){
          sec = '00';
        }else if(sec < 10){
          sec = '0' + sec;
        }
        return min + ':' + sec
      },
      handleTouchMove(e) {
        if(this.finished) {
          let max = (document.body.clientWidth - 57);
          this.left = Math.min(Math.max(e.touches[0].clientX - 28, 0), max);
          let p = this.left / (document.body.clientWidth - 57);
          this.audioRef.currentTime = this.audioRef.duration * p;
        } else {
          this.showAudioTooltip = true;
        }
      },
      handleSkip(e) {
        let target = e.target;
        if(target.className == 'audio-progress-line') {
          target = target.parentElement;
        }
        if(this.finished) {
//          let max = (document.body.clientWidth - 57);
//          this.left = Math.min(Math.max(e.touches[0].clientX - 28, 0), max);
          let p = e.offsetX / target.offsetWidth;
          this.audioRef.currentTime = this.audioRef.duration * p;
        }
      }
    }
  }
</script>
