<template>
  <div>
    <img src="../../public/yuyue.png" alt="" width="100%">
    <div class="btn-appoint" @click="dialog = true">预约</div>
    <v-dialog v-model="dialog" persistent width="80%">
      <v-btn primary dark slot="activator">Open Dialog</v-btn>
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
  </div>
</template>

<script>
  import '../stylus/appointment.styl'
  import axios from 'axios'
  const instance = axios.create({
    baseURL: process.env.NODE_ENV !== 'production' ? 'http://127.0.0.1:3100/' : '/',
    timeout: 3000
  });
  export default {
    methods: {
      bindPhone() {
        const reg = /^1[34578]\d{9}$/
        if(reg.test(this.mobilePhone)) {
          instance.put('/api/user/bind?mobilePhone=' + this.mobilePhone).then( res => {
            this.dialog = false;
          }).catch( e => console.log(e))
        } else {
        }
      }
    },
    data() {
      return {
        dialog: false,
        mobilePhone: '',
        emailRules: [
          (v) => !!v || '请填写您的手机号码',
          (v) => /^1[34578]\d{9}$/.test(v) || '您的手机号码有误'
        ]
      }
    }
  }
</script>
