import { asyncRoutes, constantRoutes } from '@/router';
import { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles: string[], route: RouteRecordRaw) {
    if (route.meta && route.meta.roles) {
        const metaRoles = route.meta.roles as string[];
        return roles.some(role => metaRoles.includes(role));
    } else {
        return true;
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]) {
    const res: RouteRecordRaw[] = [];

    routes.forEach(route => {
        const tmp = { ...route };
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles);
            }
            res.push(tmp);
        }
    });

    return res;
}
interface PermissionState {
    routes: RouteRecordRaw[];
    addRoutes: RouteRecordRaw[];
}
export const usePermissionStore = defineStore({
    id: 'permission',
    state: (): PermissionState => ({
        routes: [],
        addRoutes: [],
    }),
    getters: {
        permissionRoutes: state => state.routes,
    },
    actions: {
        async generateRoutes(roles: string[]) {
            let accessedRoutes: RouteRecordRaw[] = [];
            if (roles.includes('admin')) {
                accessedRoutes = asyncRoutes || [];
            } else {
                accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
            }
            this.routes = constantRoutes.concat(accessedRoutes);
            this.addRoutes = accessedRoutes;
            return accessedRoutes;
        },
    },
});
