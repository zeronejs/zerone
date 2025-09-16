<script setup lang="ts">
import MainDialog from '@/contentScripts/components/mainDialog/mainDialog.vue';
import contentIcon from '@/contentScripts/images/content-icon.png';

// 对话框显示状态
const isShowMainDialog = ref(false);
</script>

<template>
  <div>
    <div class="CRX-content">
      12312
      <el-image class="fixed bottom-[100px] right-[60px] z-50 h-[50px] w-[50px]" :src="contentIcon" @click="isShowMainDialog = true" />
      <MainDialog
        :visible="isShowMainDialog"
        @onClose="
          () => {
            isShowMainDialog = false;
          }
        "
      />
    </div>
  </div>
</template>
