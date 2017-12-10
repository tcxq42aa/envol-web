<script>
  export const todayStr = (date) => {
    var monthArr = ['JAN.','FÉV.','MARS','AVR.','MAI','JUIN','JUILLET','AOÛT','SEPT.','OCT.','NOV.','DÉC.'];
    var today = new Date(serverTime);
    if(date) {
      today = new Date(date);
    }
    return monthArr[today.getMonth()] + ' ' + today.getDate()
  }

  export const todayFullStr = (date) => {
    var monthArr = ['JANVIER','FÉVRIER','MARS','AVRIL','MAI','JUIN','JUILLET','AOÛT','SEPTEMBRE','OCTOBRE','NOVEMBRE','DÉCEMBRE'];
    var today = new Date(serverTime);
    if(date) {
      today = new Date(date);
    }
    return monthArr[today.getMonth()] + ' ' + today.getDate()
  }

  export const formatDate = (date, sep, flag) => {
    var today;
    if(date) {
      today = new Date(date);
    } else {
      today = new Date(serverTime);
    }
    if(flag) {
      let a = today.getTimezoneOffset()*60000 + today.getTime() + 3600000*8;
      today = new Date(a);
    }
    var year = today.getFullYear()
    var month = today.getMonth() + 1
    var day = today.getDate()
    if(month < 10){
      month = '0' + month
    }
    if(day < 10){
      day = '0' + day
    }
    return `${year}${sep||'-'}${month}${sep||'-'}${day}`
  }

  export const formatDateInverse = (date, sep) => {
    var today;
    if(date) {
      today = new Date(date);
    } else {
      today = new Date(serverTime);
    }
    var year = today.getFullYear()
    var month = today.getMonth() + 1
    var day = today.getDate()
    if(month < 10){
      month = '0' + month
    }
    if(day < 10){
      day = '0' + day
    }
    return `${day}${sep||'-'}${month}${sep||'-'}${year}`
  }
</script>
