import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/Login.vue'
import Home from '../pages/home/Home.vue'
import Page404 from '../pages/page404.vue'
import store from '../store/index'
Vue.use(Router)
const router = new Router({
  routes: [{
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/404',
      name: 'NotFound',
      component: Page404,
      hidden: true,
      meta: {
        title: "404"
      },
    },
    // 当什么都没有匹配到的时候，重定向页面到 404 页面
    {
      path: "/:pathMatch(.*)",
      redirect: "/404",
      name: "notMatch",
      hidden: true
    },
  ]
})
router.beforeEach((to, from, next) => {
  // ...
  // console.log('--to:', to);
  // console.log('store.state.core.userInfo:', store.state.core.userInfo)
  // if (store.state.core.userInfo) {
  // } else {
  // }
  if (to.path != '/') {
    if (store.state.core.userInfo) {
      next();
    } else {
      next('/');
    }
  } else {
    next();
  }
})

export default router
