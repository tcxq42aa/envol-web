<template>
  <v-container :class="{'orange': !showResult, 'test-container': !showResult}">
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
        <div v-if="level=='n1'" style="line-height: 2">
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
        <div v-if="level=='n2'" style="line-height: 2">
          Bravo！<br>
          等的就是你，<br>
          你非常适合参加本期课程，<br>
          请点击【报名】<br>
          一起享受法语阅读的乐趣吧！
          <div class="mt-3 bold f16">
            <span>让小伙伴试试<img src="../assets/share@2x.png" height="15px" style="vertical-align:middle;margin-left: 5px"/></span>
          </div>
        </div>
        <div v-if="level=='n3'" style="line-height: 2">
          太棒啦！<br>
          你的阅读水平已超过一般水平，<br>
          水平较高，<br>
          请等待我们更高级的阅读课程吧！
          <div class="mt-3 bold f16">
            我仍然想参加，<br>
            如何操作？
          </div>
        </div>
        <div v-if="level=='n4'" style="line-height: 2">
          哇，<br>
          你的法语阅读水平已达到B2+等级，<br>
          敬请期待我们的<br>
          达人级别阅读课程吧！
          <div class="mt-3 bold f16">
            <span>让小伙伴试试<img src="../assets/share@2x.png" height="15px" style="vertical-align:middle;margin-left: 5px"/></span>
          </div>
        </div>
      </div>
      <v-btn v-if="level!='n2'" block round class="btn-test orange--text white" href="/land">
        <span>咨询老师</span>
      </v-btn>
      <v-btn v-if="level=='n2'" block round class="btn-test orange--text white" @click="goPay()">
        立即报名
      </v-btn>
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
          <v-btn class="blue--text darken-1" flat @click.native="phoneDialog = false">取消</v-btn>
          <v-btn class="blue--text darken-1" flat @click.native="bindPhone()">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import '../stylus/test.styl'
  import { todayStr } from './util.vue'
  import {check, enroll} from '../service/user'
  import axios from 'axios'
  export default {
    created(){
      document.title = '小试牛刀'
      let semesterId = this.$route.query.semesterId;
      let url = '/api/evaluation/detail';
      if(semesterId) {
        url = url + '?semesterId=' + semesterId
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
              this.level = res.data.grade.toLowerCase();
              if(this.level) {
                this.showResult = true;
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
    data() {
      return {
        userBind: false, // 是否绑定手机
        phoneDialog: false,
        mobilePhone: '',
        emailRules: [
          (v) => !!v || '请填写您的手机号码',
          (v) => /^\d{11,13}$/.test(v) || '您的手机号码有误',
            (v) => {
            return !this.errMsg || this.errMsg
          }
        ],
        ready: false,
        dialog: false,
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
        userGrade: false //是否已测试
      }
    },
    methods: {
      initShare(){
        const { nickname, headimgurl } = this.userInfo;
        const level = this.level.toUpperCase();
        console.log(level, nickname, headimgurl)
        wx.onMenuShareTimeline({
          title: `${nickname}已在【法棍阅读】测试法语阅读水平, 他的水平是${level}`, // 分享标题
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
            title: `${nickname}已在【法棍阅读】测试法语阅读水平, 他的水平是${level}`, // 分享标题
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
        if(/^\d{11,13}$/.test(this.mobilePhone)) {
          this.goPay(true);
        }
      },
      goPay(flag) {
        if(this.userEnroll) {
          return;
        }
        if(!flag && !this.userBind) {
          this.phoneDialog = true;
          return;
        }
        enroll(this.semesterId, this.mobilePhone).then(res => {
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
                window.location.href = '/paid';
              }, 200);
            }
          });
          this.phoneDialog = false;
        }).catch((e)=>{
          console.log(e)
        })
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

//        if(this.level == 'n2') {
          axios.post('/api/user/evaluation/' + this.evaluationId + '/save?grade=' + this.level.toUpperCase())
//        }
      },
      select(item, index, idx) {
        item.testIdx = idx
        this.$set(this.data, index, item)
      }
    }
  }
</script>
