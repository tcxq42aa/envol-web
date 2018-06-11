<template>
  <v-container :class="{'orange': !showResult, 'test-container': !showResult}" style="padding-bottom: 0">
    <div class="test-list"
         v-if="!showResult && ready"
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
      <div class="card orange test-land-wrap mb-3">
        <img src="../assets/logo@2x.png" height="22px"/>
        <h3>您的测试等级</h3>
        <img v-if="level=='n1'" src="../assets/n1@2x.png" width="118px" height="135px">
        <img v-if="level=='n2'" src="../assets/n2@2x.png" width="118px" height="135px">
        <img v-if="level=='n3'" src="../assets/n3@2x.png" width="118px" height="135px">
        <img v-if="level=='n4'" src="../assets/n4@2x.png" width="118px" height="135px">

        <div v-if="btnEnabled" style="line-height: 2">
          Bravo！<br>等的就是你，<br>你非常适合参加本期课程，<br>请选择合适的课程<br>一起享受法语阅读的乐趣吧！
          <!--<div class="book-wrapper" v-if="bookList && bookList.length > 1">-->
            <!--<img v-for="(book, i) in bookList"-->
                 <!--@click.stop="selectBook(book, i)"-->
                 <!--:class="{'selected': bookIdx == i}"-->
                 <!--:src="'https://static.envol.vip' + book.bookCoverUrl"/>-->
          <!--</div>-->
          <!--你要读的书是：{{bookName}}<br>-->
          <!--{{bookRemark}}<br>-->
          <!--点击【立即报名】<br>-->
          <!--开启你的法棍阅读吧！-->
          <!--<div class="mt-3 bold f16">-->
            <!--<span>让小伙伴试试<img src="../assets/share@2x.png" height="15px" style="vertical-align:middle;margin-left: 5px"/></span>-->
          <!--</div>-->
        </div>

        <div v-if="!btnEnabled && level=='n1'" style="line-height: 2">
          好可惜，<br>
          你现在的学习等级暂不适合参加<br>
          本期课程，<br>
          再加把劲学习法语，<br>
          或期待入门阅读课程上线！
          <div class="mt-3 bold f16">
            对结果有异议，<br>
            如何操作？
          </div>
        </div>
        <div v-if="!btnEnabled && level=='n2'" style="line-height: 2">
          Bravo！<br>
          等的就是你，<br>
          你非常适合参加本期课程，<br>
          请点击【报名】<br>
          一起享受法语阅读的乐趣吧！
          <div class="mt-3 bold f16">
            <span>让小伙伴试试<img src="../assets/share@2x.png" height="15px" style="vertical-align:middle;margin-left: 5px"/></span>
          </div>
        </div>
        <div v-if="!btnEnabled && level=='n3'" style="line-height: 2">
          太棒啦！<br>
          你的阅读水平已超过一般水平，<br>
          水平较高，<br>
          请等待我们更高级的阅读课程吧！
          <div class="mt-3 bold f16">
            我仍然想参加，<br>
            如何操作？
          </div>
        </div>
        <div v-if="!btnEnabled && level=='n4'" style="line-height: 2">
          哇，<br>
          你的法语阅读水平已达到B2+等级，<br>
          敬请期待我们的<br>
          达人级别阅读课程吧！
          <!--<div class="mt-3 bold f16">-->
            <!--<span>让小伙伴试试<img src="../assets/share@2x.png" height="15px" style="vertical-align:middle;margin-left: 5px"/></span>-->
          <!--</div>-->
        </div>
      </div>

      <!-- 开启测试 -->
      <v-btn v-if="!btnEnabled" block round class="btn-test orange--text white" :href="'/land?semesterId=' + semesterId">
        <span>咨询老师</span>
      </v-btn>
      <!--<v-btn v-if="btnEnabled" block round class="btn-test orange&#45;&#45;text white" @click="goPay()">-->
        <!--立即报名-->
      <!--</v-btn>-->
      <!--<v-btn v-if="btnEnabled" block round class="btn-test orange&#45;&#45;text white" :class="{'btn-test-disabled': disableEnroll}" @click="goPay()">-->
        <!--{{enrollText}}-->
      <!--</v-btn>-->

      <!-- 关闭测试 -->
      <!--<v-btn block round class="btn-test orange&#45;&#45;text white" href="/land">-->
        <!--<span>咨询老师</span>-->
      <!--</v-btn>-->

      <!-- 可报名列表 -->
      <div class="card white test-land-wrap mb-3"
           style="padding-bottom: 25px;padding-top: 25px;"
           v-for="(book, i) in bookList">
        <div class="book-wrapper">
          <img :src="'https://static.envol.vip' + book.bookCoverUrl"/>
          <div class="book-right">
            <div style="text-align: left">《{{book.bookName}}》</div>
            <div class="orange--text" style="padding-left: 15px">
              <span class="left">{{book.duration}}天</span>
              <span class="right">¥{{book.price}}</span>
            </div>
            <v-btn @click.stop="selectBook(book, i)" round class="orange white--text btn__orange" style="margin: 0;width: 100px; align-self: flex-end">我要报名</v-btn>
          </div>
        </div>
        <div class="book-desc">{{book.desc}}</div>
      </div>

      <div v-if="btnEnabled" class="btn-footer-share orange" @click.stop="showLayer=true">
        让小伙伴试试<img src="../assets/share@2x.png" height="15px" style="vertical-align:middle;margin-left: 5px"/>
      </div>
    </div>

    <div class="share-layer" v-if="showLayer" @click="showLayer=false">
      <div class="share-content">
        <img class="share-arrow" src="../assets/share-arrow@2x.png" width="68px" height="69px">
        <p style="font-size: 16px;line-height: 22px;margin: 10px 0px 12px 0;color: rgb(252,147,61)">别忘了跟好友分享炫耀哦！</p>
      </div>
    </div>

    <v-dialog v-model="dialog">
      <v-card>
        <img src="../assets/vovo.jpg" width="100%">
      </v-card>
    </v-dialog>

    <v-dialog v-model="phoneDialog" persistent width="80%">
      <v-card>
        <v-card-title>
          <span class="headline">绑定手机号</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="mobilePhone" :rules="emailRules" label="手机号" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn round flat @click.native="phoneDialog = false">取消</v-btn>
          <v-btn round class="orange white--text btn__orange" @click.native="bindPhone()">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="mobileConfirmDialog" width="80%">
      <v-card>
        <v-card-title>
          <span style="font-size: 18px;">请确认手机号码是否正确？</span>
        </v-card-title>
        <v-card-text style="padding-left: 30px;font-size: 22px;letter-spacing: 2px;">
          {{mobilePhone}}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn round flat @click.native="mobileConfirmDialog = false">取消</v-btn>
          <v-btn round class="orange white--text btn__orange" @click.native="sendBindPhone()">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showEnrollDialog" width="80%">
      <v-card>
        <v-card-text style="padding: 30px 10px 15px;text-align: center;line-height: 2">
          <div>亲爱的未来小法棍<br>你确定要选择</div>
          <span class="orange--text" style="font-size: 16px;font-weight: bold">《{{currentBook.bookName}}》</span>
          <div>这本书进行阅读吗? <br><br>一旦选择，无法更改。</div>
        </v-card-text>

        <div>
          <v-btn block round large class="orange white--text btn__orange btn__in__dialog" @click="goPay()">是的，我要报名</v-btn>
          <v-btn block round large flat class="orange--text white btn__in__dialog"  @click.native="showEnrollDialog = false" style="font-size: 13px">我想再看看别的</v-btn>
          <div>&nbsp;</div>
        </div>
        <!--<v-card-actions>-->
          <!--<v-spacer></v-spacer>-->
          <!--<v-btn class="blue&#45;&#45;text darken-1" flat @click.native="mobileConfirmDialog = false">取消</v-btn>-->
          <!--<v-btn class="blue white&#45;&#45;text" @click.native="sendBindPhone()">确认</v-btn>-->
        <!--</v-card-actions>-->
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import '../stylus/test.styl'
  import { todayStr } from './util.vue'
  import { bind,check, enroll} from '../service/user'
  import {getSemesterDetail} from '../service/semester'
  import axios from 'axios'
  export default {
    created(){
      document.title = '小试牛刀'
      let semesterId = this.$route.query.semesterId;
      let url = '/api/evaluation/detail';
      if(semesterId) {
        url = url + '?semesterId=' + semesterId
        this.getSemester(semesterId);
      }
      axios.get(url)
        .then((response) => {
          if(!response.data){
//            location.replace('/appointment')
            return
          }
          this.evaluationId = response.data.id;
          this.semesterId = response.data.semesterId;
          let content = response.data.content.replace(/\$\d+/g,'<span onclick=\\\"console.log(app.__vue__.$children[0])\\\" class=\\\"qa-underline\\\">&nbsp;</span>')
          this.data = JSON.parse(content)
          if(this.semesterId) {
            check(this.semesterId).then( res => {
              this.userEnroll = res.data.enroll;
              this.userBind = res.data.bind;

              // 强制更新等级
              let overrideGrade = this.$route.query.grade;
              if(['N1', 'N2', 'N3', 'N4'].indexOf(overrideGrade) >=0){
                console.log('强制更新登记为', overrideGrade);
                this.level = overrideGrade.toLowerCase();
                this.showResult = true;
                this.updateGrade(overrideGrade);
              } else {
                this.level = res.data.grade.toLowerCase().split('_')[0];
                if(this.level) {
                  this.showResult = true;
                }
              }

              this.ready = true;
              this.initShare()
            })
          } else {
            this.ready = true;
            this.initShare()
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    mounted(){
      wx.ready((res) => {
//         config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
          this.initShare()
      });
      wx.error((err)=>{
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log(err)
      });

    },
    computed: {
      btnEnabled() {
        return (this.level == 'n1' && this.n1Enabled)
                || (this.level == 'n2' && this.n2Enabled)
                || (this.level == 'n3' && (this.n3_aEnabled || this.n3_bEnabled))
                || (this.level == 'n4' && this.n4Enabled);
      },
      bookName() {
        return `《${this.bookList[this.bookIdx].bookName || ''}》`;
      },
      bookRemark() {
        return this.bookList[this.bookIdx].desc || '';
      },
      enrollText() {
        if(this.beginDate && this.beginDate > this.now) {
          return '报名未开始';
        }
        if(this.endDate && this.endDate < this.now) {
          return '报名已结束';
        }
        if(this.userEnroll) {
          return '已报名'
        }
        return '立即报名'
      },
      bookList() {
        if(this.level) {
          return this.semesterGradeList.filter( grade => {
            return grade.price > 0 && grade.name.toLowerCase().startsWith(this.level)
          });
        } else {
          return [];
        }
      }
    },
    data() {
      return {
        now: new Date(serverTime).getTime(),
        userBind: false, // 是否绑定手机
        phoneDialog: false,
        mobilePhone: '',
        emailRules: [
          (v) => !!v || '请填写您的手机号码',
          (v) => /^[\d\w\s+-]{8,28}$/.test(v) || '您的手机号码有误',
            (v) => {
            return !this.errMsg || this.errMsg
          }
        ],
        ready: false,
        dialog: false,
        mobileConfirmDialog: false,
        showEnrollDialog: false,
        evaluationId: '',
        semesterId: '',
        todayStr: todayStr(),
        showResult: false,
        pass: false,
        level: '',
        current: 0,
        testResult: '',
        data: [],
        userInfo: userInfo || {},
        userEnroll: false, //是否已报名
        userGrade: false, //是否已测试
        n1Enabled: false,
        n2Enabled: false,
        n3_aEnabled: false,
        n3_bEnabled: false,
        n4Enabled: false,
        disableEnroll: false,
        showLayer: false,
        bookIdx: 0,
        currentBook: {}
      }
    },
    methods: {
      initShare(){
        const { nickname, headimgurl } = this.userInfo;
        const { name: semesterName } = this.semester || {};
        const level = this.level.toUpperCase();
        console.log(level, nickname, headimgurl)
        wx.onMenuShareTimeline({
//          我已参加法棍阅读第4期入学测试，一起开启阅读之旅吧！
          title: `我已参加${semesterName}入学测试，一起开启阅读之旅吧！`, // 分享标题
          link: `https://www.envol.vip/testShare?nickname=${nickname}&headimgurl=${headimgurl}&level=${level}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'https://www.envol.vip/imgs/headimg.jpeg', // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        });
        wx.onMenuShareAppMessage({
            title: `我已参加${semesterName}入学测试，一起开启阅读之旅吧！`, // 分享标题
            desc: '爱法语，怎能不阅读？开始法语阅读，不再做个肤浅法语人。', // 分享描述
            link: `https://www.envol.vip/testShare?nickname=${nickname}&headimgurl=${headimgurl}&level=${level}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://www.envol.vip/imgs/headimg.jpeg', // 分享图标
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
      bindPhone() {
        if(!this.userBind) {
          this.phoneDialog = false;
          setTimeout(_=>{
            this.mobileConfirmDialog = true;
          }, 150)
        } else {
          this.sendBindPhone();
        }
      },
      sendBindPhone() {
        if(/^[\d\w\s+-]{8,28}$/.test(this.mobilePhone)) {
          this.goPay(true);
          this.mobileConfirmDialog = false;
        }
      },
      updateGrade(overrideGrade) {
        return axios.get('/api/user/update/grade?evaluationId=' + this.evaluationId + '&semesterId=' + this.semesterId + '&grade=' + overrideGrade);
      },
      goPay(flag) {
        if(this.userEnroll) {
          return;
        }
        if(!flag && !this.userBind) {
          this.phoneDialog = true;
          return;
        }
        let grade = this.currentBook.code;
        if(!this.currentBook.code) {
          grade = this.bookList[0].code;
        }
        this.updateGrade(grade).then( res => {
          var semesterId = this.semesterId;
          enroll(semesterId, this.mobilePhone).then(res => {
            var data = res.data;
            wx.chooseWXPay({
              timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
              package: data.pkg, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
              signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: data.paySign, // 支付签名
              success: function (res) {
                // 支付成功后的回调函数
                setTimeout(function(){
                  window.location.href = '/land?semesterId=' + semesterId;
                }, 200);
              }
            });
            this.phoneDialog = false;
          }).catch((e)=>{
            console.log(e)
          })
        });
      },
      next(){
        if(this.current < this.data.length - 1) {
          this.current = this.current + 1
        } else {
          this.finishTest()
        }
        window.scrollTo(0, 0);
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
        let level1 = this.data.filter( test => test.level == '1' && test.isCorrect).length;
        let level2 = this.data.filter( test => test.level == '2' && test.isCorrect).length;
        let level3 = this.data.filter( test => test.level == '3' && test.isCorrect).length;

        let score = 0
        let level = 'n2'
        let pass = true

        if(level1 + level2 >= 12) {
          if(level3 >= 2) {
            level = 'n4'
          } else {
            level = 'n3'
          }
        } else {
          if(level1 + level2 >= 7) {
            level = 'n2'
          } else {
            level = 'n1'
            pass = false
          }
        }
        this.level = level
        this.pass = pass
        this.showResult = true

        this.initShare();

        const gradeList = this.bookList;
        let grade = this.level;
        if(gradeList.length > 0) {
          grade = gradeList[0].code;
        }
        axios.post('/api/user/evaluation/' + this.evaluationId + '/save?grade=' + grade);
      },
      select(item, index, idx) {
        item.testIdx = idx
        this.$set(this.data, index, item)
      },
      getSemester(semesterId) {
        getSemesterDetail(semesterId).then(({ data: { semester, semesterGradeList } }) => {
          this.semesterGradeList = semesterGradeList;
          semesterGradeList.forEach(grade => {
            if(grade.price > 0) {
              this[grade.name.toLowerCase() + 'Enabled'] = true;
            }
          });

          this.beginDate = semester.enrollBeginDate;
          this.endDate   = semester.enrollEndDate;
          this.semester = semester;
          if(this.endDate) {
            this.endDate = this.endDate + 86400000;
          }
          if((this.beginDate && this.beginDate > this.now) || (this.endDate && this.endDate < this.now)) {
            this.disableEnroll = true;
          }
        })
      },
      selectBook(data, i) {
        this.bookIdx = i;
        this.currentBook = data;
        this.showEnrollDialog = true;
        return;
      }
    }
  }
</script>
