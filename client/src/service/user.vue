<script>
/**
 * Created by charles on 2017/10/19.
 */
import axios from 'axios'
const instance = axios.create({
  baseURL: '/',
  timeout: 3000
});

export const bind = (semesterId, mobilePhone) => {
  return instance.post('api/userSemester/' + semesterId + '/reservation?mobilePhone=' + mobilePhone)
}

export const signature = (url)=>{
  return instance.get('/api/wx/signature?url=' + url)
}

export const check = (semesterId)=>{
  return instance.get('api/userSemester/' + semesterId + '/check')
}
</script>
