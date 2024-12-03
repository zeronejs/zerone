import { YangkeduoGather } from './YangkeduoGather';
import { TemuGather } from './TemuGather';
import { Ali88Gather } from './Ali88Gather';
import type { PlatformGatherInterface } from './PlatformInterface';
export const gatherList = [
  { case: location.href.includes('yangkeduo'), class: YangkeduoGather },
  { case: location.href.includes('pinduoduo'), class: YangkeduoGather },
  { case: location.href.includes('temu.'), class: TemuGather },
  { case: location.href.includes('1688.'), class: Ali88Gather },
] as const;
export const getPlatformsGather = (): PlatformGatherInterface | undefined => {
  const findItem = gatherList.find(item => item.case);
  return findItem ? new findItem.class() : undefined;
};
