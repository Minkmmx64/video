import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/Home',
  },
  {
    path: '/VideoPlayer',
    name: 'VideoPlayer',
    component: () => import("@/views/VideoPlayer.vue")
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    //component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: "/Home",
    name: "Home",
    component: () => import("@/views/HomeView.vue")
  },
  {
    path: "/Login",
    name: "Login",
    component: () => import("@/views/LoginScreen.vue")
  },
  {
    path: "/NotFound",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue")
  },
  {
    path: "/ContributionScreen",
    name: "ContributionScreen",
    component: () => import("@/views/ContributionScreen.vue")
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/NotFound",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
export default router
