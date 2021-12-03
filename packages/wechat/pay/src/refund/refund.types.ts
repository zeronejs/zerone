/**
 * 申请退款请求参数
 * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_9.shtml
 */
export interface WechatPayRefundServiceApplyParams {
    transaction_id?: string;
    out_trade_no?: string;
    out_refund_no: string;
    reason?: string;
    notify_url?: string;
    funds_account?: string;
    amount: {
        refund: number;
        from?: {
            account: string;
            amount: number;
        }[];
        total: number;
        currency: string;
    };
    goods_detail?: {
        merchant_goods_id: string;
        wechatpay_goods_id?: string;
        goods_name?: string;
        unit_price: number;
        refund_amount: number;
        refund_quantity: number;
    }[];
}
export enum WechatPayRefundServiceRefundStatus {
    SUCCESS = 'SUCCESS',
    CLOSED = 'CLOSED',
    PROCESSING = 'PROCESSING',
    ABNORMAL = 'ABNORMAL',
}
/**
 * 申请退款返回参数
 */
export interface WechatPayRefundServiceApplyResult {
    refund_id: string;
    out_refund_no: string;
    transaction_id: string;
    out_trade_no: string;
    channel: string;
    user_received_account: string;
    success_time?: string;
    create_time: string;
    status: WechatPayRefundServiceRefundStatus;
    amount: {
        total: number;
        refund: number;
        from?: {
            account: string;
            amount: number;
        }[];
        payer_total: number;
        payer_refund: number;
        settlement_refund: number;
        settlement_total: number;
        discount_refund: number;
        currency: string;
    };
    promotion_detail?: {
        promotion_id: string;
        scope: string;
        type: string;
        amount: number;
        refund_amount: number;
        goods_detail?: {
            merchant_goods_id: string;
            wechatpay_goods_id?: string;
            goods_name?: string;
            unit_price: number;
            refund_amount: number;
            refund_quantity: number;
        }[];
    }[];
}
/**
 * 查询退款
 * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_10.shtml
 */
export interface WechatPayRefundServiceQueryParams {
    mchid: string;
    out_refund_no: string;
}

export interface WechatPayRefundServiceQueryResult {
    refund_id: string;
    out_refund_no: string;
    transaction_id: string;
    out_trade_no: string;
    channel: string;
    user_received_account: string;
    success_time?: string;
    create_time: string;
    status: WechatPayRefundServiceRefundStatus;
    funds_account?: string;
    amount: {
        total: number;
        refund: number;
        from?: {
            account: string;
            amount: number;
        }[];
        payer_total: number;
        payer_refund: number;
        settlement_refund: number;
        settlement_total: number;
        discount_refund: number;
        currency: string;
    };
    promotion_detail?: {
        promotion_id: string;
        scope: string;
        type: string;
        amount: number;
        refund_amount: number;
        goods_detail?: {
            merchant_goods_id: string;
            wechatpay_goods_id?: string;
            goods_name?: string;
            unit_price: number;
            refund_amount: number;
            refund_quantity: number;
        }[];
    }[];
}
