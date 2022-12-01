<script setup lang="ts">
import { useResizeHandler } from './composables/ResizeHandler';
import { Navbar, Sidebar, AppMain } from './components';
const { sidebar: sidebarRef, device, fixedHeader, classObj, handleClickOutside } = useResizeHandler();
</script>
<template>
    <div :class="classObj" class="app-wrapper">
        <div v-if="device === 'mobile' && sidebarRef.opened" class="drawer-bg" @click="handleClickOutside" />
        <Sidebar class="sidebar-container" />
        <div class="main-container">
            <div :class="{ 'fixed-header': fixedHeader }">
                <Navbar />
            </div>
            <AppMain />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
// @import "@/styles/variables.scss";
$sideBarWidth: 210px;

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}
.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px);
}

.mobile .fixed-header {
    width: 100%;
}
</style>
