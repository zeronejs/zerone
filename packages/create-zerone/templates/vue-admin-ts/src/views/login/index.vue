<script setup lang="ts">
import { validUsername } from '@/utils/validate';
import { nextTick, reactive, ref, watch } from 'vue';
import { useUserStore } from '@/store';
import { useRouter, useRoute } from 'vue-router';
import { ElForm, ElInput } from 'element-plus';
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
// https://element-plus.gitee.io/zh-CN/component/form.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%A1%E9%AA%8C%E8%A7%84%E5%88%99
const validateUsername = (rule: any, value: string, callback: any) => {
    if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'));
    } else {
        callback();
    }
};
const validatePassword = (rule: any, value: string, callback: any) => {
    if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'));
    } else {
        callback();
    }
};
const loginRules = reactive({
    username: [{ required: true, trigger: 'blur', validator: validateUsername }],
    password: [{ required: true, trigger: 'blur', validator: validatePassword }],
});
const loginForm = reactive({
    username: 'admin',
    password: '111111',
});
const loading = ref(false);
const passwordType = ref('password');
const redirect = ref();
const passwordRef = ref<InstanceType<typeof ElInput>>();
const showPwd = () => {
    if (passwordType.value === 'password') {
        passwordType.value = '';
    } else {
        passwordType.value = 'password';
    }
    nextTick(() => {
        passwordRef.value?.focus();
    });
};
const loginFormRef = ref<InstanceType<typeof ElForm>>();
const handleLogin = () => {
    loginFormRef.value?.validate(async valid => {
        if (valid) {
            loading.value = true;
            await userStore.login(loginForm);
            loading.value = false;
            // catch todo
            router.push({ path: redirect.value || '/' });
        } else {
            console.log('error submit!!');
            return false;
        }
    });
};
watch(
    () => route.query,
    query => {
        redirect.value = query && query.redirect;
    },
    {
        immediate: true,
    }
);
</script>
<template>
    <div class="login-container">
        <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            auto-complete="on"
            label-position="left"
        >
            <div class="title-container">
                <h3 class="title">Login Form</h3>
            </div>

            <el-form-item prop="username" class="mb-3">
                <span class="svg-container">
                    <svg-icon icon-class="user" />
                </span>
                <el-input
                    ref="username"
                    v-model="loginForm.username"
                    name="username"
                    type="text"
                    tabindex="1"
                    auto-complete="on"
                    placeholder="Username"
                />
            </el-form-item>

            <el-form-item prop="password" class="mb-3 relative">
                <span class="svg-container">
                    <svg-icon icon-class="password" />
                </span>
                <el-input
                    :key="passwordType"
                    ref="passwordRef"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="Password"
                    name="password"
                    tabindex="2"
                    auto-complete="on"
                    @keyup.enter="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
            </el-form-item>

            <el-button
                :loading="loading"
                type="primary"
                style="width: 100%; margin-bottom: 30px"
                @click.prevent="handleLogin"
            >
                Login
            </el-button>

            <div class="tips">
                <span style="margin-right: 20px">username: admin</span>
                <span> password: any</span>
            </div>
        </el-form>
    </div>
</template>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}

/* reset element-ui css */
.login-container {
    .el-input {
        display: inline-block;
        height: 49px;
        width: 85%;
        .el-input__wrapper {
            background: $bg;
            box-shadow: none;
            border: none;
            height: 49px;
            input {
                background: $bg;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;
                caret-color: $cursor;

                &:-webkit-autofill {
                    box-shadow: 0 0 0px 1000px $bg inset !important;
                    -webkit-text-fill-color: $cursor !important;
                }
            }
        }
    }

    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 16px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
}
</style>
