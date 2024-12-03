import fs from 'fs-extra';
import packageJson from '../package.json';
import { isDev, log, port, r } from './utils';
/**资源config.json */
const configJsonUrl = r(`extension/dist/js/config.json`);

const readConfigJson = async () => {
  await fs.ensureFile(configJsonUrl);
  const configJson = await fs.readFile(configJsonUrl);
  if (!configJson.toString()) {
    await fs.writeJSON(configJsonUrl, {});
  }
  return fs.readJSON(configJsonUrl);
};
/**复制共享文件 */
const copySharedFiles = async () => {
  // await fs.copyFile(r(`static/evalCore.min.js`), r(`extension/dist/js/evalCore.min.js`));
  await fs.ensureFile(r(`extension/dist/js/eval5.min.js`));
  await fs.copyFile(r(`static/eval5.min.js`), r(`extension/dist/js/eval5.min.js`));
};

/**
 * 创建 extension/dist/js/background.js
 */
const createBackgroundjs = async (env: Record<string, string>) => {
  // Read template file
  let template = await fs.readFile(r(`static/autoLoad.js`), 'utf-8');

  // Setup background
  template = template.replace('___CONFIGJSON___', new URL(`dist/js/config.json`, `${env.VITE_BASE_URL}/`).toString());
  const assetsCacheConfig = env.VITE_BASE_CDN_URL ? 'undefined' : "'no-cache'";
  template = template.replaceAll('___ASSETSCACHECONFIG___', assetsCacheConfig);
  // Ensure output directory exists and write file
  await fs.ensureFile(r(`extension/dist/js/background.js`));
  await fs.writeFile(r(`extension/dist/js/background.js`), template, 'utf-8');
};

/**设置background相关脚本 */
export const setupBackgroundBootstrap = async (fileNames: string[], env: Record<string, string>) => {
  const cdnUrl = env.VITE_BASE_CDN_URL || env.VITE_BASE_URL;
  const jsUrls = fileNames
    .filter(fileName => fileName.endsWith('.js') || fileName.endsWith('.mjs'))
    .map(fileName => new URL(`dist/background/${fileName}`, `${cdnUrl}/`).toString());
  const configJson = await readConfigJson();

  configJson.backgroundJsUrl = jsUrls[0];

  await Promise.all([createBackgroundjs(env), fs.writeJSON(configJsonUrl, configJson, { spaces: 2 })]);

  log('PRE', `background创建成功`);
};

/**设置ContentScript相关脚本 */
export const setupContentScriptBootstrap = async (
  fileNames: string[],
  env: Record<string, string>,
  options: {
    version: string;
    name: string;
  },
) => {
  // contentScript模板文件 必要的修改
  let contentScript = await fs.readFile(r(`static/contentScript.js`), 'utf-8');
  contentScript = contentScript.replaceAll('__NAME__', options.name);
  await fs.writeFile(r(`extension/dist/contentScripts/contentScript.js`), contentScript, 'utf-8');
  // await fs.copyFile(r(`static/contentScript.js`), r(`extension/dist/contentScripts/contentScript.js`));
  await copySharedFiles();
  const cdnUrl = env.VITE_BASE_CDN_URL || env.VITE_BASE_URL;
  const jsUrls = fileNames
    .filter(fileName => fileName.endsWith('.js') || fileName.endsWith('.mjs'))
    .map(fileName => new URL(`dist/contentScripts/${fileName}`, `${cdnUrl}/`).toString());

  const cssUrl = fileNames
    .filter(fileName => fileName.endsWith('.css'))
    .map(fileName => new URL(`dist/contentScripts/${fileName}`, `${cdnUrl}/`).toString())[0];
  // Read template file
  const configJson = await readConfigJson();
  configJson.scriptJsUrls = jsUrls;
  configJson.scriptBaseJsUrls = [new URL(`dist/contentScripts/contentScript.js`, `${env.VITE_BASE_URL}/`).toString()];
  // configJson.scriptBaseJsUrls = jsUrls;
  configJson.scriptCssUrl = cssUrl;
  configJson.version = options.version;
  configJson.downloadUrl = new URL(`dist/download/${packageJson.displayName}-${options.version}.zip`, `${cdnUrl}/`).toString();
  await fs.writeJSON(configJsonUrl, configJson, { spaces: 2 });

  log('PRE', `content scripts创建成功`);
};
