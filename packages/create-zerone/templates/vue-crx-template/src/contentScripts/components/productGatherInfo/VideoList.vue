<template>
  <div @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup">
    <div v-if="videoList.length === 0">
      <el-empty />
    </div>
    <div v-else>
      <el-checkbox :model-value="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group :model-value="checkedIndexsArr">
        <div class="flex flex-wrap">
          <div v-for="(it, index) in videoList" ref="imageListRefs" :key="index" class="">
            <el-checkbox class="lang-box mt-[8px]" :value="index" @change="toggleSelect(index)"> 选用 </el-checkbox>
            <div
              class="relative mr-[24px] flex h-[250px] w-[250px] select-none items-center justify-center"
              :style="{
                border: checkedIndexs.has(index) ? '3px solid #1890ff' : '3px solid #fff',
              }"
            >
              <video style="max-height: 250px; max-width: 250px" :src="it" controls />
            </div>
          </div>
        </div>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useCheckAll } from 'giime';

const props = defineProps<{
  videoList: string[];
}>();
const imageListRefs = ref<HTMLElement[]>();
const {
  checkedIndexs,
  checkedIndexsArr,
  checkAll,
  isIndeterminate,
  handleCheckAllChange,
  toggleSelect,

  mousedown,
  mousemove,
  mouseup,
} = useCheckAll<string>(props.videoList, {
  rectSelectParams: {
    canSelectListRefs: imageListRefs,
  },
});
checkedIndexs.value = new Set(props.videoList.map((it, index) => index));
defineExpose({
  checkedIndexsArr,
});
</script>
