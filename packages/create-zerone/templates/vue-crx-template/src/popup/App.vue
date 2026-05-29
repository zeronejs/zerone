<script setup lang="ts">
// 在popup页面调试content script，仅用于开发环境，build前记得要注释掉。
// import '@/contentScripts';

const openOptions = () => {
  chrome.runtime.openOptionsPage();
};
</script>

<template>
  <div class="p-3 text-sm" style="min-width: 160px">
    <div class="mb-3 font-bold">插件控制台</div>
    <el-button type="primary" size="small" @click="openOptions">打开设置页</el-button>
  </div>
</template>

<style>
body {
  position: relative;
}
</style>
