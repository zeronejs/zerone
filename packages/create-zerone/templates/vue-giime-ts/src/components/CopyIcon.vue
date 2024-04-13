<template>
  <el-icon class="relative top-[1px] ml-[2px] cursor-pointer" @click="handleCopy(String(str))"><CopyDocument /></el-icon>
</template>
<script setup lang="ts">
import { CopyDocument } from '@element-plus/icons-vue';
import { handleCopy } from '@/utils/copy';
defineProps<{
  str?: string | number;
}>();
</script>
