<template>
  <v-container :class="{'orange': !showResult, 'hasAudio': !showResult, 'test-container': !showResult}">
    <div v-if="!showResult">
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
          <div class="btn__next-wrap" v-if="!showAudio">
            <v-btn round class="orange white--text btn__orange btn__next" @click.stop="next()">{{current == data.length - 1 ? '完成测试' : '下一题'}}</v-btn>
          </div>
          <div class="btn__nav-wrap" v-if="showAudio">
            <v-btn v-if="current < data.length - 1" outline round color="orange" @click.stop="next()">
              下一题
            </v-btn>
            <v-btn v-if="current >= data.length - 1" outline round color="orange" @click.stop="next()">
              提交答案
            </v-btn>
            <v-btn v-if="current > 0" outline round color="orange" :disabled="test.testIdx == -1" @click.stop="prev()">
              上一题
            </v-btn>
          </div>
        </div>
      </div>
      <div class="audio-wrap" v-if="paper && paper.audio && showAudio" :style="{ visibility: current >= 8 ? 'visible' : 'hidden' }">
        <div class="audio-progress">
          <div class="audio-progress-point" v-bind:style="{ left: left + 'px' }"></div>
          <div class="audio-progress-line" v-bind:style="{ width: left + 'px' }"></div>
        </div>
        <audio ref="audio"
               @loadedmetadata="loadedmetadata" preload="auto"></audio>
        <div class="audio-panel" v-if="paper && paper.audio">
          <div>
            <span class="grey--text audio-current mr-1">{{currentTime}} / {{duration}}</span>
            <img style="vertical-align: middle" src="../assets/play.png" @click="play()" v-if="!isPlay" width="24px" height="24px">
            <img style="vertical-align: middle" src="../assets/pause.png" @click="pause()" v-if="isPlay" width="24px" height="24px">
          </div>
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
      <div class="card result-card mb-3" :style="{'padding-top': todayWordsTotal > 0 ? '50px': '20px'}">
        <div v-if="todayWordsTotal > 0" class="test-tag">{{todayStr}}</div>
        <ul class="test-detail">
          <div v-if="todayWordsTotal == 0" class="test-result-header orange--text">
            提醒：<br>
            测试答案没有回看功能，请记得截图保存哦～
          </div>
          <div
              v-for="(test, index) in data">
            <!--<li class="result-item" :class="{'test-result-item': todayWordsTotal == 0}" v-if="test.type==1">-->
            <li class="result-item bdt" v-if="test.type==1">
              <div>{{index < 9 ? '0' + (index + 1) : index + 1}}</div>
              <img v-if="test.isCorrect" src="../assets/1.png" width="24px" height="28px"/>
              <img v-if="!test.isCorrect" src="../assets/2.png" width="24px" height="28px"/>
              <!--<div v-if="todayWordsTotal > 0">-->
                <!--<img v-if="test.isCorrect" src="../assets/1.png" width="24px" height="28px"/>-->
                <!--<img v-if="!test.isCorrect" src="../assets/2.png" width="24px" height="28px"/>-->
              <!--</div>-->
              <!--<div v-if="todayWordsTotal == 0" class="test-result-detail">-->
                <!--<img v-if="test.isCorrect" src="../assets/1.png" width="24px" height="28px"/>-->
                <!--<img v-if="!test.isCorrect" src="../assets/2.png" width="24px" height="28px"/>-->
                <!--<div class="test-result-title" style="color: initial;" v-html="test.title"></div>-->
                <!--<div class="f14 mt-3" style="color: initial;">您选择的答案为：{{test.options[test.testIdx] ? test.options[test.testIdx].content : ''}}</div>-->
                <!--<div class="f14 mt-2" style="color: initial;"><span class="orange&#45;&#45;text">正确答案为：</span>{{test.options[test.answer].content}}</div>-->
                <!--<div class="f14 mt-2" v-if="test.answerDesc">-->
                  <!--<div>答案解析：</div>-->
                  <!--<div>{{test.answerDesc}}</div>-->
                <!--</div>-->
              <!--</div>-->
            </li>
            <li class="result-item" v-if="test.type==2 || test.type==3" v-for="(option, idx) in test.options">
              <div>{{index < 9 ? '0' + (index + 1) : index + 1}} - {{idx < 9 ? '0' + (idx + 1) : idx + 1}}</div>
              <div>
                <img v-if="option.isCorrect" src="../assets/1.png" width="24px" height="28px"/>
                <img v-if="!option.isCorrect" src="../assets/2.png" width="24px" height="28px"/>
              </div>
            </li>
          </div>
        </ul>
      </div>

      <div class="card pa-3 mb-3 dis-flex" v-if="todayWordsTotal > 0">
        <div class="bl-orange">
          <div class="grey--text">今日已读</div>
          <div class="f18 mt-2">{{todayWordsTotal}}字</div>
        </div>
        <div class="bl-orange">
          <div class="grey--text">全部已读</div>
          <div class="f18 mt-2">{{ hasRead ? wordsTotal : wordsTotal + todayWordsTotal}}字</div>
        </div>
      </div>
      <div class="card pa-3 mb-3">
        <div class="subheading mb-4">今日解析</div>
        <div v-html="sentenceAnalysis"></div>
      </div>
      <div class="orange btn-share" @click="showLayer=true">分享到朋友圈，完成打卡<img src="../assets/share@2x.png" height="15px" style="vertical-align:middle;margin-left: 5px"/></div>
      <div class="share-layer" v-if="showLayer" @click="showLayer=false">
        <div class="share-content">
          <img class="share-arrow" src="../assets/share-arrow@2x.png" width="68px" height="69px">
          <p style="font-size: 16px;line-height: 22px;margin: 20px 24px 12px 0;color: rgb(252,147,61)">完成打卡，赢代金券</p>
          <img class="share-arrow" src="../assets/share-gift@2x.png" width="145px" height="109px" style="margin-right: 38.5px;">
        </div>
      </div>
    </div>

    <v-dialog v-model="showBadge" content-class="badge-dialog">
      <img class="badge-img" v-if="badgeImgMap[badgeName]" :src="badgeImgMap[badgeName]" width="100px" height="100px">
      <div class="badge-body" v-if="badgeName=='1'">
        <div class="badge-header">埋下种子，<br>让法语阅读长出小芽。</div>
        <div class="badge-content">
          你已经坚持学习 <span class="orange--text">1</span> 天，不容易啊！<br>
          迈出了艰难的第一步，<br>
          从此，你跟法语阅读就紧密地连接<br>
          在一起了，<br>
          不可以轻易放手了哦！
        </div>
      </div>
      <div class="badge-body" v-if="badgeName=='5'">
        <div class="badge-header">收获麦穗，<br>是成长的开始。</div>
        <div class="badge-content">
          你已经坚持学习 <span class="orange--text">5</span> 天，<br>
          我知道你不擅长坚持，<br>
          但是5天了，已经很棒了！<br>
          继续加油！
        </div>
      </div>
      <div class="badge-body" v-if="badgeName=='10'">
        <div class="badge-header">磨成粉末，<br>揉碎过去成为更好的自己。</div>
        <div class="badge-content">
          你已经坚持学习 <span class="orange--text">10</span> 天，Bravo！<br>
          没想到自己竟然可以一天不落<br>
          坚持10天学法语吧！<br>
          给自己一个肯定，<br>
          让更多人知道吧！
        </div>
      </div>
      <div class="badge-body" v-if="badgeName=='15'">
        <div class="badge-header">充分搅拌，<br>让内在更加丰盈。</div>
        <div class="badge-content">
          你已经坚持学习 <span class="orange--text">15</span> 天，状态不错嘛，<br>
          学习开始渐入佳境了，<br>
          每天学法语也不是想象中这么难吧，<br>
          看好你！<br>
          也别忘了和好友分享！
        </div>
      </div>
      <div class="badge-body" v-if="badgeName=='21'">
        <div class="badge-header">面团成型，<br>我已守住初心。</div>
        <div class="badge-content">
          你已经坚持学习 <span class="orange--text">21</span> 天，<br>
          好样的！<br>
          已经成功培养每天学法语的习惯啦，<br>
          你努力的样子真好看！
        </div>
      </div>
      <div class="badge-body" v-if="badgeName=='30'">
        <div class="badge-header">稳稳发酵，<br>之前的努力不断掉。</div>
        <div class="badge-content">
          你已经坚持学习 <span class="orange--text">30</span> 天！<br>
          整整一个月你都在坚持学习法语，<br>
          实在太厉害啦！<br>
          不晒晒这么优秀的自己<br>
          说的过去吗？
        </div>
      </div>
      <div class="badge-body" v-if="badgeName=='50'">
        <div class="badge-header">精心雕刻，可能会有些疼，<br>但都是为了更好的蜕变。</div>
        <div class="badge-content">
          哇！你从30天跨到 <span class="orange--text">50</span> 天了！<br>
          这个过程可能开始有些疲倦或痛苦，<br>
          但这肯定是值得的。<br>
          作为努力的回报，第一本书的内容<br>
          你可以多保留30天了，<br>
          相当于赚回一半学费！
        </div>
      </div>
      <div class="badge-body" v-if="badgeName=='70'">
        <div class="badge-header">高温烘培，犹如凤凰涅槃，<br>下一步就是真正重生。</div>
        <div class="badge-content">
          你已经坚持学习 <span class="orange--text">70</span> 天，<br>
          完成77.8%的课程，<br>
          离坚持90天只差一步了！<br>
          完成下一个目标两本书都可获得90<br>
          天的延长期哦！学费全赚回了！
        </div>
      </div>
      <div class="badge-body" v-if="badgeName=='90'">
        <div class="badge-header">完美绽放，<br>我已成为全新的自己。</div>
        <div class="badge-content">
          是不是都为自己的努力感动了！<br>
          <span class="orange--text">90</span> 天！全！部！学！完！了！<br>
          Félicitations！这届法棍阅读最佳<br>
          努力奖非你莫属啊！<br>
          像你这么坚持不懈的还有谁！<br>
          快去分享你的获奖感言吧！
        </div>
      </div>
      <v-btn round class="orange white--text btn__orange btn-timeline" @click.stop="showLayer=true">去炫耀一下</v-btn>
    </v-dialog>
  </v-container>
</template>

<script>
  import '../stylus/read.styl'
  import '../stylus/practice.styl'
  import { bus } from '../bus.vue'
  import { todayStr, formatDate, formatDateInverse } from './util.vue'
  import { share, signature } from '../service/user.vue'
  import axios from 'axios'
  var qs = require('querystringify');

  export default {
    created(){
      document.title = '今日测试'
      this.handler = (data) => {
        this.book = data.book;
        this.statistical = data.statistical;
        this.paper = data.paper;
        if(this.paper){
          this.tractate = this.paper.tractate;
          this.data = JSON.parse(this.paper.content);
          this.lexicalAnalysis = this.paper.lexicalAnalysis;
          this.sentenceAnalysis = this.paper.sentenceAnalysis;
          this.todayWordsTotal = this.paper.wordsTotal;
          this.wordsTotal = this.statistical.map((i)=>{
            if(i.paperId == this.paper.id) {
              this.hasRead = true;
            }
            return i.wordsTotal;
          }).reduceRight((a, b)=>{
            return a + b
          }, 0)
          if(this.paper.audio && !this.tractate) {
            this.showAudio = true;
            this.initAudio();
            if(localStorage.getItem('testAudio_' + this.paper.id)){
              this.finished = true;
            }
          }
        }
      }
      bus.$on('done', this.handler)
    },
    destroyed(){
      bus.$off('done', this.handler)
    },
    mounted(){
    },
    data() {
      return {
        showAudio: false,
        hasRead: false,
        hasShared: false,
        todayStr: formatDateInverse(new Date(serverTime).getTime(), '/'),
        showResult: false,
        showLayer: false,
        current: 0,
        testResult: '',
        paper: null,
        todayWordsTotal: 0,
        wordsTotal: 0,
        sentenceAnalysis: '',
        data: [],
        userInfo: userInfo || {},
        wxReady: false,
        debug: qs.parse(location.search).debug || false,
        showBadge: false,
        badgeName: '',
        badgeImgMap: {
          '1': require('../assets/badge/badge1@2x.png'),
          '5': require('../assets/badge/badge2@2x.png'),
          '10': require('../assets/badge/badge3@2x.png'),
          '15': require('../assets/badge/badge4@2x.png'),
          '21': require('../assets/badge/badge5@2x.png'),
          '30': require('../assets/badge/badge6@2x.png'),
          '50': require('../assets/badge/badge7@2x.png'),
          '70': require('../assets/badge/badge8@2x.png'),
          '90': require('../assets/badge/badge9@2x.png')
        },
        finished: false,
        isPlay: false,
        currentTime: '00:00',
        duration: '00:00',
        audioRef: null,
        timer: null,
        percent: 0,
        left: 0
      }
    },
    methods: {
      refreshSignature(cb){
        signature(encodeURIComponent(location.href.split('#')[0])).then(function(res){
          var data = res.data;
          wx.config({
            debug: qs.parse(location.search).debug || false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wxe073c9d18b45b0ca', // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名，见附录1
            jsApiList: ['chooseWXPay', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'getNetworkType'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          cb && cb();
          console.log('call wx.config');
        })
      },
      initShare(){
        this.refreshSignature(()=>{
          const { nickname, headimgurl } = this.userInfo;
          const day = this.statistical ? (this.hasRead ? this.statistical.length : this.statistical.length + 1) : 0;
          const word = this.hasRead ? this.wordsTotal : this.wordsTotal + this.todayWordsTotal;
          const book = this.book ? this.book.name : '';
          const cover = this.book ? this.book.coverUrl : '';
          const self  = this;
          wx.onMenuShareTimeline({
            title: `是时候开始法语阅读了，我在【法棍阅读】坚持了${day}天，已读${word}字`, // 分享标题
            link: encodeURI(`http://www.envol.vip/practiceShare?nickname=${nickname}&headimgurl=${headimgurl}&day=${day}&word=${word}&book=${book}&cover=${cover}`), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://www.envol.vip/imgs/headimg.jpeg', // 分享图标
            success: function (data) {
              self.hasShared = true;
              share(self.paper.id);
            },
            cancel: function (data) {
            }
          });
          wx.onMenuShareAppMessage({
            title: `${nickname}在法棍阅读已坚持完成${day}天${word}字`, // 分享标题
            desc: '爱法语，怎能不阅读？开始法语阅读，不再做个肤浅法语人。', // 分享描述
            link: encodeURI(`http://www.envol.vip/practiceShare?nickname=${nickname}&headimgurl=${headimgurl}&day=${day}&word=${word}&book=${book}&cover=${cover}`), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://www.envol.vip/imgs/headimg.jpeg', // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            success: function (data) {
              share(self.paper.id);
            },
            cancel: function (data) {
            }
          });
          if(!localStorage.getItem('badge_' + day)) {
            this.showBadge = this.badgeImgMap[day];
            if(this.showBadge) {
              this.badgeName = day;
              localStorage.setItem('badge_' + day, 1);
            }
          }
        });
      },
      prev(){
        if(this.current > 0) {
          this.current = this.current - 1
          window.scrollTo(0, 0)
        }
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
        let date = formatDate(this.paper.readToday);
        let storageKey = 'today_' + date;
        localStorage.removeItem(storageKey);
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
      },

      // 录音相关
      initAudio(){
        var self = this;
        if(this.paper) {
          wx.ready(()=>{
            wx.getNetworkType({
              success: function (res) {
                var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
                self.$refs.audio.src = attachHost + self.paper.audio;
                self.$refs.audio.play();
                self.$refs.audio.pause();
                if(res.errMsg != 'getNetworkType:ok') {
                  alert(JSON.stringify(res));
                }
              }
            });
          });
        }
      },
      loadedmetadata(e){
        this.audioRef = e.target;
        this.duration = this.formatTime(e.target.duration)
        this.timer = setInterval(()=>{
          this.currentTime = this.formatTime(this.audioRef.currentTime)
          this.percent = this.audioRef.currentTime / this.audioRef.duration * 100
          this.left = (document.body.clientWidth - 25) * this.percent / 100;
          if(this.percent == 100){
            this.finished = true;
            localStorage.setItem('testAudio_' + this.paper.id, '1');
            this.percent = 0;
            this.pause();
          }
        }, 1000)
      },
      play(){
        if(!this.audioRef) {
          this.$refs.audio.src = '';
          this.$refs.audio.src = attachHost + this.paper.audio;
          this.$refs.audio.play();
          this.isPlay = true
          return
        }
        if(this.isPlay) {
          this.pause()
        } else {
          this.isPlay = true
          this.audioRef.play()
        }
      },
      pause(){
        if(!this.audioRef) {
          this.$refs.audio.pause();
          this.isPlay = false
          return
        }
        this.isPlay = false
        this.audioRef.pause()
      },
      formatTime(second){
        let min = (second / 60).toFixed(0);
        let sec = (second % 60).toFixed(0);
        if(min == 0){
          min = '00';
        }else if(min < 10){
          min = '0' + min;
        }
        if(sec == 0){
          sec = '00';
        }else if(sec < 10){
          sec = '0' + sec;
        }
        return min + ':' + sec
      }
    }
  }
</script>
