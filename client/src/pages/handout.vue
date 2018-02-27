<template>
  <div class="handout-container">
    <div v-html="handout"></div>
    <div v-html="handoutDesc"></div>
  </div>
</template>
<script>
  import '../stylus/content.styl'
  import '../stylus/handout.styl'
  import { bus } from '../bus.vue'
  import { formatDate } from './util.vue'
  var qs = require('querystringify');

  export default {
    created(){
      document.title = '今日讲义'
      this.handler = (data) => {
        this.paper = data.paper;
        if(this.paper){
          this.handout = this.paper.handout;
          var t1 = new Date(data.paper.readToday);
          var t2 = new Date(parseInt(serverTimeStamp, 10));
          t1.setHours(21); //21点显示讲义解释
          if(t2 >= t1) {
            this.handoutDesc = this.paper.handoutDesc;
          }
        }
      }
      bus.$on('done', this.handler)
    },
    destroyed(){
      bus.$off('done', this.handler)
    },
    data() {
      return {
        handout: '',
        handoutDesc: ''
      }
    }
  }
</script>
