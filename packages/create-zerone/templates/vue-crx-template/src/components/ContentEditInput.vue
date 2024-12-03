<template>
  <div class="flex items-center gap-[4px]">
    <span v-show="!isEdit" class="text-[14px]">{{ value }}</span>
    <gm-icon v-show="!isEdit" size="24" class="cursor-pointer" @click="handleEdit"><i-ep-Edit /></gm-icon>
    <gm-input v-show="isEdit" ref="inputRef" v-model="editValue" placeholder="请输入内容" :style="{ width: realWidth }" @keyup.enter="saveEdit()" />

    <gm-button v-show="isEdit" size="small" type="primary" class="mr-[2px] shrink-0" @click="saveEdit()">保存</gm-button>
    <gm-icon v-show="isEdit" class="shrink-0 cursor-pointer" @click="cancelEdit"><i-ep-Close /></gm-icon>
  </div>
</template>
<script lang="ts" setup>
import { isNil } from 'giime';
import SvgIcon from '@/components/SvgIcon.vue';

const props = defineProps<{
  width?: number | string;
}>();
const realWidth = computed(() => {
  if (isNil(props.width) || Number.isNaN(Number(props.width))) {
    return props.width;
  } else {
    return `${props.width}px`;
  }
});
const emit = defineEmits<{
  (e: 'change', value: string): void;
}>();
const inputRef = useTemplateRef('inputRef');
const inputValue = defineModel<string>({ required: true });
const isEdit = ref(false);
const editValue = ref('');
const value = computed({
  get() {
    return inputValue.value;
  },
  set(value) {
    inputValue.value = value;
  },
});
// 开始编辑
const handleEdit = async () => {
  editValue.value = value.value;
  isEdit.value = !isEdit.value;
  await nextTick();
  inputRef.value?.focus();
};
// 保存编辑
const saveEdit = () => {
  value.value = editValue.value;
  isEdit.value = !isEdit.value;
  emit('change', value.value);
};
/**取消编辑 */
const cancelEdit = () => {
  isEdit.value = !isEdit.value;
};
</script>
