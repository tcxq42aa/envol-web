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
    mounted() {
      wx.ready(function(){
          wx.hideMenuItems({
            menuList: [
              'menuItem:share:appMessage',
              'menuItem:share:timeline',
              'menuItem:share:qq',
              'menuItem:share:weiboApp',
              'menuItem:favorite',
              'menuItem:share:facebook',
              'menuItem:share:QZone',
              'menuItem:copyUrl',
              'menuItem:openWithQQBrowser',
              'menuItem:openWithSafari',
              'menuItem:share:email',
            ], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
            success:function(res){
              alert("隐藏");
            }
          });
      });
    },
    created(){
      document.title = '今日讲义'
      this.handler = (data) => {
        this.paper = data.paper;
        if(this.paper){
          this.handout = this.paper.handout.replace(/&nbsp;/g, ' ');
          var t1 = new Date(data.paper.readToday);
          var t2 = new Date(parseInt(serverTimeStamp, 10));
          t1.setHours(21); //21点显示讲义解释
          if(t2 >= t1) {
            var reg = /(<iframe[^>]+src=")https?:\/\/([^"]+)("[^>]+><\/iframe>)/g;
            this.handoutDesc = this.paper.handoutDesc.replace(reg, function(a0,a1,a2,a3,a4){
              return a1+"//"+a2+a3
            }).replace(/&nbsp;/g, ' ')
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
