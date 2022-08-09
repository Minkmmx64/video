import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/Admin',
  },
  {
    path: '/Admin',
    name: 'Admin',
    component: () => import("@/views/admin/AdminSys.vue"),
    children: [
      {
        name: "Home",
        path: "/Home",
        component: () => import("@/views/admin/home-manager/HomeView.vue")
      },
      {
        name: "VideoUpload",
        path: "/VideoUpload",
        component: () => import("@/views/admin/video-manager/VideoUpload.vue")
      },
      {
        name: "VideoList",
        path: "/VideoList",
        component: () => import("@/views/admin/video-manager/VideoList.vue")
      },
      {
        name: "UserList",
        path: "/UserList",
        component: () => import("@/views/admin/user-manager/UserList.vue")
      }
    ],
    redirect: '/Home',
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
export default router
