<script setup lang="ts">
import { watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';

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
