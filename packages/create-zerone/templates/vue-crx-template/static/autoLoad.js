const window = self;
importScripts('./eval5.min.js');
const CONFIGJSON = '___CONFIGJSON___';

// 获取配置信息
async function getConfig() {
  try {
    const response = await fetch(CONFIGJSON, {
      cache: 'no-cache',
    });
    const config = await response.json();
    return config;
  } catch (error) {
    console.error('Failed to fetch config:', error);
    return null;
  }
}

// 主要初始化逻辑
async function initialize() {
  // 获取配置
  const config = await getConfig();
  if (!config) {
    console.error('Failed to load configuration');
    return;
  }

  const { backgroundJsUrl, scriptBaseJsUrls } = config;

  // 从远端获取并执行background代码片段
  async function fetchAndExecuteCode() {
    try {
      const response = await fetch(backgroundJsUrl, {
        cache: ___ASSETSCACHECONFIG___,
      });
      const scriptText = await response.text();
      // console.log('scriptText', scriptText);
      const interpreter = new eval5.Interpreter(self, {
        timeout: 1000,
      });
      interpreter.evaluate(scriptText);
    } catch (error) {
      console.error('Failed to fetch or execute remote script:', error);
    }
  }

  // 将js注入到window上
  function executeScript(scriptContentList) {
    try {
      scriptContentList.forEach(scriptContent => {
        const js = `${scriptContent}`;
        eval5.Interpreter.globalContextInFunction = window;
        const interpreter = new eval5.Interpreter(window, {
          timeout: 1000,
        });
        interpreter.evaluate(js);
      });
    } catch (x) {
      console.log('x', x);
    }
  }

  // 动态加载js
  async function loadScript(tabId) {
    try {
      const fetchList = scriptBaseJsUrls.map(item => fetch(item, { cache: ___ASSETSCACHECONFIG___ }).then(response => response.text()));
      const responseList = await Promise.all(fetchList);

      await chrome.scripting.executeScript({
        target: { tabId },
        func: executeScript,
        args: [responseList],
      });

      console.log('注入成功');
    } catch (error) {
      console.log('当前页面无法注入:', error);
    }
  }

  // 启动时立即获取并执行background代码片段
  await fetchAndExecuteCode();

  // 设置消息监听，处理content scripts注入
  chrome.webNavigation.onCommitted.addListener(({ tabId, frameId, url }) => {
    // Filter out non main window events.
    if (frameId !== 0) return;
    loadScript(tabId);
  });
}

// 启动初始化
initialize();
