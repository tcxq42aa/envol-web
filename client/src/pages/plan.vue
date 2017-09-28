<template>
  <v-container fluid>
    <v-layout row wrap class="pl-3 pr-3 pb-3 pt-3">
      <v-flex xs4 class="plan-status"><span>当日已读</span> <div class="point"></div></v-flex>
      <v-flex xs4 class="plan-status"><span>补读</span> <div class="point-1"></div></v-flex>
      <v-flex xs4 class="plan-status"><span>未完成</span> <div class="point-2"></div></v-flex>
    </v-layout>
    <!--<div class="plan-panel card orange pl-3 pr-3 pb-3">-->
      <!--<div class="calender-year">2017</div>-->
    <!--</div>-->
  </v-container>
</template>

<script>
  import '../stylus/plan.styl'
  export default {
    data() {
      return {}
    }
  }
</script>
