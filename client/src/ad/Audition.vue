<template>
  <div class="audition-container">
    <div class="box">
      <div class="title">为什么要学xx课？能帮助你什么？</div>
      <div class="item" v-for="item in list">
        <div>{{item.name}}</div>
        <div class="audio-panel">
          <div class="icon-play-lg"></div>
          <div class="audio-control">
            <div class="audio-progress">
              <div class="progress-point"></div>
              <div class="progress-line"></div>
            </div>
            <div class="duration"> 00:00 / 5:00</div>
          </div>
        </div>
      </div>

      <div class="btn-next">下一步</div>
    </div>
  </div>
</template>
<script>
  import '../stylus/sz/audition.styl';
  export default {
    created() {
      document.title = '三藏 x ENVOL';
    },

    methods: {

    },

    data() {
      return {
        list: [
          { name: '音频名称1', url: 'http://xxxx.xxx.xx' },
          { name: '音频名称2', url: 'http://xxxx.xxx.xx' },
          { name: '音频名称3', url: 'http://xxxx.xxx.xx' },
          { name: '音频名称4', url: 'http://xxxx.xxx.xx' },
          { name: '音频名称5', url: 'http://xxxx.xxx.xx' },
          { name: '音频名称6', url: 'http://xxxx.xxx.xx' },
        ]
      };
    }
  }
</script>