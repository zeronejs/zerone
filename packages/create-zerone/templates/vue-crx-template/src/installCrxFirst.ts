/**
 * 副作用模块 —— 把 @giime/api 内置 service 的 axios factory 切到 CRX 版本。
 *
 * 为什么单独抽一个文件：ESM 会先把 entry 里所有 import 求值完（包括 `import Giime from 'giime'`
 * 触发的 `@giime/api/*\/request.ts`），再跑 entry body。把 installIntoGiimeApi() 直接写在
 * entry body 里太晚 —— 那些 request.ts 已经用默认 factory 创建过 service 了。
 *
 * 做法：把 install 放在自己的模块里，entry 第一行 `import './installCrxFirst'`，
 * ESM 保证这个模块（连带其内部 install 副作用）在下一个 import 开始前完整求值。
 */
import { installIntoGiimeApi } from '@giime/crx';

installIntoGiimeApi();
