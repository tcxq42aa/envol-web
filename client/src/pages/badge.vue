<template>
  <v-container class="orange">
    <div class="card badge-card">
      <div class="badge-header">
        <div class="badge-line"></div>
        <span>已解锁</span>
        <div class="badge-line"></div>
      </div>
      <div class="badge-body">
        <div class="badge-item">
          <img src="../assets/badge/badge1@2x.png" width="60px" height="60px">
          <p>第一次打卡</p>
        </div>
        <div class="badge-item">
          <img src="../assets/badge/badge2@2x.png" width="60px" height="60px">
          <p>连续 5 天</p>
        </div>
        <div class="badge-item">
          <img src="../assets/badge/badge3@2x.png" width="60px" height="60px">
          <p>连续 10 天</p>
        </div>
      </div>
      <div class="badge-body">
        <div class="badge-item">
          <img src="../assets/badge/badge1-dark@2x.png" width="60px" height="60px">
          <p>连续 15 天</p>
        </div>
        <div class="badge-item">
          <img src="../assets/badge/badge2-dark@2x.png" width="60px" height="60px">
          <p>连续 21 天</p>
        </div>
        <div class="badge-item">
          <img src="../assets/badge/badge3-dark@2x.png" width="60px" height="60px">
          <p>连续 30 天</p>
        </div>
      </div>
      <div class="badge-header">
        <div class="badge-line"></div>
        <span>待解锁</span>
        <div class="badge-line"></div>
      </div>
    </div>
  </v-container>
</template>

<script>
  import '../stylus/badge.styl';

  export default {

  }
</script>
