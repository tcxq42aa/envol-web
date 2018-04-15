<script>
/**
 * Created by charles on 2017/10/19.
 */
import axios from 'axios'
const instance = axios.create({
  baseURL: '/',
  timeout: 7000
});

export const bind = (semesterId, mobilePhone) => {
  return instance.post('api/userSemester/' + semesterId + '/reservation?mobilePhone=' + mobilePhone)
}
export const enroll = (semesterId, mobilePhone) => {
  return instance.post('api/userSemester/' + semesterId + '/enroll?mobilePhone=' + mobilePhone)
}

export const signature = (url)=>{
  return instance.get('/api/wx/signature?url=' + url)
}

export const check = (semesterId)=>{
  return instance.get('api/userSemester/' + semesterId + '/check')
}
export const share = (paperId)=>{
  return instance.put('api/user/course/' + paperId + '/share')
}
export const getWordList = ({ semesterId, day, grade })=>{
  return instance.get('api/user/' + semesterId + '/wordList/history', { params: {
    day, grade
  }})
}
</script>
