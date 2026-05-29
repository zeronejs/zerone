<script setup lang="ts">
import { computed, ref } from 'vue';
import { getCrxConfig } from '@giime/crx';

const appendTo = getCrxConfig().contentScriptRoot as HTMLElement;

const emit = defineEmits(['onClose']);
const props = defineProps<{ visible: boolean }>();

const form = ref({
  name: '',
  remark: '',
});

const isVisible = computed({
  get() {
    return props.visible;
  },
  set() {
    emit('onClose');
  },
});

const submit = () => {
  // eslint-disable-next-line no-console
  console.log('[MainDialog] submit:', form.value);
  emit('onClose');
};
</script>

<template>
  <el-dialog v-if="isVisible" v-model="isVisible" title="CRX 对话框" width="480" :append-to="appendTo">
    <el-form label-width="60px" :model="form">
      <el-form-item label="名称">
        <el-input v-model="form.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isVisible = false">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="stylus"></style>
