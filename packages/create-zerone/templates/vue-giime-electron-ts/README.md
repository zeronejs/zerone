# vue3-template

1. pnpm create zerone

# 项目技术栈

1. 打包：vite
2. 语言：ts
3. 框架：vue3
4. css：tailwindcss
5. ui框架：element-plus / giime
6. 状态管理：pinia
7. 包管理：pnpm
8. node 22以上

## 项目安装

```sh
pnpm install
```

> 已通过 `postinstall` 脚本自动下载 Electron 二进制，正常无需手动处理。
> 若因网络原因下载失败（`pnpm dev` 报 `spawn ... Electron ENOENT`），手动重跑一次即可：
>
> ```sh
> node node_modules/electron/install.js
> ```

### 本地运行

```sh
pnpm dev
```

### 正式打包

```sh
pnpm build
```

### 测试打包

```sh
pnpm build:test
```
