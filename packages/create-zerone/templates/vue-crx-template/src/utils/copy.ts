import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';
import { contentScriptsMessage } from './contentScriptsMessage';
export const handleCopy = async (str: string) => {
  const { toClipboard } = useClipboard();
  // const { copy } = useClipboard({ legacy: true });
  try {
    await toClipboard(str);
    contentScriptsMessage({
      type: 'success',
      message: '复制成功',
    });
    // ElMessage.success('复制成功');
  } catch (error) {
    console.error(error);
    contentScriptsMessage({
      type: 'error',
      message: '复制失败',
    });
    // ElMessage.error('复制失败');
  }
};
