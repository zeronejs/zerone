import type {
  PostGcrawlerAnalysisHtmlResultResult,
  PostGcrawlerAnalysisHtmlResultResultSku_info_list,
  PostGcrawlerAnalysisHtmlResultResultSkus,
  PostGcrawlerAnalysisHtmlResultResultSkusSku_property_list,
} from '@/api/gassApi/controller';

interface SkuInfoList extends PostGcrawlerAnalysisHtmlResultResultSku_info_list {
  is_select: boolean;
  length: string;
  width: string;
  height: string;
  weight: string;
}
export interface SkusPropertyList extends PostGcrawlerAnalysisHtmlResultResultSkusSku_property_list {
  is_select: boolean;
}
export interface SkusItem extends PostGcrawlerAnalysisHtmlResultResultSkus {
  sku_property_list: SkusPropertyList[];
}

export interface HtmlDataInfo extends PostGcrawlerAnalysisHtmlResultResult {
  sku_info_list: SkuInfoList[];
  skus: SkusItem[];
}
