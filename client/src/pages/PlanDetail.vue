<template>
  <v-container class="orange planDetail-container">
    <div class="plan-list">
      <div class="plan-card" v-for="plan in data">
        <div class="plan-tag">Jour 22</div>
        <ul class="plan-detail">
          <li>
            <div class="qa">faire semblant</div>
            <div class="as">假装……</div>
          </li>
          <li>
            <div class="qa">faire semblant</div>
            <div class="as">假装……</div>
          </li>
          <li>
            <div class="qa">faire semblant</div>
            <div class="as">假装……</div>
          </li>
          <li>
            <div class="qa">faire semblant</div>
            <div class="as">假装……</div>
          </li>
          <li>
            <div class="qa">faire semblant</div>
            <div class="as">假装……</div>
          </li>
          <li>
            <div class="qa">faire semblant</div>
            <div class="as">假装……</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="indicator-wrap">
      <div class="indicator"></div>
      <div class="indicator active"></div>
      <div class="indicator"></div>
      <div class="indicator"></div>
    </div>
  </v-container>
</template>

<script>
  import '../stylus/planDetail.styl'
  export default {
    created(){
      document.title = '阅读计划'
    },
    data() {
      return {
        data: [0, 0, 0, 0, 0]
      }
    }
  }
</script>
