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
        <div class="uc-sm">已阅读 <span class="ml-3">1,000字  10天</span></div>
        <div class="uc-sm">
          已解锁
          <v-icon class="white--text ml-3">star</v-icon>
          <v-icon class="white--text opacity-3">star</v-icon>
          <v-icon class="white--text opacity-3">star</v-icon>
        </div>
      </div>
    </div>

    <div class="uc-block-wrap white--text">
      <div class="uc-block block-1">
        <v-icon class="white--text opacity-6">alarm</v-icon>
        <div>阅读提醒设置</div>
        <div>每天</div>
      </div><div class="uc-block block-2">
        <v-icon class="white--text opacity-6">alarm</v-icon>
        <div>常见问题</div>
        <div>使用方法、打卡、<br>活动等</div>
      </div><div class="uc-block block-3">
        <v-icon class="white--text opacity-6">alarm</v-icon>
        <div>我要找督导老师</div>
        <div>特殊问题</div>
      </div><div class="uc-block block-4">
        <v-icon class="white--text opacity-6">alarm</v-icon>
        <div>晒学习成果</div>
        <div>学习使我快乐</div>
      </div>
    </div>
  </v-container>
</template>

<script>
  import '../stylus/uc.styl'
  export default {
    data() {
      return {
        userInfo: userInfo || {}
      }
    }
  }
</script>
