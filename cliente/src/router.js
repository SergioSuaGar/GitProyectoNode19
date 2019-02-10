import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Meteo from './views/Meteo.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
        path: '/home',
        name: 'home',
        component: Home
    },
    {
      path: '/meteo',
      name: 'meteo',
      component: Meteo
    }
  ]
})
