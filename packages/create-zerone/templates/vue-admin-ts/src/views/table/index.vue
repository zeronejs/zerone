<script setup lang="ts">
import { ref } from 'vue';
import { getList } from '@/api/table';

const list = ref([]);
const listLoading = ref(true);
const fetchData = async () => {
    listLoading.value = true;
    const res = await getList();
    list.value = res.data.items;
    listLoading.value = false;
};
const statusFilter = (status: string): string => {
    const statusMap = {
        published: 'success',
        draft: 'warning',
        deleted: 'danger',
    };
    return Reflect.get(statusMap, status);
};
fetchData();
</script>
<template>
    <div class="app-container">
        <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
        >
            <el-table-column align="center" label="ID" width="95">
                <template #default="scope">
                    {{ scope.$index }}
                </template>
            </el-table-column>
            <el-table-column label="Title">
                <template #default="scope">
                    {{ scope.row.title }}
                </template>
            </el-table-column>
            <el-table-column label="Author" width="110" align="center">
                <template #default="scope">
                    <span>{{ scope.row.author }}</span>
                </template>
            </el-table-column>
            <el-table-column label="Pageviews" width="110" align="center">
                <template #default="scope">
                    {{ scope.row.pageviews }}
                </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="Status" width="110" align="center">
                <template #default="scope">
                    <el-tag :type="statusFilter(scope.row.status)">{{ scope.row.status }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="DisplayTime" width="200">
                <template #default="scope">
                    <i class="el-icon-time" />
                    <span>{{ scope.row.displayTime }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
