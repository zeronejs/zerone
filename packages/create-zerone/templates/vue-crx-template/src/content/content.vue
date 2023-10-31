<script setup lang="ts">
import { ref } from 'vue';
import MainDialog from '@/content/components/mainDialog/mainDialog.vue';
import contentIcon from '@/content/images/content-icon.png';
console.log(location.href);
// 对话框显示状态
const isShowMainDialog = ref(false);
</script>

<template>
  <el-config-provider>
    <div class="CRX-content">
      123123123
      <el-image :src="contentIcon" class="fixed bottom-[100px] right-[60px] z-50 h-[50px] w-[50px]" @click="isShowMainDialog = true" />
      <MainDialog
        :visible="isShowMainDialog"
        @onClose="
          () => {
            isShowMainDialog = false;
          }
        "
      />
    </div>
  </el-config-provider>
</template>

<!-- <style scoped lang="stylus">
.CRX-content
    .content-entry
        position: fixed
        z-index: 9999
        bottom: 100px
        right: 20px
        width: 50px
        height: 50px
        background: url('images/content-icon.png')
        background-size: 100% 100%
        cursor: pointer
</style> -->
