<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore, useUserStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import Hamburger from '@/components/Hamburger/index.vue';
const appStore = useAppStore();
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const sidebar = computed(() => appStore.appSidebar);
const avatar = computed(() => userStore.userAvatar);
const toggleSideBar = () => appStore.toggleSideBar();
const logout = async () => {
    await userStore.logout();
    router.push(`/login?redirect=${route.fullPath}`);
};
</script>
<template>
    <div class="navbar">
        <Hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

        <Breadcrumb class="breadcrumb-container" />

        <div class="right-menu">
            <el-dropdown class="avatar-container" trigger="click">
                <div class="avatar-wrapper flex items-end">
                    <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
                    <el-icon><caret-bottom /></el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu class="user-dropdown">
                        <router-link to="/">
                            <el-dropdown-item> Home </el-dropdown-item>
                        </router-link>
                        <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
                            <el-dropdown-item>Github</el-dropdown-item>
                        </a>
                        <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
                            <el-dropdown-item>Docs</el-dropdown-item>
                        </a>
                        <el-dropdown-item divided @click="logout">
                            <span style="display: block">Log Out</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
