<template>
  <v-container :class="{'orange': !showResult, 'test-container': !showResult}">
    <div class="test-list"
         v-if="!showResult"
         :style="{transform: 'translateX(-' + 95 * current + '%)'}">
      <div class="test-card" v-for="(test, index) in data">
        <div class="test-tag">{{index + 1}}/{{data.length}}</div>
        <ul class="qa-answers" v-if="test.type == 2">
          <li v-for="(answer, idx) in test.options">
            <v-btn small class="primary">{{answer.content}}</v-btn>
          </li>
        </ul>
        <div class="test-title" v-html="test.title"></div>
        <ul class="test-detail" v-if="test.type != 2">
          <li @click="select(test, index, idx)"
              :class="{active: test.testIdx == idx}"
              v-for="(answer, idx) in test.options">{{answer.content}}</li>
        </ul>
        <div class="btn__next-wrap">
          <v-btn :disabled="test.testIdx == -1" round class="orange white--text btn__orange btn__next" @click="next()">{{current == data.length - 1 ? '完成测试' : '下一题'}}</v-btn>
        </div>
      </div>
    </div>

    <div v-if="showResult" >
      <div class="card orange test-result-wrap pa-3 mb-3">
        <div>太棒了，<br>你完成了今天的阅读任务！</div>
        <div>
          <div>正确率</div>
          <div class="result-percent">{{testResult}}</div>
        </div>
      </div>
      <div class="card result-card mb-3">
        <div class="test-tag">{{todayStr}}</div>
        <ul class="test-detail">
          <li class="result-item"
              v-for="(test, index) in data">
            <div>0{{index + 1}}</div>
            <div>
              <v-icon v-if="test.isCorrect" class="orange--text">check</v-icon>
              <v-icon v-if="!test.isCorrect" class="black--text">close</v-icon>
            </div>
          </li>
        </ul>
      </div>

      <div class="card pa-3 mb-3 dis-flex">
        <div class="bl-orange">
          <div class="grey--text">今日已读</div>
          <div class="f18 mt-2">{{todayWordsTotal}}字</div>
        </div>
        <div class="bl-orange">
          <div class="grey--text">全部已读</div>
          <div class="f18 mt-2">{{wordsTotal}}字</div>
        </div>
      </div>
      <div class="card pa-3 mb-3">
        <div class="subheading mb-4">今日解析</div>
        <div v-html="lexicalAnalysis"></div>
      </div>
      <div class="orange btn-share">分享到朋友圈，完成打卡</div>
    </div>
  </v-container>
</template>

<script>
  import '../stylus/practice.styl'
  import { bus } from '../bus.vue'
  import { todayStr } from './util.vue'
  import axios from 'axios'
  export default {
    created(){
      document.title = '小试牛刀'
      this.handler = (data) => {
        this.paper = data.paper;
        if(this.paper){
          this.tractate = this.paper.tractate;
          this.data = JSON.parse(this.paper.content);
          this.lexicalAnalysis = this.paper.lexicalAnalysis;
          this.todayWordsTotal = this.paper.wordsTotal;
        }
        this.statistical = data.statistical;
        this.wordsTotal = this.statistical.map(i => i.wordsTotal).reduceRight((a, b)=>{
          return a + b
        }, 0)
      }
      bus.$on('done', this.handler)
    },
    destroyed(){
      bus.$off('done', this.handler)
    },
    data() {
      return {
        todayStr: todayStr(),
        showResult: false,
        current: 0,
        testResult: '',
        data: []
      }
    },
    methods: {
      next(){
        if(this.current < this.data.length - 1) {
          this.current = this.current + 1
        } else {
          this.finishTest()
        }
      },
      choose() {
        alert('choose')
      },
      finishTest(){
        this.data = this.data.map(test => {
          if(test.type == '1') {
            test.isCorrect = (test.answer === test.testIdx)
          }
          if(test.type == '2') {
            test.isCorrect = (test.answer === test.testIdx)
          }
          return test
        })
        let correntCnt = this.data.filter(test => {
          if(test.type == '1') {
            return test.isCorrect
          }
          if(test.type == '2') {
            return test.isCorrect
          }
        }).length
        let level1 = this.data.filter( test => test.level == '1' && test.isCorrect);
        let level2 = this.data.filter( test => test.level == '2' && test.isCorrect);
        let level3 = this.data.filter( test => test.level == '3' && test.isCorrect);
        let level4 = this.data.filter( test => test.level == '4' && test.isCorrect);
        this.testResult = Math.round(correntCnt / this.data.length * 100) + '%'
        this.showResult = true
        this.level1Result = level1;
        this.level2Result = level2;
        this.level3Result = level3;
        this.level4Result = level4;
        axios.post('/api/user/course/' + this.paper.paperId + '/save?wordsTotal=' + this.paper.wordsTotal + 'score=' + Math.round(correntCnt / this.data.length * 100))
      },
      select(item, index, idx) {
        item.testIdx = idx
        this.$set(this.data, index, item)
      }
    }
  }
</script>
