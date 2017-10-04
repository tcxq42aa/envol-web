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
                 @click="viewDetail(date)"
                 :class="{ finished: dateEqual(date, today), 'white-bg': !dateEqual(date, today)}">{{index + 1}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-link mt-5 mb-4">
      <v-btn round class="orange white--text btn__orange" @click="viewDetail(today)">开始学习</v-btn>
      <a href="javascript:;" @click="viewDetail(today)">&lt; 点击日期  进入当日阅读</a>
    </div>
    <div class="book-list">
      <div class="book-item" v-for="book in books">
        <div class="book-media">
          <img src="../../public/book.png" alt="book">
        </div>
        <div class="book-content">
          <div class="small">第xx期</div>
          <div>《我是书名》</div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
  import '../stylus/plan.styl'
  const MONTH_MAP = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  export default {
    created(){
      document.title = '阅读计划'
      this.initCalender()
    },
    data() {
      return {
        emptyDates: [],
        dates: [],
        today: new Date(),
        MONTH_MAP: MONTH_MAP,
        books: [0, 0]
      }
    },
    methods: {
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

      dateEqual(l, r){
        return l.getFullYear() * 10000 + l.getMonth() * 100 + l.getDate() == r.getFullYear() * 10000 + r.getMonth() * 100 + r.getDate()
      },

      viewDetail(date) {
        this.$router.push('/planDetail?date=' + date.getTime())
      }
    }
  }
</script>
