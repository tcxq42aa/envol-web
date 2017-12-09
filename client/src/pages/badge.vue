<template>
  <v-container class="orange">
    <div class="card badge-card" v-if="ready">
      <div class="badge-header">
        <div class="badge-line"></div>
        <span>已解锁</span>
        <div class="badge-line"></div>
      </div>
      <div class="badge-body">
          <div class="badge-item" v-if="days >= 1" @click.stop="handleBadge('1')">
            <img src="../assets/badge/badge1@2x.png" width="60px" height="60px">
            <p>阅读第1天</p>
          </div>
          <div class="badge-item" v-if="days >= 5" @click.stop="handleBadge('5')">
            <img src="../assets/badge/badge2@2x.png" width="60px" height="60px">
            <p>阅读 5 天</p>
          </div>
          <div class="badge-item" v-if="days >= 10" @click.stop="handleBadge('10')">
            <img src="../assets/badge/badge3@2x.png" width="60px" height="60px">
            <p>阅读 10 天</p>
          </div>
          <div class="badge-item" v-if="days >= 15" @click.stop="handleBadge('15')">
            <img src="../assets/badge/badge4@2x.png" width="60px" height="60px">
            <p>阅读 15 天</p>
          </div>
          <div class="badge-item" v-if="days >= 21" @click.stop="handleBadge('21')">
            <img src="../assets/badge/badge5@2x.png" width="60px" height="60px">
            <p>阅读 21 天</p>
          </div>
          <div class="badge-item" v-if="days >= 30" @click.stop="handleBadge('30')">
            <img src="../assets/badge/badge6@2x.png" width="60px" height="60px">
            <p>阅读 30 天</p>
          </div>
          <div class="badge-item" v-if="days >= 50" @click.stop="handleBadge('50')">
            <img src="../assets/badge/badge7@2x.png" width="60px" height="60px">
            <p>阅读 50 天</p>
          </div>
          <div class="badge-item" v-if="days >= 70" @click.stop="handleBadge('70')">
            <img src="../assets/badge/badge8@2x.png" width="60px" height="60px">
            <p>阅读 70 天</p>
          </div>
          <div class="badge-item" v-if="days >= 90" @click.stop="handleBadge('90')">
            <img src="../assets/badge/badge9@2x.png" width="60px" height="60px">
            <p>阅读 90 天</p>
          </div>
        </div>

      <div class="badge-header">
        <div class="badge-line"></div>
        <span>待解锁</span>
        <div class="badge-line"></div>
      </div>
      <div class="badge-body">
        <div class="badge-item" v-if="days < 1" >
          <img src="../assets/badge/badge1-dark@2x.png" width="60px" height="60px">
          <p>第一次打卡</p>
        </div>
        <div class="badge-item" v-if="days < 5">
          <img src="../assets/badge/badge2-dark@2x.png" width="60px" height="60px">
          <p>阅读 5 天</p>
        </div>
        <div class="badge-item" v-if="days < 10">
          <img src="../assets/badge/badge3-dark@2x.png" width="60px" height="60px">
          <p>阅读 10 天</p>
        </div>
        <div class="badge-item" v-if="days < 15">
          <img src="../assets/badge/badge4-dark@2x.png" width="60px" height="60px">
          <p>阅读 15 天</p>
        </div>
        <div class="badge-item" v-if="days < 21">
          <img src="../assets/badge/badge5-dark@2x.png" width="60px" height="60px">
          <p>阅读 21 天</p>
        </div>
        <div class="badge-item" v-if="days < 30">
          <img src="../assets/badge/badge6-dark@2x.png" width="60px" height="60px">
          <p>阅读 30 天</p>
        </div>
        <div class="badge-item" v-if="days < 50">
          <img src="../assets/badge/badge7-dark@2x.png" width="60px" height="60px">
          <p>阅读 50 天</p>
        </div>
        <div class="badge-item" v-if="days < 70">
          <img src="../assets/badge/badge8-dark@2x.png" width="60px" height="60px">
          <p>阅读 70 天</p>
        </div>
        <div class="badge-item" v-if="days < 90">
          <img src="../assets/badge/badge9-dark@2x.png" width="60px" height="60px">
          <p>阅读 90 天</p>
        </div>
      </div>
    </div>

    <div class="share-layer" v-if="showLayer" @click="showLayer=false">
      <div class="share-content">
        <img class="share-arrow" src="../assets/share-arrow@2x.png" width="68px" height="69px">
        <p style="font-size: 16px;line-height: 22px;margin: 10px 0px 12px 0;color: rgb(252,147,61)">别忘了跟好友分享炫耀哦！</p>
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
  import '../stylus/badge.styl';
  import { bus } from '../bus.vue'

  export default {
    created(){
      document.title = '徽章列表'
      this.handler = (data) => {
        this.ready = true;
        this.days = data.statistical ? data.statistical.length : 0;
        this.paper = data.paper;
        if(this.paper){
          this.tractate = this.paper.tractate;
          this.data = JSON.parse(this.paper.content);
          this.lexicalAnalysis = this.paper.lexicalAnalysis;
          this.sentenceAnalysis = this.paper.sentenceAnalysis;
          this.todayWordsTotal = this.paper.wordsTotal;
          this.statistical = data.statistical;
          this.wordsTotal = this.statistical.map((i)=>{
            if(i.paperId == this.paper.id) {
              this.hasRead = true;
            }
            return i.wordsTotal;
          }).reduceRight((a, b)=>{
            return a + b
          }, 0)
        }
        this.book = data.book;


        var self = this;
        wx.ready(function(){
          self.initShare();
        });
      }
      bus.$on('done', this.handler)
    },
    destroyed(){
      bus.$off('done', this.handler)
    },
    data() {
      return {
        ready: false,
        days: 0,
        userInfo: userInfo || {},
        showLayer: false,
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
        }
      }
    },
    methods: {
      initShare(){
        const { nickname, headimgurl } = this.userInfo;
        const day = this.statistical ? (this.hasRead ? this.statistical.length : this.statistical.length + 1) : 0;
        const word = this.hasRead ? this.wordsTotal : this.wordsTotal + this.todayWordsTotal;
        const book = this.book ? this.book.name : '';
        const cover = this.book ? this.book.coverUrl : '';
        const self  = this;
        wx.onMenuShareTimeline({
          title: `是时候开始法语阅读了，我在【法棍阅读】坚持了${day}天，已读${word || 0}字`, // 分享标题
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
      },
      handleBadge(name) {
        this.showBadge = true;
        this.badgeName = name;
      }
    }
  }
</script>
