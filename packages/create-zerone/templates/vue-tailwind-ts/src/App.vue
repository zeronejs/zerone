<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import LoginIframe from './views/LoginIframe.vue';
</script>

<template>
  <div>
    <RouterView />
    <LoginIframe />
  </div>
</template>
