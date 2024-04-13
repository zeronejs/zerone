<template>
  <main class="text-center">
    <!-- tailwindcss -->
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
    <!-- svg icon -->
    <div>
      svg icon <gm-icon><SvgIcon icon-class="jump" /></gm-icon> iconfont <i class="gfont icon-yonghu1" />
    </div>
    <!-- element icon -->
    <div>
      element icon <gm-icon><CirclePlus /></gm-icon>
    </div>
    <!-- element-plus -->
    <gm-table :data="tableData" style="width: 100%">
      <gm-table-column prop="date" label="Date" width="180" />
      <gm-table-column prop="name" label="Name" width="180" />
      <gm-table-column prop="address" label="Address" />
    </gm-table>
    <gm-row class="mb-4">
      <gm-button>Default</gm-button>
      <gm-button type="primary">Primary</gm-button>
      <gm-button type="success">Success</gm-button>
      <gm-button type="info">Info</gm-button>
      <gm-button type="warning">Warning</gm-button>
      <gm-button type="danger">Danger</gm-button>
    </gm-row>
    <ul class="flex flex-wrap p-9">
      <li v-for="(item, index) in routes" :key="index" class="mb-3 ml-3">
        <gm-button type="primary" @click="$router.push(item.path)">{{ item.path }}</gm-button>
      </li>
    </ul>
  </main>
</template>
<script setup lang="ts">
import { CirclePlus } from '@element-plus/icons-vue';
import { routes } from '@/router';
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
