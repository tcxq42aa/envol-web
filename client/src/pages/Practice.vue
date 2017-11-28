<template>
  <v-container :class="{'orange': !showResult, 'test-container': !showResult}">
    <div class="test-list"
         v-if="!showResult"
         :style="{transform: 'translateX(-' + 95 * current + '%)'}">
      <div class="test-card" v-for="(test, index) in data">
        <div class="test-tag">{{index + 1}}/{{data.length}}</div>
        <!-- 题目要求 -->
        <div v-if="test.desc" class="test-title" v-html="test.desc"></div>
        <!-- 填空题题目答案选区 -->
        <ul class="qa-answers" v-if="test.type == 3">
          <li v-for="(answer, idx) in test.options">
            <v-btn small round outline class="orange orange--text" @click="activateAnswer(answer.content)">{{answer.content}}</v-btn>
          </li>
        </ul>
        <!-- 题目内容 -->
        <div @click="proxyChildren($event, test)" @input="proxyChildrenInput($event, test)"
             v-if="test.type == 2 || test.type == 3" class="test-title test-title-wide" v-html="replaceEmpty(test.title, test.type)"></div>
        <div v-if="test.type != 2 && test.type != 3" class="test-title" v-html="test.title"></div>
        <!-- 选择题题目答案选区 -->
        <ul class="test-detail" v-if="test.type == 1">
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
        <div>太棒了，<br>你完成了今日测试！</div>
        <div>
          <div>正确率</div>
          <div class="result-percent">{{testResult}}</div>
        </div>
      </div>
      <div class="card result-card mb-3">
        <div class="test-tag">{{todayStr}}</div>
        <ul class="test-detail">
          <div
              v-for="(test, index) in data">
            <li class="result-item" v-if="test.type==1">
              <div>{{index < 9 ? '0' + (index + 1) : index + 1}}</div>
              <div>
                <v-icon v-if="test.isCorrect" class="orange--text">check</v-icon>
                <v-icon v-if="!test.isCorrect" class="black--text">close</v-icon>
              </div>
            </li>
            <li class="result-item" v-if="test.type==2 || test.type==3" v-for="(option, idx) in test.options">
              <div>{{index < 9 ? '0' + (index + 1) : index + 1}} - {{idx < 9 ? '0' + (idx + 1) : idx + 1}}</div>
              <div>
                <v-icon v-if="option.isCorrect" class="orange--text">check</v-icon>
                <v-icon v-if="!option.isCorrect" class="black--text">close</v-icon>
              </div>
            </li>
          </div>
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
        <div v-html="sentenceAnalysis"></div>
      </div>
      <div class="orange btn-share">分享到朋友圈，完成打卡<img src="../assets/share@2x.png" height="15px" style="vertical-align:middle;margin-left: 5px"/></div>
    </div>
  </v-container>
</template>

<script>
  import '../stylus/practice.styl'
  import { bus } from '../bus.vue'
  import { todayStr, formatDate } from './util.vue'
  import axios from 'axios'
  var qs = require('querystringify');

  export default {
    created(){
      document.title = '今日测试'
      this.handler = (data) => {
        this.paper = data.paper;
        if(this.paper){
          this.tractate = this.paper.tractate;
          this.data = JSON.parse(this.paper.content);
          this.lexicalAnalysis = this.paper.lexicalAnalysis;
          this.sentenceAnalysis = this.paper.sentenceAnalysis;
          this.todayWordsTotal = this.paper.wordsTotal;
        }
        this.book = data.book;
        this.statistical = data.statistical;
        this.wordsTotal = this.statistical.map(i => i.wordsTotal).reduceRight((a, b)=>{
          return a + b
        }, 0)
//        this.initShare()
      }
      bus.$on('done', this.handler)
    },
    destroyed(){
      bus.$off('done', this.handler)
    },
    mounted(){
      wx.ready((res) => {
//         config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
//          this.initShare()
        this.wxReady = true;
      });
        wx.error((err)=>{
          console.log(err)
      });

    },
    data() {
      return {
        todayStr: todayStr(),
        showResult: false,
        current: 0,
        testResult: '',
        data: [],
        userInfo: userInfo || {},
        wxReady: false,
        debug: qs.parse(location.search).debug || false
      }
    },
    methods: {
      initShare(){
        if(this.wxReady) {
          this.bindEvent();
        } else {
          wx.ready((res) => {
            this.bindEvent();
            this.wxReady = true;
          });
          wx.error((err)=>{
            console.log(err)
          });
        }

      },
      bindEvent() {
        const { nickname, headimgurl } = this.userInfo;
        const day = this.statistical ? this.statistical.length : 0;
        const word = this.paper.wordsTotal;
        const book = this.book ? this.book.name : '';
        const cover = this.book ? this.book.coverUrl : '';
        if(this.debug) {
          alert(`${day},${word},${book},${cover}`);
        }

        wx.onMenuShareTimeline({
          title: `${nickname}在法棍阅读已坚持完成${day}天${word}单词`, // 分享标题
          link: `http://www.envol.vip/practiceShare?nickname=${nickname}&headimgurl=${headimgurl}&day=${day}&word=${word}&book=${book}&cover=${cover}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'http://www.envol.vip/imgs/headimg.jpeg', // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        });
        wx.onMenuShareAppMessage({
          title: `${nickname}在法棍阅读已坚持完成${day}天${word}单词`, // 分享标题
          desc: '爱法语，怎能不阅读？开始法语阅读，不再做个肤浅法语人。', // 分享描述
          link: `http://www.envol.vip/practiceShare?nickname=${nickname}&headimgurl=${headimgurl}&day=${day}&word=${word}&book=${book}&cover=${cover}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'http://www.envol.vip/imgs/headimg.jpeg', // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        });
      },
      next(){
        if(this.current < this.data.length - 1) {
          this.current = this.current + 1
          window.scrollTo(0, 0)
        } else {
          this.finishTest()
        }
      },
      activateAnswer(content) {
        this.currentAnswer = content
      },
      finishTest(){
        this.data = this.data.map(test => {
          if(test.type == '1') {
            test.isCorrect = (test.answer === test.testIdx)
          } else if(test.type == '2' || test.type == '3') {
            test.isCorrect = (test.answer === test.testIdx)
          }
          return test
        })
        let normalList = this.data.filter(test => test.type == '1');
        let tkList = this.data.filter(test => test.type == '2' || test.type == '3').map(item=>item.options).reduceRight((a,b)=>{
          return b.concat(a)
        }, [])

        this.resultArray = [...normalList, ...tkList]

        let correntCnt = this.resultArray.filter(test => {
          return test.isCorrect
        }).length
        this.testResult = Math.round(correntCnt / this.resultArray.length * 100) + '%'
        this.showResult = true
        this.initShare()
        window.scrollTo(0, 0)
        axios.post('/api/user/course/' + this.paper.id + '/save?readToday=' + formatDate(this.paper.readToday) + '&wordsTotal=' + this.paper.wordsTotal + '&score=' + Math.round(correntCnt / this.resultArray.length * 100))
      },
      select(item, index, idx) {
        item.testIdx = idx
        this.$set(this.data, index, item)
      },
      replaceEmpty(content, type){
        if(type == '3') {
          return content.replace(/\$(\d+)/g, function(a, b){
            return '<span data-idx="' + b + '" class="editor-input">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'
          })
        } else if(type == '2') {
          return content.replace(/\$(\d+)/g, function(a, b){
            return '<input type="text" data-idx="' + b + '" class="editor-input2" value=""></input>'
          })
        }

      },
      proxyChildrenInput(e, test){
        if(e.target.className == 'editor-input2') {
          let op = test.options[e.target.getAttribute('data-idx') - 1]
          if(op) {
            op.isCorrect = (op.content == e.target.value)
          }
        }
      },
      proxyChildren(e, test) {
        if(e.target.className == 'editor-input' && this.currentAnswer) {
          e.target.className = 'editor-input valid'
          e.target.innerHTML = '&nbsp;&nbsp;' + this.currentAnswer + '&nbsp;&nbsp;'
          let op = test.options[e.target.getAttribute('data-idx') - 1]
          if(op) {
            op.isCorrect = (op.content == this.currentAnswer)
          }
          this.currentAnswer = null
        } else if(e.target.className == 'editor-input valid') {
          this.currentAnswer = null
          e.target.className = 'editor-input'
          e.target.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
          let op = test.options[e.target.getAttribute('data-idx') - 1]
          if(op) {
            op.isCorrect = false
          }
        }
      }
    }
  }
</script>
