# vue3-crx-template

谷歌插件模板

1. pnpm create vite
2. 添加 tailwindcss [link](https://tailwindcss.com/docs/guides/vite#vue)
3. 安装 element-plus [link](https://element-plus.org/zh-CN/guide/installation.html)

# 项目技术栈

1. 打包：vite
2. 语言：ts
3. 框架：vue3
4. css：tailwindcss
5. ui框架：element-plus
6. 状态管理：pinia
7. 包管理：pnpm
8. node 16以上

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

## 目录结构
├── extension
|  ├── dist
|  |  ├── assets
|  |  ├── background
|  |  |  └── index.mjs
|  |  ├── contentScripts
|  |  |  ├── contentScript.js
|  |  |  ├── index.global.js
|  |  |  └── style.css
|  |  ├── download
|  |  |  └── 三方商品采集-pro-4.0.2.zip
|  |  ├── js
|  |  |  ├── config.json    # 静态资源配置地址
|  |  |  └── eval5.min.js
|  |  ├── options
|  |  |  └── index.html
|  |  └── popup
|  |     └── index.html
|  ├── images
|  |  ├── app.png
|  |  └── blue-38.png
|  └── manifest.json
├── index.html
├── scripts
|  ├── autoLoad.ts          # 热更新脚本
|  ├── buildZip.ts          # 打包成zip的脚本
|  ├── manifest.ts
|  ├── popup
|  |  └── loader.ts
|  ├── prepare.ts
|  ├── server.ts
|  ├── sharedConfig.ts
|  ├── utils.ts
|  ├── vite.background.config.ts
|  ├── vite.content.config.ts
|  └── vite.popup.config.ts
├── static
|  ├── autoLoad.js          # 热更新代码模板
|  ├── contentScript.js     # contentScript.js模板
|  └── eval5.min.js
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.node.json