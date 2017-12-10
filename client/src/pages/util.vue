<script>
  export const todayStr = (date) => {
    var monthArr = ['JAN.','FÉV.','MARS','AVR.','MAI','JUIN','JUILLET','AOÛT','SEPT.','OCT.','NOV.','DÉC.'];
    var today = new Date();
    if(date) {
      today = new Date(date);
    }
    return monthArr[today.getMonth()] + ' ' + today.getDate()
  }

  export const todayFullStr = (date) => {
    var monthArr = ['JANVIER','FÉVRIER','MARS','AVRIL','MAI','JUIN','JUILLET','AOÛT','SEPTEMBRE','OCTOBRE','NOVEMBRE','DÉCEMBRE'];
    var today = new Date();
    if(date) {
      today = new Date(date);
    }
    return monthArr[today.getMonth()] + ' ' + today.getDate()
  }

  export const formatDate = (date, sep) => {
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
    return `${year}${sep||'-'}${month}${sep||'-'}${day}`
  }

  export const formatDateInverse = (date, sep) => {
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
    return `${day}${sep||'-'}${month}${sep||'-'}${year}`
  }
</script>
