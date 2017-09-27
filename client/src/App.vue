<template>
  <v-app light>
    <main>
      <router-view></router-view>
    </main>
    <v-bottom-nav :value="true" :active.sync="e1" class="white">
      <v-btn flat class="orange--text" value="recent">
        <span>阅读首页</span>
        <v-icon>home</v-icon>
      </v-btn>
      <v-btn flat class="orange--text" value="favorites">
        <span>阅读计划</span>
        <v-icon>date_range</v-icon>
      </v-btn>
      <v-btn flat class="orange--text" value="nearby">
        <span>个人中心</span>
        <v-icon>person_outline</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        e6: null,
        menu2: false,
        modal2: false,
        clipped: false,
        drawer: true,
        fixed: false,
        items: [
          { icon: 'bubble_chart', title: 'Inspire' }
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Vuetify.js',
        e1: ''
      }
    }
  }
</script>
