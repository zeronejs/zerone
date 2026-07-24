import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useCounterStore = defineStore('counter', () => {
  // SessionStorage持久化存储
  const count = useSessionStorage<number>('useCounterStore', 0, { listenToStorageChanges: false });
  const doubleCount = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});
