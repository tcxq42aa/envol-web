<template>
  <v-container fluid>
    <div class="selection-wrap">
      <select name="current" id="current" class="selection" @change="handleSemesterChange">
        <option v-for="semester in paidList" :value="semester.id">{{semester.name}}</option>
      </select>
      <div class="selection-arrow"></div>
    </div>

    <v-layout row wrap class="pb-1 mb-3" v-if="mode==1">
      <v-flex xs4 class="plan-status"><span>当日已读</span> <div class="point"></div></v-flex>
      <v-flex xs4 class="plan-status"><span>补读</span> <div class="point-1"></div></v-flex>
      <v-flex xs4 class="plan-status"><span>未完成</span> <div class="point-2"></div></v-flex>
    </v-layout>
    <v-layout row wrap class="pb-1" v-if="mode==2">
      <v-flex xs12 class="plan-status"><span>已复习</span> <div class="point"></div></v-flex>
    </v-layout>

    <div class="plan-panel card orange">
      <div class="calender-year">{{today.getFullYear()}}</div>
      <div class="calender-panel">
        <div class="month-title">
          <span @click="prevMonth" class="prev">&lt;</span>
          <span>{{MONTH_MAP[today.getMonth()]}}</span>
          <span @click="nextMonth" class="next">&gt;</span>
        </div>
        <div class="week-wrap">
          <div class="week-title">DIM</div>
          <div class="week-title">LUN</div>
          <div class="week-title">MAR</div>
          <div class="week-title">MER</div>
          <div class="week-title">JEU</div>
          <div class="week-title">VEN</div>
          <div class="week-title">SAM</div>
        </div>
        <div class="day-wrap">
          <div class="day-title" v-for="(date, index) in emptyDates"></div>
          <div class="day-title" v-for="(date, index) in dates">
            <div class="day"
                 @click="viewDetail(date)"
                 :class="dateStatus(date, statistical)">{{index + 1}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-5 mb-3" style="text-align: center;color:#999">点击日期  进入当日阅读</div>
    <div class="btn-link mb-4">
      <!--<v-btn round class="orange white&#45;&#45;text btn__orange" @click="viewDetail(today)">开始学习</v-btn>-->
      <v-btn round class="orange white--text btn__orange" style="width: 50%" @click="viewWordList()">往期词表</v-btn>
      <div class="switcher off" v-if="mode == 1" @click="switchMode(2)">Normal</div>
      <div class="switcher on" v-if="mode == 2" @click="switchMode(1)">Révision</div>
    </div>
    <div class="book-list">
      <div class="book-item" v-if="book && book.id">
        <div class="book-media">
          <img :src="'https://static.envol.vip' + book.coverUrl" alt="book">
        </div>
        <div class="book-content">
          <div class="small">{{book.description}}</div>
          <div>《{{book.name}}》</div>
        </div>
      </div>
    </div>
    <v-snackbar
      :timeout="4000"
      bottom
      v-model="showTooltip"
    >{{tooltipMsg}}</v-snackbar>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import '../stylus/plan.styl'
  import { bus } from '../bus.vue'
  import { formatDate } from './util.vue'
  var qs = require('querystringify')
  const MONTH_MAP = ['JANVIER','FÉVRIER','MARS','AVRIL','MAI','JUIN','JUILLET','AOÛT','SEPTEMBRE','OCTOBRE','NOVEMBRE','DÉCEMBRE'];
  export default {
    created(){
      document.title = '阅读计划';
      this.initCalender()
      this.getPaidList()
      this.handler = (data) => {
        this.paper = data.paper;
        this.book = data.book;
        this.tractate = this.paper && this.paper.tractate;
        this.semesterId = data.semester && data.semester.id;
        this.statistical = data.statistical;
        this.semester = data.semester;
        let monthDiff = new Date(serverTime).getMonth() - new Date(this.semester.endDate).getMonth();
        monthDiff = Math.max(0, monthDiff);
        this.today = new Date(serverTime);
        this.diff = -monthDiff;
        this.today.setDate(1);
        this.today.setMonth(this.today.getMonth() - monthDiff);
        this.initCalender(-monthDiff);
      }
      bus.$on('done', this.handler)
      bus.$once('needTest', this.handleRedirect.bind(this))
    },
    destroyed(){
      bus.$off('done', this.handler)
    },
    data() {
      return {
        emptyDates: [],
        dates: [],
        today: new Date(serverTime),
        MONTH_MAP: MONTH_MAP,
        books: [0, 0],
        paper: null,
        book: null,
        statistical: [],
        semester: null,
        diff: 0,
        showTooltip: false,
        tooltipMsg: '',
        reviewStatistical: [],
        paidList: [], // 已报名列表
        mode: 1 // 1: 正常, 2: 复习
      }
    },
    computed: {
      beginDate() {
        return this.semester ? this.semester.beginDate : null
      },
      endDate() {
        return this.semester ? this.semester.endDate : null
      }
    },
    methods: {
      prevMonth(){
//        if(this.diff <= -3) {
//          return;
//        }
        this.diff = this.diff - 1;
        this.today.setDate(1);
        this.today.setMonth(this.today.getMonth() - 1);
        this.initCalender(this.diff);
      },
      nextMonth(){
        if(this.diff == 0) {
          return;
        }
        this.diff = this.diff + 1;
        this.today.setDate(1);
        this.today.setMonth(this.today.getMonth() + 1);
        this.initCalender(this.diff);
      },
      handleRedirect(){
        this.$router.replace('/testLand')
      },
      initCalender(diff) {
        let d1 = new Date(serverTime)
        let a = d1.getTimezoneOffset()*60000 + d1.getTime() + 3600000*8;
        d1 = new Date(a);
        d1 = new Date(d1.getFullYear(), d1.getMonth()+1 + (diff||0), 0);
        d1.setDate(1)
        d1 = d1.getDay()
        let d2 = new Date(serverTime)
        let b = d2.getTimezoneOffset()*60000 + d2.getTime() + 3600000*8;
        d2 = new Date(b);
        d2 = new Date(d2.getFullYear(), d2.getMonth()+1 + (diff||0), 0);
//        d2.setDate(1);
//        d2.setMonth(d2.getMonth() + 1 + diff||0)
//        d2.setDate(0)
        let count = d2.getDate()
        let emptyDates = new Array(d1).fill(0)
        let dates = new Array(count).fill(0)
        dates = dates.map((date, idx)=>{
          let d = new Date(serverTime)
          let c = d.getTimezoneOffset()*60000 + d.getTime() + 3600000*8;
          d = new Date(c);
//          if(diff < 0) {
            d.setMonth(d.getMonth() + (diff||0));
//          }
          d.setDate(idx + 1)
          return d
        })
        this.emptyDates = emptyDates
        this.dates = dates
      },

      dateStatus(date){
        var statistical = []
        if(this.mode == 1) {
          statistical = this.statistical;
        } else if(this.mode == 2) {
          statistical = this.reviewStatistical;
        }
        let dateStr = formatDate(date)
        let f = statistical.find(item => formatDate(item.readToday, '-', true) == dateStr)
        if(dateStr > formatDate(new Date(serverTime).getTime())) {
          return ''
        }
        if(!this.semester || (dateStr > formatDate(this.endDate, '-', true) || dateStr < formatDate(this.beginDate, '-', true))) {
          return ''
        }

        if(this.mode == 1) {
          if(f) {
            if(formatDate(f.createTime, '-', true) > dateStr) {
              return 'white-bg'
            }
          }
          return f ? 'finished' : 'unfinished';
        } else if(this.mode == 2) {
          return f ? 'finished' : '';
        }

      },

      viewDetail(date) {
        let dateStr = formatDate(date.getTime())
        var path = '/read';
        if(this.mode == 1) {
          path = '/read';
        } else if(this.mode == 2) {
          path = '/review';
          let f = this.statistical.find(item => formatDate(item.readToday, '-', true) == dateStr)
          if(!f) {
            this.showTooltip = true;
            this.tooltipMsg = 'Tu n’as pas fini la tâche de ce jour.';
            return;
          }
        }
        if(!this.semester || (dateStr > formatDate(this.endDate, '-', true) || dateStr < formatDate(this.beginDate))) {
          return;
        }
        if(dateStr > formatDate(new Date(serverTime).getTime())) {
          return
        }
        this.$router.push(path + '?date=' + formatDate(date.getTime()) + '&semesterId=' + this.semesterId||'');
      },

      viewWordList() {
        this.$router.push('/wordList?range=all&date=' + formatDate(new Date(serverTime).getTime()) + '&semesterId=' + this.semesterId);
      },

      switchMode(mode) {
        this.mode = mode;
        if(mode==2) {
          axios.get('/api/user/review/statistical?semesterId=' + this.semesterId).then((response) => {
            this.reviewStatistical = response.data;
            this.initCalender(this.diff);
          })
        }
      },

      getPaidList() {
        axios.get('/api/semester/paidList').then(({ data }) => {
          this.paidList = data
        })
      },

      handleSemesterChange(e) {
        let date = qs.parse(location.search).date || formatDate(new Date(serverTime).getTime());
        axios.post('/api/user/today?readToday=' + date + '&semesterId=' + e.target.value).then(({data}) => {
          this.handler(data.data)
        });
      }
    }
  }
</script>
