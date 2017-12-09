<template>
  <v-container class="orange" style="text-align: center;padding-bottom: 10px;">
    <img src="../assets/logo@2x.png" height="22px" class="mt-1 mb-3"/>
    <div class="card overdue-card">
      <div>
        <img src="../assets/overdue@2x.png" height="123px">
      </div>
      <p class="orange--text" style="font-weight: 500;margin-top: 22px;line-height: 28px;">这位宝宝很抱歉，本次法棍制作已开始，<br>
        你不得不做下一批法棍了。</p>
    </div>
    <div class="overdue-footer">
      关注法棍阅读  更多课程即将推出
    </div>
  </v-container>
</template>
<script>
  export default {
    created() {
      document.title = '个人中心'
    }
  }
</script>
<style>
  .overdue-card {
    box-shadow: 0 2px 10px rgba(252,147,61,0.8);
    height: calc(74vh);
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .overdue-footer {
    color: #fff;
    font-size: 14px;
    line-height: 2;
    margin-top: 4vh;
  }
</style>
