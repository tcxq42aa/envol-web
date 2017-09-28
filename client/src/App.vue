<template>
  <v-app light>
    <main>
      <router-view></router-view>
    </main>
    <v-bottom-nav :value="true" :active.sync="currentPage" class="white">
      <v-btn flat class="orange--text" value="/index" @click="switchTab('/index')">
        <span>阅读首页</span>
        <v-icon>home</v-icon>
      </v-btn>
      <v-btn flat class="orange--text" value="/plan" @click="switchTab('/plan')">
        <span>阅读计划</span>
        <v-icon>date_range</v-icon>
      </v-btn>
      <v-btn flat class="orange--text" value="/uc" @click="switchTab('/uc')">
        <span>个人中心</span>
        <v-icon>person_outline</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-app>
</template>

<script>
  export default {
    mounted(){
      this.currentPage = location.pathname
    },
    data () {
      return {
        currentPage: '/index'
      }
    },
    methods: {
      switchTab(e) {
        this.$router.replace(e)
      }
    }
  }
</script>
