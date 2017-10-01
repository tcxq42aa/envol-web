import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Vuetify from 'vuetify'
import './stylus/main.styl'
import '../public/css/font.css'
const Index = () => import('./pages/index.vue')
const Plan = () => import('./pages/plan.vue')
const UC = () => import('./pages/uc.vue')
const Appointment = () => import('./pages/appointment.vue')

Vue.use(Vuetify)
Vue.use(VueRouter)

const routes = [
  { path: '/index', component: Index },
  { path: '/plan', component: Plan },
  { path: '/uc', component: UC },
  { path: '/appointment', component: Appointment },
  { path: '*', redirect: '/index' }
]
const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
