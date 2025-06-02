// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login/Login.vue'
import MainPage from '../components/MainPage/MainPage.vue'

const routes = [
  { path: '/', component: Login, name: 'Login' },
  { path: '/MainPage', component: MainPage, name: 'MainPage' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
