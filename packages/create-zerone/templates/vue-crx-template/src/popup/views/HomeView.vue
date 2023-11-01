<template>
  <main class="text-center">
    <!-- tailwindcss -->
    <h1 class="text-3xl font-bold underline">Hello world123!</h1>
    <!-- svg icon -->
    <div>
      <!-- svg icon <el-icon><SvgIcon icon-class="jump" /></el-icon> -->
    </div>
    <!-- element icon -->
    <div>
      {{ data }}
      element icon <el-icon><CirclePlus /></el-icon>
    </div>
    <!-- <el-image :src="Logo" class="fixed bottom-[100px] right-[60px] z-50 h-[50px] w-[50px]" /> -->
    <!-- element-plus -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
    <el-row class="mb-4">
      <el-button>Default</el-button>
      <el-button type="primary">Primary</el-button>
      <el-button type="success">Success</el-button>
      <el-button type="info">Info</el-button>
      <el-button type="warning">Warning</el-button>
      <el-button type="danger">Danger</el-button>
    </el-row>
  </main>
</template>
<script setup lang="ts">
import { CirclePlus } from '@element-plus/icons-vue';
import Logo from '@/assets/logo.svg';
const data = ref(123);
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
];
</script>
