import * as path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import serveIndex from 'serve-index';
import { log } from './utils';
// 定义 __filename 和 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 5600;
const publicDir = path.resolve(__dirname, '../extension');

// 添加CORS中间件
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 设置静态文件目录
app.use(express.static(publicDir));

// 使用 serve-index 中间件来显示目录列表
app.use('/', serveIndex(publicDir, { icons: true }));

// 启动服务器
app.listen(port, () => {
  log('静态资源服务器启动于：', `http://localhost:${port}`);
});
