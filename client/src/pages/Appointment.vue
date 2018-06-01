<template>
  <div>
    <div style="font-size: 0">
      <img src="../../public/images/1.png" width="100%">
      <img src="../../public/images/2.png" width="100%">
      <img src="../../public/images/3.png" width="100%">
      <img src="../../public/images/4.png" width="100%">
      <img src="../../public/images/5.png" width="100%">
      <img src="../../public/images/6.png" width="100%">
      <img src="../../public/images/7.png" width="100%">
    </div>
    <div class="btn-appoint">
      <div style="font-size: 12px;flex-grow: 1;background: #fff;justify-content: center;display: flex;flex-direction: column;text-align: right;padding-right: 16px;">
        <div style="color: #000"><strong>每天</strong> <span style="font-size: 18px;color: #ffb531">10分钟</span> <strong>尽享法语阅读</strong></div>
        <!--<div style="color: rgb(153,153,153)">495元/期/90天</div>-->
      </div>
      <div v-if="ready && mode==0" class="" :class="{'orange': true, 'disabled': userReservation || disableAppointment}" style="flex-grow: 0;width: 120px;line-height: 54px;font-size: 15px;"
           @click="onSubmit()">
        <span>{{buttonText}}</span>
        <!--<br><span style="font-size: 12px;">预约立减 ¥20</span>-->
      </div>
      <div v-if="ready && mode==1" :class="{'orange': true, 'disabled': userEnroll || disableAppointment}" style="flex-grow: 0;width: 120px;line-height: 54px;font-size: 15px;"
           @click="onSubmit()">
        <span>{{buttonText}}</span>
      </div>
    </div>
    <v-dialog v-model="dialog" persistent width="80%">
      <v-card>
        <v-card-title>
          <span class="headline">预约</span>
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
          <v-btn class="blue--text darken-1" flat @click.native="dialog = false">取消</v-btn>
          <v-btn class="blue--text darken-1" flat @click.native="bindPhone()">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="failDialog" persistent width="80%">
      <v-card>
        <v-card-title>
          <span class="headline">预约</span>
        </v-card-title>
        <v-card-text>{{failMessage || '已经预约过了'}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat @click.native="failDialog = false;failMessage=''">我知道了</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="successDialog" persistent width="80%">
      <div style="color: #fff;text-align:center;height: 100%;width: 100%;box-shadow: 0!important;position: fixed;top: 14%;left: 0;bottom: 0">
        <p style="margin-bottom: 30px;color: rgb(252, 147, 61);font-size: 18px">Bravo！<br>你已经预约成功了！</p>
        <p style="margin-bottom: 30px;">那么，我接下来要干嘛呢？</p>
        <p style="margin-bottom: 30px;">一、预约后耐心等待，<br>随后会统一通知预约的同学做入学测试，<br>分配报名的等级。</p>
        <p style="margin-bottom: 60px;">二、测试后可正式报名，补尾款。<br>（成功后怎么操作届时会有提示。）</p>
        <v-btn round class="orange btn--large white--text btn__orange btn__next" @click="successDialog = false">我知道了</v-btn>
      </div>
    </v-dialog>
  </div>
</template>

<script>
  import '../stylus/appointment.styl'
  import {bind, check, enroll} from '../service/user'
  import {getSemesterDetail} from '../service/semester'
  export default {
    created(){
      this.$route.query.active = 'false';
      if(this.$route.query.active=='true'){
        this.mode = 1;
      }
      this.semesterId = this.$route.query.semesterId;
      check(this.semesterId).then( res => {
        console.log(res);
        this.ready = true;
        this.userBind = res.data.bind;
        this.userReservation = res.data.reservation;
        this.userEnroll = res.data.enroll;
      });
      getSemesterDetail(this.semesterId).then( res => {
        const semester = res.data;
        let beginDate = this.beginDate = semester.appointmentBeginDate;
        let endDate = this.endDate = semester.appointmentEndDate;
        if(this.mode == 1) {
          beginDate = this.beginDate = semester.enrollBeginDate;
          endDate = this.endDate = semester.enrollEndDate;
        }
        if(endDate) {
          endDate = this.endDate = endDate + 86400000;
        }

        if((beginDate && beginDate > this.now) || (endDate && endDate < this.now)) {
          this.disableAppointment = true;
        }
      });

      var that = this;
      wx.ready(function(){
        wx.onMenuShareTimeline({
          title: `一起读法语现代小说，学最实用表达`, // 分享标题
          link: encodeURI(`https://www.envol.vip/appointment?semesterId=${that.semesterId}`), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'https://www.envol.vip/imgs/headimg.jpeg', // 分享图标
          success: function (data) {
          },
          cancel: function (data) {
          }
        });
        wx.onMenuShareAppMessage({
          title: `一起读法语现代小说，学最实用表达`, // 分享标题
          desc: '爱法语，怎能不阅读？开始法语阅读，做个更有深度的法语人。', // 分享描述
          link: encodeURI(`https://www.envol.vip/appointment?semesterId=${that.semesterId}`), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'https://www.envol.vip/imgs/headimg.jpeg', // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          success: function (data) {
          },
          cancel: function (data) {
          }
        });
      });

    },
    methods: {
      onSubmit() {
//        window.location.href = '/testLand?semesterId=' + this.$route.query.semesterId;
        if(this.userBind) {
          this.bindPhone();
        } else {
          this.dialog = true;
        }
      },
      bindPhone() {
        const reg = /^[\d\w\s+-]{8,28}$/
        const self = this
        if(this.$route.query.active=='true'){
          this.requestPay();
          this.dialog = false;
          return
        }
        if(this.userReservation){
          self.failDialog = true;
          return;
        }
        if(this.userBind || reg.test(this.mobilePhone)) {
          bind(this.$route.query.semesterId, this.mobilePhone).then( res => {
            if(res.data.status == 200) {
              self.dialog = false;
              self.successDialog = true;
              self.failDialog = false;

              if(self.mode == 0) {
                self.userReservation = true;
              } else if(self.mode == 1) {
                self.userEnroll = true;
              }

            } else {
              self.dialog = false;
              self.successDialog = false;
              self.failDialog = true;
              self.failMessage = res.data.message;
            }
          }).catch((e)=>{
            self.dialog = false;
            self.successDialog = false;
            self.failDialog = true;
          })
        }
      },
      requestPay(){
        enroll(this.$route.query.semesterId, this.mobilePhone).then(res => {
          var data = res.data;
          wx.chooseWXPay({
            timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
            package: data.pkg, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: data.paySign, // 支付签名
            success: function (res) {
              // 支付成功后的回调函数
              window.location.href = '/paid';
            }
          });
        }).catch((e)=>{
          if(e.response.status == 403) {
            this.failDialog = true;
            this.failMessage = '不能同时参加多个课程';
          }
            console.log(e)
        })
      }
    },
    data() {
      return {
        now: new Date(serverTime).getTime(),
        disableAppointment: false, // 关闭预约
        ready: false, // 页面是否加载完成
        beginDate: 0,
        endDate: 0,
        mode: 0, // 0开启预约，1开启报名
        userBind: false, // 是否绑定手机
        userReservation: false,// 是否预约
        userEnroll: false,// 是否报名
        dialog: false,
        failDialog: false,
        failMessage: '',
        successDialog: false,
        errMsg: '',
        mobilePhone: '',
        emailRules: [
          (v) => !!v || '请填写您的手机号码',
          (v) => /^[\d\w\s+-]{8,28}$/.test(v) || '您的手机号码有误',
//          (v) => /^1[34578]\d{9}$/.test(v) || '您的手机号码有误',
          (v) => {
            return !this.errMsg || this.errMsg
          }
        ]
      }
    },
    computed: {
      // 计算属性的 getter
      buttonText(){
        if(this.mode == 0) {
          if(this.userReservation) {
            return '已预约'
          } else if(this.disableAppointment){
            if(this.beginDate && this.beginDate > this.now) {
              return '预约未开始';
            }
            if(this.endDate && this.endDate < this.now) {
              return '预约已结束';
            }
          } else {
            return '立即预约'
          }
        } else if(this.mode == 1) {
          if(this.userEnroll) {
            return '已报名'
          } else if(this.disableAppointment){
            return '报名已结束'
          } else {
            return '立即报名'
          }
        }
      }
    }
  }
</script>
