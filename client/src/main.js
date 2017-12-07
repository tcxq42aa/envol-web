import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Vuetify from 'vuetify'
import './stylus/content.styl'
import './stylus/main.styl'
import '../public/css/font.css'
const Index = () => import('./pages/index.vue')
const Plan = () => import('./pages/plan.vue')
const UC = () => import('./pages/uc.vue')
const Badge = () => import('./pages/badge.vue')
const Appointment = () => import('./pages/Appointment.vue')
const Test = () => import('./pages/Test.vue')
const Read = () => import('./pages/Read.vue')
const TestLand = () => import('./pages/TestLand.vue')
const TestShare = () => import('./pages/TestShare.vue')
const Practice = () => import('./pages/Practice.vue')
const PracticeShare = () => import('./pages/PracticeShare.vue')
const Paid = () => import('./pages/PaySuccess')
const WordList = () => import('./pages/wordList')
const Handout = () => import('./pages/handout')
const MailBox = () => import('./pages/mailBox')
const Land = () => import('./pages/land')

Vue.use(Vuetify)
Vue.use(VueRouter)

const routes = [
  { path: '/index', component: Index },
  // { path: '/plan', component: Plan },
  { path: '/uc', component: UC },
  { path: '/appointment', component: Appointment },
  { path: '/test', component: Test },
  { path: '/testLand', component: TestLand },
  { path: '/testShare', component: TestShare },
  // { path: '/read', component: Read },
  // { path: '/practice', component: Practice },
  { path: '/practiceShare', component: PracticeShare },
  { path: '/paid', component: Paid },
  { path: '/badge', component: Badge },
  // { path: '/wordList', component: WordList },
  // { path: '/handout', component: Handout },
  // { path: '/mailBox', component: MailBox },
  { path: '/land', component: Land },
  { path: '*', redirect: '/uc' }
]
const router = new VueRouter({
  mode: 'history',
  routes // （缩写）相当于 routes: routes
})

const app = new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
