import path from 'path';
import { fileURLToPath } from 'url';
import type { Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * 给所有 createCrxAxios({...}) 的调用按"源文件相对路径"注入一个稳定的 __id__。
 *
 * 为什么需要这个插件：
 * - 多个 service 完全可以共用同一个 baseURL（比如 https://manage.giikin.com/guard 下多个模块）
 * - 如果以 baseURL 做 serviceId 会冲突
 * - 想以源文件路径做 id，又不希望业务侧手动维护字符串
 * - 运行时 stack trace 在 prod bundled 模式下拿不到真实源文件路径
 *   并且 background bundle 和 contentScript bundle 看到的"运行时路径"会不一样，
 *   两端桥接对不上
 *
 * 这里在编译期把每个 createCrxAxios 调用的源文件相对路径写死成 __id__，
 * 同一个源文件在任何 bundle 里都是同一个 __id__，桥接两端必然匹配。
 *
 * 规则：
 * - 形如 `createCrxAxios({ ... })` 的字面量对象会被注入 __id__
 * - 同一个文件里多次调用 createCrxAxios 会得到相同的 __id__，
 *   createCrxAxios 内部 registry.set 时会检测冲突直接抛错
 * - 如果业务自己显式传了 __id__，插件会跳过该调用（不覆盖）
 */
export function crxAxiosIdPlugin(): Plugin {
  return {
    name: 'runtime-axios-id-injector',
    enforce: 'pre',
    transform(code, id) {
      // 跳过依赖、虚拟模块、非脚本文件
      if (id.includes('node_modules')) return null;
      if (id.startsWith('\0') || id.startsWith('virtual:')) return null;

      const pure = id.split('?')[0];

      if (!/\.(ts|js|tsx|jsx|mjs|cjs)$/.test(pure)) return null;
      // createCrxAxios 自身不处理
      if (/createCrxAxios\.[mc]?[jt]sx?$/.test(pure)) return null;
      // 文件里没出现 createCrxAxios 字样的快速跳过
      if (!code.includes('createCrxAxios')) return null;

      // 源文件相对项目根的路径，去掉前缀 src/ 和后缀名，得到形如 "api/basic/request" 的稳定 id
      const relId = path
        .relative(projectRoot, pure)
        .replace(/\\/g, '/')
        .replace(/^src\//, '')
        .replace(/\.[mc]?[jt]sx?$/, '');

      // 匹配 `createCrxAxios ( {` 字面量调用形式（允许中间任意空白/换行）
      // 注意：不会匹配 createCrxAxios(someVar) 这种把配置传变量的形式（这种情况下业务自己要负责传 __id__）
      const callRe = /createCrxAxios\s*\(\s*\{/g;
      let changed = false;
      const newCode = code.replace(callRe, match => {
        // 通过简单字符串检查避免给已显式传过 __id__ 的对象重复注入
        // 这里只看正则匹配到的 `{` 后面的 80 个字符内有没有 __id__
        // 简化处理：保守地总是注入；如果业务代码恰好已传 __id__，对象字面量后写的同名属性会覆盖前面的，
        // 也就是业务的 __id__ 会胜出（JS spec: 后定义的属性覆盖先定义的）
        changed = true;

        return `${match} __id__: ${JSON.stringify(relId)}, `;
      });

      if (!changed) return null;

      return { code: newCode, map: null };
    },
  };
}
