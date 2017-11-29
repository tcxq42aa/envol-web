<template>
  <div class="handout-container" v-html="handout"></div>
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
        }
      }
      bus.$on('done', this.handler)
    },
    destroyed(){
      bus.$off('done', this.handler)
    },
    data() {
      return {
        handout: ''
      }
    }
  }
</script>
