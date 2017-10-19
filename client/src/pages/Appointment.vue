<template>
  <div>
    <img src="../../public/yuyue.png" alt="" width="100%">
    <div class="btn-appoint" @click="dialog = true">预约</div>
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
      <v-card>
        <v-card-title>
          <span class="headline">预约</span>
        </v-card-title>
        <v-card-text>预约成功</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat @click.native="successDialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import '../stylus/appointment.styl'
  import {bind} from '../service/user'
  export default {
    methods: {
      bindPhone() {
        const reg = /^1[34578]\d{9}$/
        const self = this
        if(reg.test(this.mobilePhone)) {
          bind(this.mobilePhone).then( res => {
            self.dialog = false;
            self.successDialog = true;
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
