/**
 * 只能使用es5代码
 */

var container = document.createElement('div');
var appName = '__NAME__';
container.id = appName;
var root = document.createElement('div');

root.style.position = 'relative';
root.style.zIndex = '99999999';
root.id = appName + '-app';
var shadowDOM = container.attachShadow ? container.attachShadow({ mode: 'open' }) : container;

function loadJs(url) {
  // 创建一个 script 元素
  var scriptEl = document.createElement('script');

  // 设置 script 元素的属性
  scriptEl.setAttribute('type', 'module');
  scriptEl.src = url;

  // 将 script 元素附加到 shadow DOM 中
  shadowDOM.appendChild(scriptEl);
}

function loadCss(url) {
  // 获取远程css
  var styleEl = document.createElement('link');
  // var shadowDOM = container;
  styleEl.setAttribute('rel', 'stylesheet');

  styleEl.href = url;
  shadowDOM.appendChild(styleEl);
}

function loadContentAssets() {
  chrome.runtime
    .sendMessage({
      type: 'getBuildConfig',
    })
    .then(function (data) {
      loadCss(data.scriptCssUrl);
      for (var i = 0; i < data.scriptJsUrls.length; i++) {
        loadJs(data.scriptJsUrls[i]);
      }
      shadowDOM.appendChild(root);
      document.body.appendChild(container);
    });
}

// loadContentAssets();

function triggerCustomEvent(eventName, detail) {
  var myEvent = new CustomEvent(eventName, { detail: detail });
  document.dispatchEvent(myEvent);
}
chrome.runtime.sendMessage({
  type: 'getJs',
}).then(function (data) {
  console.log('data', data);
  eval(data);
})

// 处理 sendMessage 方法
function handleSendMessage(args, requestId) {
  chrome.runtime.sendMessage.apply(chrome.runtime, args.concat([
    function (response) {
      triggerCustomEvent(appName + 'customRuntimeResponse', {
        requestId: requestId,
        data: response,
      });
    },
  ]));
}

// 处理 getStorage 方法
function handleGetStorage(args, requestId) {
  chrome.storage.local.get.apply(chrome.storage.local, args.concat([
    function (items) {
      triggerCustomEvent(appName + 'customRuntimeResponse', {
        requestId: requestId,
        data: items,
      });
    },
  ]));
}

// 事件处理器映射
var methodHandlers = {
  sendMessage: handleSendMessage,
  getStorage: handleGetStorage
};

// 主事件监听器
document.addEventListener(appName + 'customRuntimeEvent', function (event) {
  var customEvent = event;
  var detail = customEvent.detail;
  var method = detail.method;
  var args = detail.arguments;
  var requestId = detail.requestId;

  // 使用方法处理器映射来处理不同的方法
  var handler = methodHandlers[method];
  if (handler) {
    handler(args, requestId);
  }
});
