/**
 * 获取构建信息
 */
export const getBuildConfig = async () => {
  const res = await fetch(`${new URL(`dist/js/config.json`, `${__ENV__.VITE_BASE_URL}/`).toString()}`, { cache: 'no-cache' });

  return res.json();
};
