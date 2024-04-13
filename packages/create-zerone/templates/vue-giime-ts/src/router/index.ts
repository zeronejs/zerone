import { createRouter, createWebHistory } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { baseRouters } from './modules/base';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
  }
}
export const routes = [...baseRouters];
const router = createRouter({
  history: createWebHistory('/'),
  routes,
});
const title = useTitle();
// 更改路由后  更改title
router.afterEach((to, from) => {
  title.value = to.meta?.title ?? `三方-${to.name?.toString()}`;
});
export default router;
