<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore, usePermissionStore, useSettingStore } from '@/store';
import Logo from './Logo.vue';
import SidebarItem from './SidebarItem.vue';
const appStore = useAppStore();
const permissionStore = usePermissionStore();
const settingStore = useSettingStore();
const route = useRoute();
const permissionRoutes = computed(() => permissionStore.permissionRoutes);
const sidebar = computed(() => appStore.appSidebar);
const activeMenu = computed(() => {
    const { meta, path } = route;
    // if set path, the sidebar will highlight the path you set
    if (meta.activeMenu) {
        return meta.activeMenu;
    }
    return path;
});
const showLogo = computed(() => settingStore.sidebarLogo);
const variables = computed(() => ({ menuText: '#bfcbd9', menuActiveText: '#409EFF', menuBg: '#304156' }));
const isCollapse = computed(() => !sidebar.value.opened);
</script>
<template>
    <div :class="{ 'has-logo': showLogo }">
        <Logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse"
                :background-color="variables.menuBg"
                :text-color="variables.menuText"
                :unique-opened="false"
                :active-text-color="variables.menuActiveText"
                :collapse-transition="false"
                mode="vertical"
            >
                <SidebarItem
                    v-for="curRoute in permissionRoutes"
                    :key="curRoute.path"
                    :item="curRoute"
                    :base-path="curRoute.path"
                />
            </el-menu>
        </el-scrollbar>
    </div>
</template>
