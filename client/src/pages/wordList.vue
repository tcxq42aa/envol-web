<template>
  <v-container class="orange test-container">
    <div v-if="wordListArray.length > 0" class="test-list" :style="{transform: 'translateX(-' + 95 * current + '%)'}">
      <div class="test-card" v-for="(item, index) in wordListArray" @touchmove="handleMove" @touchstart="handleStart" @touchend="handleEnd">
        <div class="test-tag">{{todayStr(item.readToday)}}</div>
        <ul class="test-detail">
          <li v-for="(word, index) in JSON.parse(item.wordList)">
            <div class="text">{{word.text}}</div>
            <div class="comment">{{word.comment}}</div>
          </li>
        </ul>
      </div>
    </div>
  </v-container>
</template>
<script>
  import '../stylus/test.styl';
  import { formatDate, todayStr } from './util.vue'
  import { bus } from '../bus.vue'
  import { check, getWordList } from '../service/user'
  import axios from 'axios'

  export default {
    created(){
      document.title = '今日词表'
      this.handler = (data) => {
        this.paper = data.paper;
        this.semester = data.semester;
//        if(this.paper){
//          console.log(11,this.paper.wordList);
//          this.wordList = JSON.parse(this.paper.wordList);
//        }
//        console.log(data.semester);
      }
      bus.$on('done', this.handler)
      bus.$on('checked', (res)=>{
        console.log(res);
        if(res.grade) {
          getWordList({
            semesterId: this.semester.id,
            grade: res.grade
          }).then(data => {
            this.wordListArray = data.data.reverse();
            this.current = data.data.length - 1;
          });
        }
      })
    },
    destroyed(){
      bus.$off('done', this.handler)
      bus.$off('checked', this.handler)
    },
    data() {
      return {
        wordListArray: [],
        current: 0,
        x1: 0,
        x2: 0,
        todayStr: todayStr
      };
    },
    methods: {
      prev() {
        if(this.current > 0) {
          this.current = this.current - 1
        }
        window.scrollTo(0, 0);
      },
      next() {
        if(this.current < this.wordListArray.length -1) {
          this.current = this.current + 1
        }
        window.scrollTo(0, 0);
      },
      handleStart(e) {
        this.x1 = e.touches[0].clientX;
      },
      handleEnd(e) {
        console.log(this.x1 - this.x2);
        if(this.x1 - this.x2 > 30) {
          this.next();
        }
        if(this.x1 - this.x2 < -30) {
          this.prev();
        }
      },
      handleMove(e) {
        this.x2 = e.touches[0].clientX;
      }
    }
  };
</script>
<style>
  .test-list {
    margin-left: 0;
    margin-right: 0;
  }
</style>
