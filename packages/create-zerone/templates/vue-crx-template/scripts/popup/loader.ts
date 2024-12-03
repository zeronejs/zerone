import fs from 'fs-extra';
import { isDev, log, port, r } from '../utils';

export const createLoader = async (fileNames: string[], env: Record<string, string>) => {
  const baseUrl = env.VITE_BASE_URL;
  const cdnUrl = env.VITE_BASE_CDN_URL || env.VITE_BASE_URL;

  // Create loader.json with CSS and JS URLs using CDN
  const loaderJson = {
    css: fileNames.filter(fileName => fileName.endsWith('.css')).map(fileName => new URL(`dist/${fileName}`, `${cdnUrl}/`).toString()),
    js: fileNames
      .filter(fileName => fileName.endsWith('.js') || fileName.endsWith('.mjs'))
      .map(fileName => new URL(`dist/${fileName}`, `${cdnUrl}/`).toString()),
  };

  // Write loader.json
  await fs.ensureFile(r(`extension/dist/popup/loader.json`));
  await fs.writeFile(r(`extension/dist/popup/loader.json`), JSON.stringify(loaderJson, null, 4), 'utf-8');

  const tmp = `// 动态加载 CSS 文件
function loadCSS(url) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

// 动态加载 JS 文件
async function loadJS(url, callback) {
  const response = await fetch(url, {
    cache: 'no-cache',
  });
  const scriptText = await response.text();
  // console.log('scriptText', scriptText);
  // 使用 Function 构造函数动态执行代码片段
  // const dynamicFunction = new Function(scriptText);
  // dynamicFunction();
  const interpreter = new eval5.Interpreter(self, {
    timeout: 1000,
  });
  interpreter.evaluate(scriptText);
}

const fetchJson = async(url) => {
  const res = await fetch(url, {
    cache: 'no-cache',
  })
  return res.json();
}

fetchJson('${new URL('dist/popup/loader.json', baseUrl).toString()}').then((json) => {
  // Load CSS files
  if (json.css && Array.isArray(json.css)) {
    json.css.forEach(cssUrl => {
      loadCSS(cssUrl);
    });
  }

  // Load JS files
  if (json.js && Array.isArray(json.js)) {
    json.js.forEach(async (jsUrl) => {
      await loadJS(jsUrl);
    });
  }
}).catch(error => {
  console.error('Error loading resources:', error);
});`;

  await fs.ensureFile(r(`extension/dist/popup/loader.js`));
  await fs.writeFile(r(`extension/dist/popup/loader.js`), tmp, 'utf-8');

  const createHtml = async () => {
    const loaderHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body style="min-width: 100px">
  <div id="app">正在加载中.....</div>
</body>
<script src="../js/eval5.min.js"></script>
<script type="module" crossorigin src="./loader.js"></script>
</script>

</html>
`;

    await fs.ensureFile(r(`extension/dist/popup/loader.html`));
    await fs.writeFile(r(`extension/dist/popup/loader.html`), loaderHtml, 'utf-8');
  };
  await createHtml();
};
