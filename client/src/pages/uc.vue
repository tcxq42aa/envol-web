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
        <v-dialog
          persistent
          v-model="modal2"
          lazy
        >
          <div slot="activator" v-model="e6">
            <v-icon class="white--text opacity-6">alarm</v-icon>
            <div>阅读提醒设置</div>
            <div>每天</div>
          </div>
          <v-time-picker v-model="e6" actions>
            <template scope="{ save, cancel }">
              <v-card-actions>
                <v-btn flat primary @click.native="cancel()">取消</v-btn>
                <v-btn flat primary @click.native="save()">确定</v-btn>
              </v-card-actions>
            </template>
          </v-time-picker>
        </v-dialog>
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
  import { bus } from '../bus.vue'
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
        userInfo: userInfo || {},
        e6: null,
        modal2: false,
      }
    },
    methods: {
      handleRedirect(){
        this.$router.replace('/testLand')
      }
    }
  }
</script>
