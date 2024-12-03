<template>
  <div class="mb-[12px] flex items-center">
    <div class="mr-[8px] h-[18px] w-[5px] rounded-md bg-[#4298f2]" />
    <h5 v-if="!slots.title" class="flex w-full items-center text-[16px] font-bold">
      <span>
        {{ title }}
      </span>
      <slot name="more" />
    </h5>
    <slot name="title" />
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  title?: string;
}>();
const slots = useSlots();
</script>
