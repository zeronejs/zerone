/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VUE_APP_BASE_API: string
    // 更多环境变量...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }