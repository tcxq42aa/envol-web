<template>
  <div>
    <img src="../../public/yuyue.jpg" alt="" width="100%">
    <div class="btn-appoint">
      <div style="font-size: 12px;flex-grow: 1;background: #fff;justify-content: center;display: flex;flex-direction: column;text-align: right;padding-right: 16px;">
        <div style="color: #000"><strong>每天</strong> <span style="font-size: 18px;color: #ffb531">¥5.5</span> <strong>尽享法语阅读</strong></div>
        <div style="color: rgb(153,153,153)">495元/期/90天</div>
      </div>
      <div class="orange" style="flex-grow: 0;width: 120px;line-height: 1.3;font-size: 15px;padding-top: 10px;" @click="dialog = true">
        <span>立即报名</span><br>
        <span style="font-size: 12px;">预约立减 ¥20</span>
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
        <v-card-text>当前手机号已经预约过</v-card-text>
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
  import {bind} from '../service/user'
  export default {
    created(){
      console.log(this.$route.query.semesterId)
    },
    methods: {
      bindPhone() {
        const reg = /^1[34578]\d{9}$/
        const self = this
        if(reg.test(this.mobilePhone)) {
          bind(this.$route.query.semesterId, this.mobilePhone).then( res => {
            self.dialog = false;
            self.successDialog = false;
          }).catch( e => {
            self.dialog = false;
            if(e.response.data.code == 4001) {
              self.failDialog = true;
            }
          })
        }
      }
    },
    data() {
      return {
        dialog: false,
        failDialog: false,
        successDialog: false,
        errMsg: '',
        mobilePhone: '',
        emailRules: [
          (v) => !!v || '请填写您的手机号码',
          (v) => /^1[34578]\d{9}$/.test(v) || '您的手机号码有误',
          (v) => {
            console.log(this.errMsg)
            return !this.errMsg || this.errMsg
          }
        ]
      }
    }
  }
</script>
