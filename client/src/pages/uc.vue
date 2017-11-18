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
        <div class="uc-sm">已阅读 <span class="ml-3">{{wordsTotalStr}}字  {{statistical.length}}天</span></div>
        <!--<div class="uc-sm">-->
          <!--已解锁-->
          <!--<v-icon class="white&#45;&#45;text ml-3">star</v-icon>-->
          <!--<v-icon class="white&#45;&#45;text opacity-3">star</v-icon>-->
          <!--<v-icon class="white&#45;&#45;text opacity-3">star</v-icon>-->
        <!--</div>-->
      </div>
    </div>

    <div class="uc-block-wrap white--text">
      <div class="uc-block block-1">
        <v-dialog
          persistent
          v-model="modal2"
          lazy
        >
          <div slot="activator" v-model="remindTime">
            <img src="../assets/group6@2x.png" width="70px" height="70px">
            <div class="f14 bold mb-1">阅读提醒设置</div>
            <div class="mb-2">每天</div>
            <div class="remind-time f14">{{remindTime}}</div>
          </div>
          <v-time-picker v-model="remindTime" actions format="24hr">
            <template scope="{ save, cancel }">
              <v-card-actions>
                <v-btn flat primary @click.native="cancel()">取消</v-btn>
                <v-btn flat primary @click.native="save()">确定</v-btn>
              </v-card-actions>
            </template>
          </v-time-picker>
        </v-dialog>
      </div><div class="uc-block block-2">
        <img src="../assets/group5Copy7@2x.png" width="70px" height="70px">
        <div class="f14 bold mb-1">常见问题</div>
        <div>使用方法、打卡、<br>活动等</div>
      </div>
        <div class="uc-block block-3" dark @click.stop="dialog=true">
          <img src="../assets/group5Copy5@2x.png" width="70px" height="70px">
          <div class="f14 bold mb-1">我要找督导老师</div>
          <div>特殊问题</div>
        </div>
      <div class="uc-block block-4">
        <img src="../assets/group5Copy6@2x.png" width="70px" height="70px">
        <div class="f14 bold mb-1">晒学习成果</div>
        <div>学习使我快乐</div>
      </div>
    </div>
    <v-dialog v-model="dialog" >
      <v-card class="pa-4">
        <img src="../assets/qrcode.png" width="100%">
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import '../stylus/uc.styl'
  import { bus } from '../bus.vue'
  import axios from 'axios'
  export default {
    created(){
      document.title = '个人中心';
      this.handler = (data) => {
        this.paper = data.paper;
        this.tractate = this.paper && this.paper.tractate;
        this.semesterId = this.paper && this.paper.semesterId;
        this.statistical = data.statistical;
      }
      bus.$on('done', this.handler)
      bus.$once('needTest', this.handleRedirect.bind(this))
    },
    destroyed(){
      bus.$off('done', this.handler)
    },
    data() {
      return {
        dialog:false,
        userInfo: userInfo || {},
        remindTime: localStorage.getItem('remindTime'),
        modal2: false,
        statistical: []
      }
    },
    methods: {
      handleRedirect(){
        this.$router.replace('/testLand')
      },
      save(e){
        console.log(e)
      }
    },
    watch:{
      remindTime:function (val) {
        localStorage.setItem('remindTime', val)
        let [reminderHour, reminderMinute] = val.split(':')
        let differenceMinute = (new Date()).getTimezoneOffset()
        axios.put(`/api/user/setting?reminderHour=${reminderHour}&reminderMinute=${reminderMinute}&differenceMinute=${differenceMinute}`)
      }
    },
    computed: {
      wordsTotalStr(){
        return this.statistical.map(function(item) { return item.wordsTotal}).reduceRight(function(a,b){return (a+b)}, 0)
      }
    }
  }
</script>
