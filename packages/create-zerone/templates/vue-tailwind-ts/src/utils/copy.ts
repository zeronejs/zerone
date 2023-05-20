import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';
export const handleCopy = async (str: string) => {
const { toClipboard } = useClipboard();
  // const { copy } = useClipboard({ legacy: true });
  try {
    await toClipboard(str);
    ElMessage.success('复制成功');
  } catch (error) {
    console.log(error);
    ElMessage.error('复制失败');
  }
};
