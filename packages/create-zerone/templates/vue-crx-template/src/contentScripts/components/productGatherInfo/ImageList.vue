<template>
  <div @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup">
    <div v-if="imgList.length === 0">
      <el-empty />
    </div>
    <div v-else>
      <el-checkbox :model-value="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group :model-value="checkedIndexsArr">
        <div class="flex flex-wrap">
          <div v-for="(it, index) in imgList" ref="imageListRefs" :key="index" class="">
            <el-checkbox class="lang-box mt-[8px]" :value="index" @change="toggleSelect(index)"> 选用 </el-checkbox>
            <div
              class="relative mr-[24px] flex h-[165px] w-[165px] select-none justify-center"
              :style="{
                border: checkedIndexs.has(index) ? '3px solid #1890ff' : '3px solid #fff',
              }"
            >
              <!-- 预览 -->
              <el-popover placement="top-start" :width="500" :hide-after="0" trigger="hover" :teleported="false">
                <template #reference>
                  <div
                    class="absolute right-[4px] top-[4px] z-10 flex h-[20px] w-[20px] items-center justify-center bg-black bg-opacity-30 text-white"
                  >
                    <el-icon size="16"><i-ep-Search /></el-icon>
                  </div>
                </template>
                <!-- 预览图片 -->
                <el-image class="w-full" draggable="false" :src="it" />
              </el-popover>
              <!-- 展示的图片 -->
              <el-image class="h-[160px]" draggable="false" :src="it" @click="toggleSelect(index)" />
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
  imgList: string[];
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
} = useCheckAll<string>(props.imgList, {
  rectSelectParams: {
    canSelectListRefs: imageListRefs,
  },
});
checkedIndexs.value = new Set(props.imgList.map((it, index) => index));

defineExpose({
  checkedIndexsArr,
});
</script>
