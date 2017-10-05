<template>
  <v-container :class="{'orange': !showResult, 'test-container': !showResult}">
    <div class="test-list"
         v-if="!showResult"
         :style="{transform: 'translateX(-' + 95 * current + '%)'}">
      <div class="test-card" v-for="(test, index) in data">
        <div class="test-tag">{{index + 1}}/{{data.length}}</div>
        <div class="test-title">What was the sugge....</div>
        <ul class="test-detail">
          <li @click="test.testIdx = idx"
              :class="{active: test.testIdx == idx}"
              v-for="(answer, idx) in test.answers">{{answer}}</li>
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
        <div class="test-tag">Jour 30</div>
        <ul class="test-detail">
          <li class="result-item"
              v-for="(test, index) in data">
            <div>0{{index + 1}}</div>
            <div>
              <v-icon v-if="test.testIdx == test.correctIdx" class="orange--text">check</v-icon>
              <v-icon v-if="test.testIdx != test.correctIdx" class="black--text">close</v-icon>
            </div>
          </li>
        </ul>
      </div>

      <div class="card pa-3 mb-3 dis-flex">
        <div class="bl-orange">
          <div class="grey--text">今日已读</div>
          <div class="f18 mt-2">2000字</div>
        </div>
        <div class="bl-orange">
          <div class="grey--text">全部已读</div>
          <div class="f18 mt-2">12340字</div>
        </div>
      </div>
      <div class="card pa-3 mb-3 dis-flex">
        <div class="subheading">今日解析</div>
      </div>
      <div class="orange btn-share">分享到朋友圈，完成打卡</div>
    </div>
  </v-container>
</template>

<script>
  import '../stylus/test.styl'
  export default {
    created(){
      document.title = '小试牛刀'
    },
    data() {
      return {
        showResult: false,
        current: 0,
        testResult: '',
        data: [
          {title: 'test1 balabala...', answers: ['answers1...', 'answers2...', 'answers3...'], correctIdx: 2, testIdx: -1},
          {title: 'test2 balabala...', answers: ['answers1...', 'answers2...', 'answers3...'], correctIdx: 2, testIdx: -1},
          {title: 'test3 balabala...', answers: ['answers1...', 'answers2...', 'answers3...'], correctIdx: 2, testIdx: -1},
          {title: 'test4 balabala...', answers: ['answers1...', 'answers2...', 'answers3...'], correctIdx: 2, testIdx: -1},
          {title: 'test5 balabala...', answers: ['answers1...', 'answers2...', 'answers3...'], correctIdx: 2, testIdx: -1},
        ]
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
      finishTest(){
        console.log(this.data)
        let correntCnt = this.data.filter(test => {
          return test.correctIdx === test.testIdx
        }).length
        this.testResult = Math.round(correntCnt / this.data.length * 100) + '%'
        this.showResult = true
      }
    }
  }
</script>
