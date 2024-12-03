export interface PlatformGatherInterface {
  isDetails(): boolean;
  isList(): boolean;
  getList(): any[];
  getAllItemUrl(): any[];
  isAllItemUrl(): boolean;
  getParams(): { body?: string; url: string };
}
