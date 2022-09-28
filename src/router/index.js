import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import Player from '../views/Player.vue'
import Login from '../views/Login.vue'
import loginService from '@/services/login.service'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/player',
    name: 'player',
    component: Player
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to,from,next)=>{
  const protected_routes = ['epg', 'player'];
  const {isLogged} = loginService(); 

  if(protected_routes.includes(to.name)){
    if(isLogged.value){
      next();
    }
    else{
      router.replace({name: "login"});
    }
  }
  else{
    next();
  }
})

export default router
