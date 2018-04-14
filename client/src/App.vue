<template>
  <v-app light>
    <main>
      <router-view></router-view>
    </main>
    <v-bottom-nav v-if="!navHidden" :value="true" :active.sync="currentPage" class="white">
      <v-btn flat class="orange--text" value="/index" @click="switchTab('/index')">
        <span>阅读首页</span>
        <img v-if="currentPage!='/index'" src="./assets/home4@2x.png" height="25px"/>
        <img v-if="currentPage=='/index'" src="./assets/home2@2x.png" height="25px"/>
      </v-btn>
      <v-btn flat class="orange--text" value="/plan" @click="switchTab('/plan')">
        <span>阅读计划</span>
        <img v-if="currentPage!='/plan'" src="./assets/plan4@2x.png" height="25px"/>
        <img v-if="currentPage=='/plan'" src="./assets/plan3@2x.png" height="25px"/>
      </v-btn>
      <v-btn flat class="orange--text" value="/uc" @click="switchTab('/uc')">
        <span>个人中心</span>
        <img v-if="currentPage!='/uc'" src="./assets/personal4@2x.png" height="25px"/>
        <img v-if="currentPage=='/uc'" src="./assets/personal3@2x.png" height="25px"/>
      </v-btn>
    </v-bottom-nav>
  </v-app>
</template>

<script>
  import { bus } from './bus.vue'
  import { signature, check } from './service/user'
  import {formatDate} from './pages/util.vue'
  import axios from 'axios'
  var qs = require('querystringify');
  const extraPages = [
    '/appointment', '/test','/practice',
    '/practiceShare', '/testLand', '/testShare', '/overdue',
    '/read', '/review', '/paid', '/badge', '/wordList', '/handout', '/mailBox', '/land'
  ]
  export default {
    created(){
      this.code = qs.parse(location.search).code || '';
      this.state = qs.parse(location.search).state || '';
      this.test = qs.parse(location.search).test || '';
      if(this.test) {
        var vConsole = new VConsole();
      }
//      this.initData();
    },
    mounted(){
      wx.ready(function(){
//         config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        console.log('call wx.ready');
      });
      wx.error(function(err){
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
//        alert(JSON.stringify(err));
        console.log(err)
      });
    },
    data () {
      return {
        code: '',
        state: '',
        navHidden: false,
        currentPage: '/index',
//        snackbar: true,
//        y: 'top',
//        x: null,
//        mode: '',
//        timeout: 5000,
//        text: '你好，今日没有课程哦'
      }
    },
    computed: {
      today() {
        return qs.parse(location.search).date || ''
      }
    },
    methods: {
      switchTab(e) {
        if(e=='/uc'){
          window.location.href = e + '?date=' + this.today + '&test=' + this.test;
        }else{
          this.$router.replace(e + '?date=' + this.today + '&test=' + this.test + '&code=' + this.code + '&state=' + this.state)
        }
      },
      refreshSignature(){
        signature(encodeURIComponent(location.href.split('#')[0])).then(function(res){
          var data = res.data;
          wx.config({
            debug: qs.parse(location.search).debug || false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wxe073c9d18b45b0ca', // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名，见附录1
            jsApiList: ['chooseWXPay', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'getNetworkType'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          console.log('call wx.config');
        })
      },
      initData() {
        let storageKey = 'today_' + formatDate(new Date(serverTime).getTime());
//        Object.keys(localStorage).filter( key => key.indexOf('today_') === 0).forEach(key => {
//          if(key !== storageKey) {
//            localStorage.removeItem(key);
//          }
//        });

//        if(this.currentPage !== '/read' && this.currentPage !== '/practice') {
//          if(localStorage.getItem(storageKey)){
//            let data = JSON.parse(localStorage.getItem(storageKey));
//            this.appData = data
//            setTimeout(()=>{
//              bus.$emit("done", this.appData);
//              if(this.appData.semester.id) {
//                check(this.appData.semester.id).then( res => {
//                  this.hasTested = res.data.test;
//                  bus.$emit("checked", res.data);
//                })
//              }
//            });
//            return;
//          }
//        }

        let date = qs.parse(location.search).date || formatDate(new Date(serverTime).getTime());
        let semesterId = qs.parse(location.search).semesterId;
        let url = '/api/user/today?readToday=' + date;
        if(semesterId) {
          url = url + '&semesterId=' + semesterId;
        }
        axios.post(url).then((response) => {
          this.appData = response.data.data
          bus.$emit("done", this.appData);
          if(this.appData.semester && this.appData.semester.id) {
//            localStorage.setItem(storageKey, JSON.stringify(this.appData));
            check(this.appData.semester.id).then( res => {
              this.hasTested = res.data.test;
              bus.$emit("checked", res.data);
            })
          }
        }).catch((error) => {
          if(error.response) {
            let res = error.response
            if(res.status == 404 && res.data.code == 4042) {
              this.needTest = true
              bus.$emit("needTest", true);
            }
          }
        });
      }
    },
    watch:{
      $route(){
        this.currentPage = this.$router.currentRoute.path
        if(extraPages.indexOf(this.currentPage) >= 0){
          this.navHidden = true
        } else {
          this.navHidden = false
        }
//        setTimeout(()=>{
//          this.appData && bus.$emit("done", this.appData);
//          if(this.needTest == true) {
//            bus.$emit("needTest", true);
//          }
//        })
        let skipInitDataPages = ['/appointment', '/practiceShare', '/test', '/testShare'];
        if(skipInitDataPages.indexOf(this.currentPage) < 0) {
          this.initData();
        }
        this.refreshSignature()
      }
    }
  }
</script>
