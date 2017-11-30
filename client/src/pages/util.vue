<script>
  export const todayStr = () => {
    var monthArr = ['Jan.','Fév.','Mars','Avr.','Mai','Juin','Juillet','Août','Sept.','Oct.','Nov.','Déc.'];
    var today = new Date();
    return monthArr[today.getMonth()] + ' ' + today.getDate()
  }

  export const formatDate = (date) => {
    var today = new Date(date);
    var year = today.getFullYear()
    var month = today.getMonth() + 1
    var day = today.getDate()
    if(month < 10){
      month = '0' + month
    }
    if(day < 10){
      day = '0' + day
    }
    return `${year}-${month}-${day}`
  }
</script>
