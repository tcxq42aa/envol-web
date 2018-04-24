<template>
  <div class="container" @click="cancelPay">
    <div v-for="data in list">

      <!-- 模块名 -->
      <div class="category" v-if="data.showName">{{data.name}}</div>

      <!-- 图片 -->
      <div class="banner" v-if="data.type=='image'">
        <img :src="data.url" width="100%" height="100%">
      </div>

      <!-- 列表 -->
      <div class="card" v-for="item in data.items">
        <div class="card-item" v-if="data.type=='list'">
          <div class="card-icon">
            <img src="../assets/sz/cover.png">
          </div>
          <div class="card-content">
            <div>{{item.title}}</div>
            <div>{{item.desc}}</div>
            <div class="remark">
              <span>
                <span>{{item.creator}}</span>
                <span>{{item.createTime}}</span>
                <span v-if="item.vip" class="tag-vip">付费</span>
              </span>
              <span>{{item.duration}}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 文本 -->
      <div class="card" v-if="data.type=='text'">{{data.text}}</div>

    </div>

    <!-- 底部按钮 -->
    <div class="footer" @click.stop>
      <div class="left">
        <router-link to="/audition">
          <span>免费试听</span><img src="../assets/sz/icon-play.png" width="20px" height="20px">
        </router-link>
      </div>
      <div class="right" @click="openPay">{{ payEnabled? '立即购买' : '购买课程' }}</div>
    </div>
    <!-- 底部按钮浮层 -->
    <div class="footer-layer" :class="{'active': showLayer}" @click.stop>
      <div class="item" :class="{'active': term == 1}" @click="chooseTerm(1)">月卡</div>
      <div class="item" :class="{'active': term == 6}" @click="chooseTerm(6)">半年卡</div>
      <div class="item" :class="{'active': term == 12}" @click="chooseTerm(12)">年卡</div>
    </div>
  </div>
</template>
<script>
  import { enroll } from '../service/user';
  import '../stylus/sz/intro.styl';
  const defaultBanner = require('../assets/sz/ad1.png');
  export default {
    created() {
      document.title = '课程介绍';
    },

    methods: {
      openPay() {
        this.showLayer = true;
        if(this.payEnabled) {
          this.startPay();
        }
      },
      cancelPay() {
        this.term = 0;
        this.payEnabled = false;
        this.showLayer = false;
      },
      chooseTerm(value) {
        this.term = value;
        if(value > 0) {
          this.payEnabled = true;
        }
      },
      startPay() {
        enroll(this.semesterId, '', this.term).then(res => {
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
      }
    },

    data() {
      return {
        payEnabled: false,
        showLayer: false,
        term: 0,
        list: [
          {
            name: 'banner',
            type: 'image',
            url: defaultBanner
          },
          {
            name: '描述',
            type: 'text',
            text: '说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案'
          },
          {
            name: '免费试听',
            type: 'list',
            showName: true,
            items: [
              { title: '课程名称1', desc: '一行最多14字符最好不超过两行', creator: 'Seb', duration: '40:00' },
              { title: '课程名称2', desc: '一行最多14字符最好不超过两行', creator: 'Seb', duration: '40:00' },
              { title: '课程名称3', desc: '一行最多14字符最好不超过两行', creator: 'Seb', duration: '40:00' },
              { title: '课程名称4', desc: '一行最多14字符最好不超过两行', creator: 'Seb', duration: '40:00' },
            ]
          },
          {
            name: '最近更新',
            type: 'list',
            showName: true,
            items: [
              { title: '课程名称1', desc: '一行最多14字符最好不超过两行', createTime: '2018-03-08', vip: true, duration: '30: 00' },
              { title: '课程名称2', desc: '一行最多14字符最好不超过两行', createTime: '2018-03-08', vip: true, duration: '30: 00' },
              { title: '课程名称3', desc: '一行最多14字符最好不超过两行', createTime: '2018-03-08', vip: true, duration: '30: 00' },
            ]
          },
          {
            name: '购买须知',
            type: 'text',
            showName: true,
            text: '说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案'
          }
        ]
      };
    }
  }
</script>