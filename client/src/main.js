import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Vuetify from 'vuetify'
import './stylus/main.styl'
import Index from './pages/index.vue'

Vue.use(Vuetify)
Vue.use(VueRouter)

const routes = [
  { path: '/', component: Index },
]
const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
