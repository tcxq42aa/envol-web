<template>
  <v-container :class="{'orange': !showResult, 'test-container': !showResult}">
    <div class="test-list"
         v-if="!showResult"
         :style="{transform: 'translateX(-' + 95 * current + '%)'}">
      <div class="test-card" v-for="(test, index) in data">
        <div class="test-tag">{{index + 1}}/{{data.length}}</div>
        <div class="test-title">{{test.title}}</div>
        <ul class="test-detail">
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
        <div>
          <p>N1: 答对{{level1Result.length}}题</p>
          <p>N2: 答对{{level2Result.length}}题</p>
          <p>N3: 答对{{level3Result.length}}题</p>
          <p>N4: 答对{{level4Result.length}}题</p>
        </div>
        <div>
          <div>正确率</div>
          <div class="result-percent">{{testResult}}</div>
        </div>
      </div>
      <div class="btn__next-wrap">
        <v-btn round class="orange white--text btn__orange btn__next">立即报名</v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
  import '../stylus/test.styl'
  import axios from 'axios'
  export default {
    created(){
      document.title = '小试牛刀'
      axios.get('/api/evaluation/detail')
        .then((response) => {
          this.evaluationId = response.data.id;
          this.data = JSON.parse(response.data.content)
        })
        .catch((error) => {
          console.log(error);
        });
    },
    data() {
      return {
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
      finishTest(){
        let correntCnt = this.data.filter(test => {
          if(test.type == '1') {
            return test.answer === test.testIdx
          }
          if(test.type == '2') {
            return test.answer === test.testIdx
          }
        }).length
        let level1 = this.data.filter( test => test.level == '1' && test.answer === test.testIdx);
        let level2 = this.data.filter( test => test.level == '2' && test.answer === test.testIdx);
        let level3 = this.data.filter( test => test.level == '3' && test.answer === test.testIdx);
        let level4 = this.data.filter( test => test.level == '4' && test.answer === test.testIdx);
        this.testResult = Math.round(correntCnt / this.data.length * 100) + '%'
        this.showResult = true
        this.level1Result = level1;
        this.level2Result = level2;
        this.level3Result = level3;
        this.level4Result = level4;
        axios.post('/api/user/evaluation/' + evaluationId + '/save')
      },
      select(item, index, idx) {
        item.testIdx = idx
        this.$set(this.data, index, item)
      }
    }
  }
</script>
