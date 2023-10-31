<script setup lang="ts">
// 在popup页面调试content script，仅用于开发环境，build前记得要注释掉。
// import '@/content';
console.log('popup');
// console.log
</script>

<template>
  <router-view />
</template>
<style>
body {
  position: relative;
  width: 380px;
  height: 510px;
}
</style>
