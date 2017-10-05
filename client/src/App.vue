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
  const extraPages = ['/appointment', '/test']
  export default {
    mounted(){
//      wx.ready(function(){
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
//        alert('ready')
//      });
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
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      $route(){
        this.currentPage = this.$router.currentRoute.path
        if(extraPages.indexOf(this.currentPage) >= 0){
          this.navHidden = true
        } else {
          this.navHidden = false
        }
      }
    }
//    watch:{

//      $route(){
//
//        wx.config({
//          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//          appId: 'wxe073c9d18b45b0ca', // 必填，公众号的唯一标识
//          timestamp: Date.now(), // 必填，生成签名的时间戳
//          nonceStr: 'ttp123', // 必填，生成签名的随机串
//          signature: '',// 必填，签名，见附录1
//          jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//        });
//
//      }

//    }
  }
</script>
