<template>
  <v-container class="read-container" @touchstart>
    <v-snackbar
      :timeout="3000"
      bottom
      v-model="showAudioTooltip"
    >第一遍不能拖动哦</v-snackbar>
    <div class="card pa-3 mb-3" v-if="paper && paper.summary">
      <router-link :to="'/handout?date=' + today + '&semesterId=' + semesterId" v-if="paper && paper.handout">
        <div class="read-handout-entry orange">查看今日讲义</div>
      </router-link>
      <div class="subheading bold mb-3">前情提要</div>
      <div>{{paper.summary}}</div>
    </div>
    <div class="card pa-3 mb-3" v-if="tractate">
      <div v-html="tractate"></div>
      <div class="btn__test-wrap">
        <v-btn v-if="finished" :href="'/practice?date=' + today + '&semesterId=' + semesterId" round class="orange white--text btn__orange btn__test">读完了，去测试</v-btn>
        <v-btn v-if="!finished" round class="orange white--text btn__orange btn__test btn--disabled">读完了，去测试</v-btn>
      </div>
    </div>
    <div class="audio-wrap" v-if="paper && paper.audio">
      <div class="audio-progress" @click.stop="handleSkip">
        <div class="audio-progress-point" v-bind:style="{ left: left + 'px' }" @touchmove.stop="handleTouchMove"></div>
        <div class="audio-progress-line" v-bind:style="{ width: left + 'px' }"></div>
      </div>
      <audio ref="audio" controls
             @loadedmetadata="loadedmetadata" preload="auto"></audio>
      <div class="audio-panel" v-if="paper && paper.audio">
        <div style="flex: auto">
          <div>Vitesse</div>
          <v-btn round fab :flat="speedType!=1" :outline="speedType==1" @click="speed(0.9, 1)">慢</v-btn>
          <v-btn round fab :flat="speedType!=2" :outline="speedType==2" @click="speed(1, 2)">常</v-btn>
          <v-btn round fab :flat="speedType!=3" :outline="speedType==3" @click="speed(1.2, 3)">快</v-btn>
        </div>
        <div style="flex: auto">
          <div class="control-wrap">
            <span class="grey--text audio-current mr-1">{{currentTime}} / {{duration}}</span>
            <i class="reflesh" :class="{'active': loop }" @click="switchLoop()"></i>
          </div>
          <div class="control-wrap">
            <i class="speed speed-back" :class="{ 'disabled': !finished }" @click="fast(-15)"></i>
            <img style="vertical-align: middle" src="../assets/play.png" @click="play()" v-if="!isPlay" width="21px" height="20px">
            <img style="vertical-align: middle" src="../assets/pause.png" @click="pause()" v-if="isPlay" width="21px" height="20px">
            <i class="speed speed-forword" :class="{ 'disabled': !finished }" @click="fast(15)"></i>
          </div>
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
      this.handler = (data) => {
//        this.paper = data.paper;
//        this.tractate = this.paper && this.paper.tractate;
//        this.semesterId = this.paper && this.paper.semesterId;
//        this.statistical = data.statistical;
//        this.initAudio();

        let date = qs.parse(location.search).date;
        let semesterId = qs.parse(location.search).semesterId || '';
        let readToday = (date || formatDate(new Date(serverTime).getTime()));
        let appData = data
        let paper = this.paper = appData.paper;
        if(!paper || paper.wordsTotal == 0) {
          location.replace('/practice?date=' + readToday + '&semesterId=' + semesterId);
          return;
        }
        this.tractate = this.paper && this.paper.tractate;
        this.semesterId = this.paper && this.paper.semesterId;
        this.statistical = appData.statistical;
        this.finished = !!this.statistical.find((item) => item.paperId == this.paper.id);
        this.initAudio();
        if(!this.paper.audio || userInfo.openid == 'oWgFw063YXy6SuOJF95VMLZYmi4g') {
          this.finished = true;
        }
      }
      bus.$on('done', this.handler)
//      let date = qs.parse(location.search).date
//      let readToday = (date || formatDate(new Date(serverTime).getTime()));
//      axios.post('/api/user/today?readToday=' + readToday).then((response) => {
//        let appData = response.data.data
//        let paper = this.paper = appData.paper;
//        if(!paper || paper.wordsTotal == 0) {
//          location.replace('/practice?date=' + readToday);
//          return;
//        }
//        this.tractate = this.paper && this.paper.tractate;
//        this.semesterId = this.paper && this.paper.semesterId;
//        this.statistical = appData.statistical;
//        this.finished = !!(this.statistical.find((item)=> item.paperId == this.paper.id));
//        this.initAudio();
//        if(!this.paper.audio) {
//          this.finished = true;
//        }
//        if(localStorage.getItem('audio_' + this.paper.id)){
//          this.finished = true;
//        }
//      })
    },
    destroyed(){
      bus.$off('done', this.handler)
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
        loop: false,
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
//                self.$refs.audio.play();
//                self.$refs.audio.pause();
//                if(res.errMsg != 'getNetworkType:ok') {
//                  alert(JSON.stringify(res));
//                }
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
//            localStorage.setItem('audio_' + this.paper.id, '1');
            this.percent = 0;
            this.pause();
            if(this.loop) {
              this.audioRef.currentTime = 0;
              this.play();
            }
          }
        }, 1000)
      },
      play(){
        if(!this.audioRef) {
          this.$refs.audio.src = '';
          this.$refs.audio.src = attachHost + this.paper.audio;
          this.$refs.audio.play();
          this.isPlay = true
          return
        }
        if(this.isPlay) {
          this.pause()
        } else {
          this.isPlay = true
          this.audioRef.play()
        }
      },
      pause(){
        if(!this.audioRef) {
          this.$refs.audio.pause();
          this.isPlay = false
          return
        }
        this.isPlay = false
        this.audioRef.pause()
      },
      speed(v, type){
        if(this.audioRef){
          this.speedType = type
          this.audioRef.playbackRate = v
        }
      },
      fast(second) {
        const currentTime = this.audioRef.currentTime;
        this.audioRef.currentTime = Math.max(0, currentTime + second);
      },
      switchLoop() {
        this.loop = !this.loop;
      },
      formatTime(second){
        let min = Math.floor(second / 60);
        let sec = Math.floor(second % 60);
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
