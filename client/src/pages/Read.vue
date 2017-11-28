<template>
  <v-container class="read-container">
    <div class="card pa-3 mb-3" v-if="paper && paper.summary">
      <div class="subheading bold mb-3">前情提要</div>
      <div>{{paper.summary}}</div>
    </div>
    <div class="card pa-3 mb-3" v-if="tractate">
      <div v-html="tractate"></div>
      <div class="btn__test-wrap">
        <v-btn round class="orange white--text btn__orange btn__test"
               :class="{'btn--disabled': !finished}"
               :href="'/practice?date=' + today">读完了，去测试</v-btn>
      </div>
    </div>
    <div class="audio-wrap">
      <div class="audio-progress">
        <div class="audio-progress-point" v-bind:style="{ left: percent + '%' }"></div>
        <div class="audio-progress-line" v-bind:style="{ width: percent + '%' }"></div>
      </div>
      <audio ref="audio"
             @loadedmetadata="loadedmetadata" preload="metadata"></audio>
      <div class="audio-panel">
        <div>
          <div>Vitesse</div>
          <v-btn round fab :flat="speedType!=1" :outline="speedType==1" @click="speed(0.5, 1)">慢</v-btn>
          <v-btn round fab :flat="speedType!=2" :outline="speedType==2" @click="speed(1, 2)">常</v-btn>
          <v-btn round fab :flat="speedType!=3" :outline="speedType==3" @click="speed(1.6, 3)">快</v-btn>
        </div>
        <div>
          <span class="grey--text audio-current">{{currentTime}} / {{duration}}</span>
          <v-icon class="orange--text audio-icon" @click="play()" v-if="!isPlay">play_arrow</v-icon>
          <v-icon class="orange--text audio-icon" @click="pause()" v-if="isPlay">pause</v-icon>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
  import { bus } from '../bus.vue'
  import '../stylus/read.styl'
  var qs = require('querystringify');
  export default {
    created(){
      document.title = '今日阅读';
      this.handler = (data) => {
        this.paper = data.paper;
        this.tractate = this.paper && this.paper.tractate;
        this.semesterId = this.paper && this.paper.semesterId;
        this.statistical = data.statistical;
        this.initAudio();
      }
      bus.$on('done', this.handler)
//      let self = this;
//      wx.ready(function () {
//        self.initAudio();
//      });
    },
    destroyed(){
      bus.$off('done', this.handler)
      this.timer && clearInterval(this.timer)
    },
    mounted(){

    },
    data() {
      return {
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
          wx.getNetworkType({
            success: function (res) {
              var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
              self.$refs.audio.src = 'http://support.envol.vip' + self.paper.audio;
            }
          });
        }
      },
      loadedmetadata(e){
        this.audioRef = e.target;
        this.duration = this.formatTime(e.target.duration)
        this.timer = setInterval(()=>{
          this.currentTime = this.formatTime(this.audioRef.currentTime)
          this.percent = this.audioRef.currentTime / this.audioRef.duration * 100
          if(this.percent == 100){
            this.finished = true;
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
      }
    }
  }
</script>
