<script>
/**
 * Created by charles on 2017/10/19.
 */
import axios from 'axios'
const instance = axios.create({
  baseURL: process.env.NODE_ENV !== 'production' ? 'http://127.0.0.1:3100/' : '/',
  timeout: 3000
});

export const bind = (mobilePhone) => {
  return instance.put('/api/user/bind?mobilePhone=' + mobilePhone)
}

export const signature = (url)=>{
  return instance.get('/api/wx/signature?url=' + url)
}
</script>
