import { gstoreApiList } from './gstoreApi/apiList';
import { getBuildConfig } from './getBuildConfig';
const commonApiList = [
  {
    name: 'getBuildConfig',
    fn: getBuildConfig,
  },
] as const;
export const apiList = [...gstoreApiList, ...commonApiList] as const;
