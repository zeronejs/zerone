import fs from 'fs-extra';
import { isDev, port, r } from '../scripts/utils';
import type PkgType from '../package.json';

export async function getManifest() {
  const pkg = (await fs.readJSON(r('package.json'))) as typeof PkgType;

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    action: {
      default_icon: './images/app.png',
      default_popup: './dist/popup/index.html',
    },
    options_ui: {
      page: './dist/options/index.html',
      open_in_tab: true,
    },
    background: {
      service_worker: './dist/background/index.mjs',
    },
    icons: {
      16: './images/app.png',
      48: './images/app.png',
      128: './images/app.png',
    },
    permissions: [
      'contextMenus',
      'tabs',
      'notifications',
      'declarativeNetRequest',
      'declarativeNetRequestFeedback',
      'declarativeNetRequestWithHostAccess',
      'storage',
      'cookies',
      'activeTab',
    ],
    host_permissions: ['*://*/*'],
    content_scripts: [
      {
        matches: ['<all_urls>'],
        js: ['dist/contentScripts/index.global.js'],
      },
    ],
    web_accessible_resources: [
      {
        resources: ['dist/contentScripts/style.css'],
        matches: ['<all_urls>'],
      },
    ],
    content_security_policy: {
      extension_pages: isDev
        ? // this is required on dev for Vite script to load
          `script-src \'self\' http://localhost:${port}; object-src \'self\'`
        : "script-src 'self'; object-src 'self'",
    },
  };

  // FIXME: not work in MV3，无法实现content script的热更新
  // 社区给出的其中一个方案是安装Extensions Reloader来手动刷新
  // https://github.com/antfu/vitesse-webext/issues/114
  // if (isDev && false) {
  //   // for content script, as browsers will cache them for each reload,
  //   // we use a background script to always inject the latest version
  //   // see src/background/contentScriptHMR.ts
  //   delete manifest.content_scripts
  //   manifest.permissions?.push('webNavigation')
  // }

  return manifest;
}
