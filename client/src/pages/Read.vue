<template>
  <v-container>
    <div class="card pa-3 mb-3">
      <div class="subheading bold mb-3">前情提要</div>
      <div>发生了什么事情 ，bla bla bla.....</div>
    </div>
    <div class="card pa-3 mb-3">
      <div class="subheading bold mb-3">Chapitre 03</div>
      <div>
        It was half past five beofre ....<br>
        He was bright, eager, and in excellent spir....<br>
        It was half past five beofre ....<br>
        He was bright, eager, and in excellent spir.... <br>
        It was half past five beofre ....<br>
        He was bright, eager, and in excellent spir.... <br>
        It was half past five beofre ....<br>
        He was bright, eager, and in excellent spir.... <br>
      </div>
    </div>
    <div class="audio-wrap">
      <div class="btn__test-wrap">
        <v-btn round class="orange white--text btn__orange btn__test" href="/test">读完了，去测试</v-btn>
      </div>
      <div class="audio-progress">
        <div class="audio-progress-point"></div>
        <div class="audio-progress-line"></div>
      </div>
      <div class="audio-panel">
        <div>
          <div>Vitesse</div>
          <v-btn flat round fab>慢</v-btn>
          <v-btn round fab outline>常</v-btn>
          <v-btn flat round fab>快</v-btn>
        </div>
        <div>
          <span class="grey--text audio-current">02:34 / 05:00</span>
          <v-icon class="orange--text audio-icon">play_arrow</v-icon>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
  import '../stylus/read.styl'
  export default {
    created(){
      document.title = '今日阅读'
    },
    data() {
      return {
      }
    },
    methods: {
    }
  }
</script>
