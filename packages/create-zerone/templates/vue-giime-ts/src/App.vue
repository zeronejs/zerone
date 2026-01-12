<script setup lang="ts">
import { watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Clarity from '@microsoft/clarity';

const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID;

if (clarityProjectId) {
  Clarity.init(clarityProjectId);
}
const route = useRoute();
const includeNames = ref(new Set<string>());

watch(route, value => {
  if (value.name && value.meta.keepAlive) {
    includeNames.value.add(value.name as string);
  }
});
/**需要缓存的列表 */
const includeList = computed(() => [...includeNames.value]);
</script>

<template>
  <div>
    <router-view v-slot="{ Component }">
      <keep-alive :include="includeList">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
