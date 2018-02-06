<template>
  <v-container class="read-container">
    <div class="card pa-3 mb-3" v-if="tractate">
      <div v-html="tractate"></div>
    </div>
  </v-container>
</template>

<script>
  import { bus } from '../bus.vue'
  import axios from 'axios'
  import { formatDate } from './util.vue'
  var qs = require('querystringify');
  export default {
    created(){
      document.title = '今日阅读';
      this.handler = (data) => {
        let date = qs.parse(location.search).date;
        let readToday = (date || formatDate(new Date(serverTime).getTime()));
        let appData = data
        let paper = this.paper = appData.paper;

        this.tractate = this.paper && this.paper.tractate;
        this.semesterId = this.paper && this.paper.semesterId;
        axios.post('/api/user/review/' + paper.id + '/save?semesterId=' + this.semesterId + '&readToday=' + formatDate(paper.readToday));
        if(!paper || paper.wordsTotal == 0) {
          this.tractate = this.paper && this.paper.handout;
        }
      }
      bus.$on('done', this.handler)
    },
    destroyed(){
      bus.$off('done', this.handler)
    },
    mounted(){
    },
    data() {
      return {
        paper: {},
        tractate: null,
        semesterId: 0,
        percent: 0,
      }
    },
    computed: {
    },
    methods: {

    }
  }
</script>
