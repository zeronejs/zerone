import { getBuildConfig } from './getBuildConfig';
import { gsyncApiList } from './gsync/apiList';

const commonApiList = [
  {
    name: 'getBuildConfig',
    fn: getBuildConfig,
  },
] as const;

export const apiList = [...commonApiList, ...gsyncApiList] as const;
