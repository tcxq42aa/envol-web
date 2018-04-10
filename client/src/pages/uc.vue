<template>
  <v-container fluid class="uc-container">
    <div class="card orange pa-4">
      <div></div>
      <v-avatar
        size="75px"
        class="grey uc-avatar mr-4"
      >
        <img :src="userInfo.headimgurl" alt="avatar">
      </v-avatar>
      <div class="white--text">
        <div class="uc-title">{{userInfo.nickname}}</div>
        <div class="uc-sm">已阅读 <span class="ml-4">{{wordsTotalStr}}字  {{statistical.length}}天</span></div>
        <div class="uc-sm mt-2">
          已解锁
          <span class="ml-4">
            <span class="uc-badge" :class="{'active': badge >= 1}">1</span>
            <span class="uc-badge" :class="{'active': badge >= 5}">5</span>
            <span class="uc-badge" :class="{'active': badge >= 10}">10</span>
          </span>
        </div>
      </div>
    </div>

    <div class="uc-block-wrap white--text">
      <div class="uc-block block-1" @click.stop="settingDialog=true">
      <!--<div class="uc-block block-1 is-disabled">-->
        <img src="../assets/group6@2x.png" width="70px" height="70px">
        <div class="f14 bold mb-1">阅读提醒设置</div>
        <div class="mb-2">每天</div>
        <!--<div class="mb-2">提醒功能暂未开启</div>-->
        <div class="remind-time f14">{{remindTime}}</div>
      </div>
      <div class="uc-block block-2"><a class="uc-link" :href="helpLink">
        <img src="../assets/group5Copy7@2x.png" width="70px" height="70px">
        <div class="f14 bold mb-1">常见问题</div>
        <div>使用方法、打卡、<br>活动等</div></a>
      </div>
      <div class="uc-block block-3" dark><a class="uc-link" :href="'/land?semesterId=' + semesterId">
        <img src="../assets/group5Copy5@2x.png" width="70px" height="70px">
        <div class="f14 bold mb-1">我要找督导老师</div>
        <div>特殊问题</div></a>
      </div>
      <router-link to="/badge">
        <div class="uc-block block-4">
          <img src="../assets/group5Copy6@2x.png" width="70px" height="70px">
          <div class="f14 bold mb-1">我的学习成就</div>
          <div>学习使我快乐</div>
        </div>
      </router-link>
    </div>
    <v-dialog v-model="dialog" >
      <v-card>
        <img src="../assets/vovo.jpg" width="100%">
      </v-card>
    </v-dialog>
    <v-dialog v-model="settingDialog">
      <v-card>
        <div class="setting-body">
          <div class="setting-box">:</div>
          <ul @scroll="handleHourScroll">
            <li v-for="h in hours" :class="{'is-active': hour==h}">{{h}}</li>
          </ul>
          <ul @scroll="handleMinuteScroll">
            <li v-for="m in minutes" :class="{'is-active': minute==m}">{{m}}</li>
          </ul>
        </div>
        <div class="dialog-footer">
          <div class="btn-cancel" @click="settingDialog=false">取消</div><div @click="handleRemindTime" class="btn-submit">确认</div>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import '../stylus/uc.styl'
  import { formatDate } from './util.vue'
  import { bus } from '../bus.vue'
  import axios from 'axios'
  export default {
    created(){
      let remindTime = localStorage.getItem('remindTime') || '09:00';
      this.hour = remindTime.split(':')[0];
      this.minute = remindTime.split(':')[1];
      document.title = '个人中心';
      this.handler = (data) => {
        this.paper = data.paper;
        this.tractate = this.paper && this.paper.tractate;
        this.semesterId = data.semester && data.semester.id;
        this.helpLink = data.semester && data.semester.faq;
        this.statistical = data.statistical;

//        let max = 0;
//        let current = 0;
//        let statistical = this.statistical;
//        let len = statistical.length;
//        for(let i = 0; i < len; i++){
//          if(i > 0) {
//            let l = new Date(statistical[i - 1].readToday);
//            l.setDate(l.getDate() + 1);
//            if(formatDate(l) == formatDate(statistical[i].readToday)) {
//              current++;
//              if(current > max) {
//                max = current;
//              }
//            } else {
//              current = 1;
//            }
//          } else {
//            current = 1;
//            max = 1;
//          }
//        }
//        this.badge = max;
        this.badge = this.statistical.length;
      }
      bus.$on('done', this.handler)
      bus.$once('needTest', this.handleRedirect.bind(this))
    },
    destroyed(){
      bus.$off('done', this.handler)
    },
    mounted() {
      console.log(this.hour, this.minute);
    },
    data() {
      return {
        semesterId: '',
        dialog:false,
        settingDialog:false,
        userInfo: userInfo || {},
        modal2: false,
        statistical: [],
        badge: 0,
        helpLink: '',
        hours: ['','','00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','',''],
        minutes: ['', '', '00','05','10','15','20','25','30','35','40','45','50','55', '', ''],
        hour: '',
        minute: ''
      }
    },
    methods: {
      handleRedirect(){
        this.$router.replace('/testLand')
      },
      save(e){
      },
      handleRemindTime() {
        let h = this.hour;
        let m = this.minute;
        let time = h + ':' + m;
        localStorage.setItem('remindTime', time)
        let differenceMinute = (new Date()).getTimezoneOffset()
        axios.put(`/api/user/setting?reminderHour=${h}&reminderMinute=${m}&differenceMinute=${differenceMinute}`)
        this.settingDialog = false;
      },
      handleHourScroll(e) {
        let t = Math.round(e.target.scrollTop / 28);
        if(t < 10) {
          t = '0' + t;
        }
        this.hour = t;
      },
      handleMinuteScroll(e) {
        let t = Math.round(e.target.scrollTop / 28) * 5;
        if(t < 10) {
          t = '0' + t;
        }
        this.minute = t;
      },
      noop(){}
    },
    watch:{

    },
    computed: {
      remindTime() {
        let h = this.hour;
        let m = this.minute;
        return h + ':' + m;
      },
      wordsTotalStr(){
        return this.statistical.map(function(item) { return item.wordsTotal}).reduceRight(function(a,b){return (a+b)}, 0)
      }
    }
  }
</script>
