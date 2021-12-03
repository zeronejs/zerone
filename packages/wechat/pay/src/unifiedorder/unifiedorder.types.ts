/**
 * 统一下单请求参数
 * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_1.shtml
 */
export interface UnifiedTransactionsRequestParams {
    appid: string;
    mchid: string;
    description: string;
    out_trade_no: string;
    time_expire?: string;
    attach?: string;
    notify_url: string;
    goods_tag?: string;
    amount: {
        total: number;
        currency?: string;
    };
    payer: {
        openid: string;
    };
    detail?: {
        cost_price?: number;
        invoice_id?: string;
        goods_detail?: {
            merchant_goods_id: string;
            wechatpay_goods_id?: string;
            goods_name?: string;
            quantity: number;
            unit_price: number;
        }[];
    };
    scene_info?: {
        payer_client_ip: string;
        device_id?: string;
        store_info?: {
            id: string;
            name?: string;
            area_code?: string;
            address?: string;
        }[];
    };
    settle_info?: {
        profit_sharing?: boolean;
    };
}
/**
 * app/native 下单请求参数
 * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_2_1.shtml
 */
export interface AppNativeUnifiedTransactionsRequestParams {
    appid: string;
    mchid: string;
    description: string;
    out_trade_no: string;
    time_expire?: string;
    attach?: string;
    notify_url: string;
    goods_tag?: string;
    amount: {
        total: number;
        currency?: string;
    };
    detail?: {
        cost_price?: number;
        invoice_id?: string;
        goods_detail?: {
            merchant_goods_id: string;
            wechatpay_goods_id?: string;
            goods_name?: string;
            quantity: number;
            unit_price: number;
        }[];
    };
    scene_info?: {
        payer_client_ip: string;
        device_id?: string;
        store_info?: {
            id: string;
            name?: string;
            area_code?: string;
            address?: string;
        }[];
    };
    settle_info?: {
        profit_sharing?: boolean;
    };
}
