import { createRouter, createWebHistory } from 'vue-router';
import { useTitle } from '@vueuse/core';
import type { RouteRecordRaw } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    keepAlive?: boolean;
  }
}
/**
 * 自动导入 modules 下的所有路由
 */
const moduleFiles: Record<`./modules/*${string}.ts`, RouteRecordRaw[]> = import.meta.glob('./modules/**/*.ts', { import: 'default', eager: true });
const modules: Array<RouteRecordRaw> = Object.values(moduleFiles).flat();

export const routes: Array<RouteRecordRaw> = [...modules];
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL ?? '/'),
  routes,
});
const title = useTitle();

// 更改路由后  更改title
router.afterEach(to => {
  title.value = to.meta?.title ?? `${to.name?.toString()}`;
});
export default router;
