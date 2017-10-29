<script>
  export const todayStr = () => {
    var monthArr = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
    var today = new Date();
    return monthArr[today.getMonth()] + ' ' + today.getDate()
  }
</script>
