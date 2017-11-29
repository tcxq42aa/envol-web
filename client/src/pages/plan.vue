<template>
  <v-container fluid>
    <v-layout row wrap class="pb-3">
      <v-flex xs4 class="plan-status"><span>当日已读</span> <div class="point"></div></v-flex>
      <v-flex xs4 class="plan-status"><span>补读</span> <div class="point-1"></div></v-flex>
      <v-flex xs4 class="plan-status"><span>未完成</span> <div class="point-2"></div></v-flex>
    </v-layout>
    <div class="plan-panel card orange">
      <div class="calender-year">{{today.getFullYear()}}</div>
      <div class="calender-panel">
        <div class="month-title">{{MONTH_MAP[today.getMonth()]}}</div>
        <div class="week-wrap">
          <div class="week-title">SUN</div>
          <div class="week-title">MON</div>
          <div class="week-title">TUE</div>
          <div class="week-title">WED</div>
          <div class="week-title">THU</div>
          <div class="week-title">FRI</div>
          <div class="week-title">SAT</div>
        </div>
        <div class="day-wrap">
          <div class="day-title" v-for="(date, index) in emptyDates"></div>
          <div class="day-title" v-for="(date, index) in dates">
            <div class="day"
                 @click="viewDetail(date, '/read')"
                 :class="dateStatus(date, statistical)">{{index + 1}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-link mt-5 mb-4" v-if="paper">
      <v-btn round class="orange white--text btn__orange" @click="viewDetail(today, '/wordList')">开始学习</v-btn>
      <a href="javascript:;" @click="viewDetail(today, '/read')">&lt; 点击日期  进入当日阅读</a>
    </div>
    <div class="book-list">
      <div class="book-item" v-if="book && book.id">
        <div class="book-media">
          <img :src="'http://support.envol.vip/' + book.coverUrl" alt="book">
        </div>
        <div class="book-content">
          <div class="small">{{book.description}}</div>
          <div>《{{book.name}}》</div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
  import '../stylus/plan.styl'
  import { bus } from '../bus.vue'
  import { formatDate } from './util.vue'
  const MONTH_MAP = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  export default {
    created(){
      document.title = '阅读计划';
      this.initCalender()
      this.handler = (data) => {
        this.paper = data.paper;
        this.book = data.book;
        this.tractate = this.paper && this.paper.tractate;
        this.semesterId = this.paper && this.paper.semesterId;
        this.statistical = data.statistical;
        this.semester = data.semester;
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
        today: new Date(),
        MONTH_MAP: MONTH_MAP,
        books: [0, 0],
        paper: null,
        book: null,
        statistical: [],
        semester: null
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
      handleRedirect(){
        this.$router.replace('/testLand')
      },
      initCalender() {
        let d1 = new Date()
        d1.setDate(1)
        d1 = d1.getDay()
        let d2 = new Date()
        d2.setMonth(d2.getMonth() + 1)
        d2.setDate(0)
        let count = d2.getDate()
        let emptyDates = new Array(d1).fill(0)
        let dates = new Array(count).fill(0)
        dates = dates.map((date, idx)=>{
          let d = new Date()
          d.setDate(idx + 1)
          return d
        })
        this.emptyDates = emptyDates
        this.dates = dates
      },

      dateStatus(date){
        let dateStr = formatDate(date)
        let f = this.statistical.find(item => formatDate(item.readToday) == dateStr)
        if(dateStr > formatDate(Date.now())) {
          return ''
        }
        if(!this.semester || (dateStr > formatDate(this.endDate) || dateStr < formatDate(this.beginDate))) {
          return ''
        }
        if(f) {
          if(formatDate(f.createTime) > dateStr) {
            return 'white-bg'
          }
        }
        return f ? 'finished' : 'unfinished'
      },

      viewDetail(date, path) {
        let dateStr = formatDate(date.getTime())
        if(!this.semester || (dateStr > formatDate(this.endDate) || dateStr < formatDate(this.beginDate))) {
          return;
        }
        if(dateStr > formatDate(Date.now())) {
          return
        }
        this.$router.push(path + '?date=' + formatDate(date.getTime()));
      }
    }
  }
</script>
