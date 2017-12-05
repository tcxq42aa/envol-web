<template>
  <div>
    <img src="../../public/yuyue.jpg" alt="" width="100%">
    <div class="btn-appoint">
      <div style="font-size: 12px;flex-grow: 1;background: #fff;justify-content: center;display: flex;flex-direction: column;text-align: right;padding-right: 16px;">
        <div style="color: #000"><strong>每天</strong> <span style="font-size: 18px;color: #ffb531">¥5.5</span> <strong>尽享法语阅读</strong></div>
        <div style="color: rgb(153,153,153)">495元/期/90天</div>
      </div>
      <div :class="{'orange': true, 'disabled': userEnroll}" style="flex-grow: 0;width: 120px;line-height: 54px;font-size: 15px;"
           @click="onSubmit()">
        <span>{{buttonText}}</span>
        <!--<br><span style="font-size: 12px;">预约立减 ¥20</span>-->
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
          <v-btn class="blue--text darken-1" flat @click.native="failDialog = false">我知道了</v-btn>
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
  export default {
    created(){
      check(this.$route.query.semesterId).then( res => {
        this.userBind = res.data.bind;
        this.userReservation = res.data.reservation;
        this.userEnroll = res.data.enroll;
      })
    },
    methods: {
      onSubmit() {
        if(this.userBind) {
          this.bindPhone();
        } else {
          this.dialog = true;
        }
      },
      bindPhone() {
        const reg = /^\d{11,12}$/
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
//          bind(this.$route.query.semesterId, this.mobilePhone).then( res => {
//            if(res.data.status == 200) {
//              self.dialog = false;
//              self.successDialog = true;
//              self.failDialog = false;
//            } else {
//              self.dialog = false;
//              self.successDialog = false;
//              self.failDialog = true;
//              self.failMessage = res.data.message;
//            }
//          }).catch((e)=>{
//            self.dialog = false;
//            self.successDialog = false;
//            self.failDialog = true;
//          })
          window.location.href = '/testLand?semesterId=' + this.$route.query.semesterId;
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
            console.log(e)
        })
      }
    },
    data() {
      return {
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
          (v) => /^\d{11,12}$/.test(v) || '您的手机号码有误',
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
        if(this.userEnroll) {
          return '已报名'
        } else {
//          if(this.userReservation) {
//            return '立即报名'
//          } else {
//            return '立即预约'
//          }
          return '立即报名'
        }
      }
    }
  }
</script>
