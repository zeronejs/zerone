<script setup lang="ts">
import { TabPaneName } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
// route钩子，返回当前的路由地址
const route = useRoute();
// router钩子，返回路由器实例
const router = useRouter();
// 获取当前路由path
const path = route.path;

// 退出到Login页面
const onExit = () => {
  router.push('/login');
};
</script>

<template>
  <div class="M-nav">
    <el-tabs v-model="path" class="top-nav" stretch>
      <el-tab-pane label="Home" name="/home"></el-tab-pane>
      <el-tab-pane label="Account" name="/account"></el-tab-pane>
    </el-tabs>
    <el-button type="primary" class="btn-exit" @click="onExit">退出</el-button>
  </div>
</template>
