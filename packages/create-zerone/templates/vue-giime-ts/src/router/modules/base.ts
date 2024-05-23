import type { RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
const baseRouters: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: '首页',
    },
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: '关于页',
    },
  },
];
export default baseRouters;
