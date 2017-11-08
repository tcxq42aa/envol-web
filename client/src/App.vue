<template>
  <v-app light>
    <main>
      <router-view></router-view>
    </main>
    <v-bottom-nav v-if="!navHidden" :value="true" :active.sync="currentPage" class="white">
      <v-btn flat class="orange--text" value="/index" @click="switchTab('/index')">
        <span>阅读首页</span>
        <v-icon>home</v-icon>
      </v-btn>
      <v-btn flat class="orange--text" value="/plan" @click="switchTab('/plan')">
        <span>阅读计划</span>
        <v-icon>date_range</v-icon>
      </v-btn>
      <v-btn flat class="orange--text" value="/uc" @click="switchTab('/uc')">
        <span>个人中心</span>
        <v-icon>person_outline</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-app>
</template>

<script>
  import { signature } from './service/user'
  import axios from 'axios'
  const extraPages = ['/appointment', '/test','/practice', '/testLand', '/read']
  export default {
    mounted(){
      wx.ready(function(res){
//         config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
//        alert('ready')
        console.log(res)
      });
      wx.error(function(err){
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
//        alert('error')
        console.log(err)
      });
    },
    data () {
      return {
        navHidden: false,
        currentPage: '/index'
      }
    },
    methods: {
      switchTab(e) {
        this.$router.replace(e)
      },
      refreshSignature(){
        signature(location.href.split('#')[0]).then(function(res){
          var data = res.data;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wxe073c9d18b45b0ca', // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名，见附录1
            jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
        })
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
        this.refreshSignature()
      }

    }
  }
</script>
