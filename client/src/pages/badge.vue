<template>
  <v-container class="orange">
    <div class="card badge-card" v-if="ready">
      <div class="badge-header">
        <div class="badge-line"></div>
        <span>已解锁</span>
        <div class="badge-line"></div>
      </div>
      <div class="badge-body">
          <div class="badge-item" v-if="days >= 1">
            <img src="../assets/badge/badge1@2x.png" width="60px" height="60px">
            <p>第一次打卡</p>
          </div>
          <div class="badge-item" v-if="days >= 5">
            <img src="../assets/badge/badge2@2x.png" width="60px" height="60px">
            <p>连续 5 天</p>
          </div>
          <div class="badge-item" v-if="days >= 10">
            <img src="../assets/badge/badge3@2x.png" width="60px" height="60px">
            <p>连续 10 天</p>
          </div>
          <div class="badge-item" v-if="days >= 15">
            <img src="../assets/badge/badge4@2x.png" width="60px" height="60px">
            <p>连续 15 天</p>
          </div>
          <div class="badge-item" v-if="days >= 21">
            <img src="../assets/badge/badge5@2x.png" width="60px" height="60px">
            <p>连续 21 天</p>
          </div>
          <div class="badge-item" v-if="days >= 30">
            <img src="../assets/badge/badge6@2x.png" width="60px" height="60px">
            <p>连续 30 天</p>
          </div>
          <div class="badge-item" v-if="days >= 50">
            <img src="../assets/badge/badge7@2x.png" width="60px" height="60px">
            <p>连续 50 天</p>
          </div>
          <div class="badge-item" v-if="days >= 70">
            <img src="../assets/badge/badge8@2x.png" width="60px" height="60px">
            <p>连续 70 天</p>
          </div>
          <div class="badge-item" v-if="days >= 90">
            <img src="../assets/badge/badge9@2x.png" width="60px" height="60px">
            <p>连续 90 天</p>
          </div>
        </div>

      <div class="badge-header">
        <div class="badge-line"></div>
        <span>待解锁</span>
        <div class="badge-line"></div>
      </div>
      <div class="badge-body">
        <div class="badge-item" v-if="days < 1" >
          <img src="../assets/badge/badge1-dark@2x.png" width="60px" height="60px">
          <p>第一次打卡</p>
        </div>
        <div class="badge-item" v-if="days < 5">
          <img src="../assets/badge/badge2-dark@2x.png" width="60px" height="60px">
          <p>连续 5 天</p>
        </div>
        <div class="badge-item" v-if="days < 10">
          <img src="../assets/badge/badge3-dark@2x.png" width="60px" height="60px">
          <p>连续 10 天</p>
        </div>
        <div class="badge-item" v-if="days < 15">
          <img src="../assets/badge/badge4-dark@2x.png" width="60px" height="60px">
          <p>连续 15 天</p>
        </div>
        <div class="badge-item" v-if="days < 21">
          <img src="../assets/badge/badge5-dark@2x.png" width="60px" height="60px">
          <p>连续 21 天</p>
        </div>
        <div class="badge-item" v-if="days < 30">
          <img src="../assets/badge/badge6-dark@2x.png" width="60px" height="60px">
          <p>连续 30 天</p>
        </div>
        <div class="badge-item" v-if="days < 50">
          <img src="../assets/badge/badge7-dark@2x.png" width="60px" height="60px">
          <p>连续 50 天</p>
        </div>
        <div class="badge-item" v-if="days < 70">
          <img src="../assets/badge/badge8-dark@2x.png" width="60px" height="60px">
          <p>连续 70 天</p>
        </div>
        <div class="badge-item" v-if="days < 90">
          <img src="../assets/badge/badge9-dark@2x.png" width="60px" height="60px">
          <p>连续 90 天</p>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
  import '../stylus/badge.styl';
  import { bus } from '../bus.vue'

  export default {
    created(){
      document.title = '今日测试'
      this.handler = (data) => {
        this.ready = true;
        this.days = data.statistical ? data.statistical.length : 0;
      }
      bus.$on('done', this.handler)
    },
    destroyed(){
      bus.$off('done', this.handler)
    },
    data() {
      return {
        ready: false,
        days: 0,
        showBadge: false,
        badgeName: '',
        badgeImgMap: {
          '1': require('../assets/badge/badge1@2x.png'),
          '5': require('../assets/badge/badge2@2x.png'),
          '10': require('../assets/badge/badge3@2x.png'),
          '15': require('../assets/badge/badge4@2x.png'),
          '21': require('../assets/badge/badge5@2x.png'),
          '30': require('../assets/badge/badge6@2x.png'),
          '50': require('../assets/badge/badge7@2x.png'),
          '70': require('../assets/badge/badge8@2x.png'),
          '90': require('../assets/badge/badge9@2x.png')
        }
      }
    }
  }
</script>
