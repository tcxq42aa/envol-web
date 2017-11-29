<template>
  <v-container class="orange test-container">
    <div class="test-list">
      <div class="test-card word-list-card">
        <div class="test-tag">{{todayStr}}</div>
        <ul class="test-detail">
          <li v-for="(word, index) in wordList">
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
  import { todayStr } from './util.vue'
  import { bus } from '../bus.vue'
  import { check } from '../service/user'
  import axios from 'axios'

  export default {
    created(){
      document.title = '今日词表'
      this.handler = (data) => {
        this.paper = data.paper;
        if(this.paper){
          this.wordList = JSON.parse(this.paper.wordList);
        }
        console.log(this.wordList);
      }
      bus.$on('done', this.handler)
    },
    destroyed(){
      bus.$off('done', this.handler)
    },
    data() {
      return {
        wordList: [],
        current: 0,
        todayStr: todayStr()
      };
    }
  };
</script>
<style>

</style>
