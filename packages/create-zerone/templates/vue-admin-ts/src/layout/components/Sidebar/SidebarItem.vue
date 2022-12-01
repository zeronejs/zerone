<script setup lang="ts">
import path from 'path-browserify';
import { isExternal } from '@/utils/validate';
import IconItem from './Item';
import AppLink from './Link.vue';
// import { useFixiOSBug } from './FixiOSBug';
import { PropType, ref } from 'vue';
import { RouteRecordRaw } from 'vue-router';
const props = defineProps({
    item: {
        type: Object as PropType<RouteRecordRaw>,
        required: true,
    },
    isNest: {
        type: Boolean,
        default: false,
    },
    basePath: {
        type: String,
        default: '',
    },
});
// const { subMenu } = useFixiOSBug();
const onlyOneChild = ref();
const hasOneShowingChild = (children: RouteRecordRaw[] = [], parent: RouteRecordRaw) => {
    const showingChildren = children.filter(item => {
        if (item.meta?.hidden) {
            return false;
        } else {
            // Temp set(will be used if only has one showing child)
            onlyOneChild.value = item;
            return true;
        }
    });

    // When there is only one child router, the child router is displayed by default
    if (showingChildren.length === 1) {
        return true;
    }

    // Show parent if there are no child router to display
    if (showingChildren.length === 0) {
        onlyOneChild.value = { ...parent, path: '', noShowingChildren: true };
        return true;
    }

    return false;
};
const resolvePath = (routePath: string) => {
    if (isExternal(routePath)) {
        return routePath;
    }
    if (isExternal(props.basePath)) {
        return props.basePath;
    }
    return path.resolve(props.basePath, routePath);
};
</script>

<template>
    <div>
        <template v-if="!item.meta?.hidden">
            <li
                v-if="
                    hasOneShowingChild(item.children, item) &&
                    (!onlyOneChild.children || onlyOneChild.noShowingChildren)
                    //  &&
                    // !item.alwaysShow
                "
            >
                <AppLink v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
                    <el-menu-item
                        :index="resolvePath(onlyOneChild.path)"
                        :class="{ 'sub-menu-title-noDropdown': !isNest }"
                    >
                        <IconItem :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" />
                        <template #title>{{ onlyOneChild.meta?.title }}</template>
                    </el-menu-item>
                </AppLink>
            </li>

            <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
                <template v-if="item.meta" #title>
                    <IconItem
                        :elSvgIcon="item.meta && item.meta.elSvgIcon"
                        :icon="item.meta && item.meta.icon"
                    />
                    <span>{{ item.meta?.title }}</span>
                </template>

                <SidebarItem
                    v-for="child in item.children"
                    :key="child.path"
                    :is-nest="true"
                    :item="child"
                    :base-path="resolvePath(child.path)"
                    class="nest-menu"
                />
            </el-sub-menu>
        </template>
    </div>
</template>
