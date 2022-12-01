<script setup lang="ts">
import { compile } from 'path-to-regexp';
import { ref, watch } from 'vue';
import { RouteLocationMatched, RouteRecordRedirectOption, useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const levelList = ref<RouteLocationMatched[]>([]);
const getBreadcrumb = () => {
    // only show routes with meta.title
    const matched = route.matched.filter(item => item.meta && item.meta.title);
    const first = matched[0];

    if (!isDashboard(first)) {
        matched.unshift({ path: '/dashboard', meta: { title: 'Dashboard' } } as RouteLocationMatched);
        // matched = [{ path: '/dashboard', meta: { title: 'Dashboard' } }].concat(matched);
    }

    levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
};
const isDashboard = (route: RouteLocationMatched) => {
    const name = route && route.name;
    if (!name) {
        return false;
    }
    return name.toString().trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase();
};
const pathCompile = (path: RouteRecordRedirectOption) => {
    // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
    const { params } = route;
    let toPath = compile(path.toString());
    return toPath(params);
};
const handleLink = (item: RouteLocationMatched) => {
    const { redirect, path } = item;
    if (redirect) {
        if (router.currentRoute.value.path === redirect) {
            return console.log('已是当前页');
        }
        return router.push(redirect.toString());
    }
    router.push(pathCompile(path));
};
watch(route, () => getBreadcrumb());
getBreadcrumb();
</script>

<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
                <span
                    v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
                    class="no-redirect"
                >
                    {{ item.meta.title }}
                </span>
                <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;

    .no-redirect {
        color: #97a8be;
        cursor: text;
    }
}
</style>
