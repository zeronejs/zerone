import { createRouter as vueCreateRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

/* Layout */
import Layout from '@/layout/index.vue';
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
declare module 'vue-router' {
    interface RouteMeta {
        hidden?: boolean;
        title?: string;
        icon?: string;
        elSvgIcon?: string;
        activeMenu?: string;
    }
}
export const constantRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            hidden: true,
        },
    },

    {
        path: '/404',
        component: () => import('@/views/404.vue'),
        meta: {
            hidden: true,
        },
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: { title: 'Dashboard', icon: 'dashboard' },
            },
        ],
    },

    {
        path: '/example',
        component: Layout,
        redirect: '/example/table',
        name: 'Example',
        //using el svg icon, the elSvgIcon first when at the same time using elSvgIcon and icon
        meta: { title: 'Example', elSvgIcon: 'helpFilled' },
        children: [
            {
                path: 'table',
                name: 'Table',
                component: () => import('@/views/table/index.vue'),
                meta: { title: 'Table', icon: 'table' },
            },
            {
                path: 'tree',
                name: 'Tree',
                component: () => import('@/views/tree/index.vue'),
                meta: { title: 'Tree', icon: 'tree' },
            },
        ],
    },

    {
        path: '/form',
        component: Layout,
        children: [
            {
                path: 'index',
                name: 'Form',
                component: () => import('@/views/form/index.vue'),
                meta: { title: 'Form', icon: 'form' },
            },
        ],
    },
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes: RouteRecordRaw[] = [
    {
        path: '/nested',
        component: Layout,
        redirect: '/nested/menu1',
        name: 'Nested',
        meta: {
            title: 'Nested',
            icon: 'nested',
        },
        children: [
            {
                path: 'menu1',
                component: () => import('@/views/nested/menu1/index.vue'), // Parent router-view
                name: 'Menu1',
                meta: { title: 'Menu1' },
                children: [
                    {
                        path: 'menu1-1',
                        component: () => import('@/views/nested/menu1/menu1-1/index.vue'),
                        name: 'Menu1-1',
                        meta: { title: 'Menu1-1' },
                    },
                    {
                        path: 'menu1-2',
                        component: () => import('@/views/nested/menu1/menu1-2/index.vue'),
                        name: 'Menu1-2',
                        meta: { title: 'Menu1-2' },
                        children: [
                            {
                                path: 'menu1-2-1',
                                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1/index.vue'),
                                name: 'Menu1-2-1',
                                meta: { title: 'Menu1-2-1' },
                            },
                            {
                                path: 'menu1-2-2',
                                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2/index.vue'),
                                name: 'Menu1-2-2',
                                meta: { title: 'Menu1-2-2' },
                            },
                        ],
                    },
                    {
                        path: 'menu1-3',
                        component: () => import('@/views/nested/menu1/menu1-3/index.vue'),
                        name: 'Menu1-3',
                        meta: { title: 'Menu1-3' },
                    },
                ],
            },
            {
                path: 'menu2',
                component: () => import('@/views/nested/menu2/index.vue'),
                meta: { title: 'menu2' },
            },
        ],
    },

    {
        path: '/external-link',
        component: Layout,
        children: [
            {
                redirect: '/external-link',
                path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
                meta: { title: 'External Link', icon: 'link' },
            },
        ],
    },

    // 404 page must be placed at the end !!!
    // using pathMatch install of "*" in vue-router 4.0
    {
        path: '/:pathMatch(.*)',
        redirect: '/404',
        meta: {
            hidden: true,
        },
    },
];

const createRouter = () =>
    vueCreateRouter({
        // mode: 'history', // require service support
        scrollBehavior: () => ({ top: 0 }),
        history: createWebHashHistory(),
        routes: constantRoutes,
    });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    // router.matcher = newRouter.matcher; // reset router
}

export default router;
