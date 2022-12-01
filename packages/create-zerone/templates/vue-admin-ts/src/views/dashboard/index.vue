<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/store';
const userStore = useUserStore();
const name = computed(() => userStore.userName);
const roles = computed(() => userStore.userRoles);
</script>
<template>
    <div class="dashboard-container">
        <div class="dashboard-text">name: {{ name }}</div>
        <div class="dashboard-text">
            roles: <span v-for="role in roles" :key="role">{{ role }}</span>
        </div>
        <h1 class="text-3xl font-bold underline text-center">Hello world!</h1>
    </div>
</template>

<style lang="scss" scoped>
.dashboard {
    &-container {
        margin: 30px;
    }
    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}
</style>
