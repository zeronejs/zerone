export interface CheckedStoreItem {
  code: string;
  label: string;
  platform: string;
  store_ids: Set<number>;
  shop_ids: Set<string>;
}
