export interface WechatPayOrderQueryServiceByIdInput {
	mchid: string;
	transaction_id: string;
}
export interface WechatPayOrderQueryServiceByOutTradeNoInput {
	mchid: string;
	out_trade_no: string;
}
/**
 * 交易类型
 */
export enum WechatPayTradeType {
	JSAPI = 'JSAPI',
	NATIVE = 'NATIVE',
	APP = 'APP',
	MICROPAY = 'MICROPAY',
	MWEB = 'MWEB',
	FACEPAY = 'FACEPAY',
}
/**
 * 交易状态
 */
export enum WechatPayTradeState {
	SUCCESS = 'SUCCESS',
	REFUND = 'REFUND',
	NOTPAY = 'NOTPAY',
	CLOSED = 'CLOSED',
	REVOKED = 'REVOKED',
	USERPAYING = 'USERPAYING',
	PAYERROR = 'PAYERROR',
}
/**
 * 订单查询返回值
 * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_2.shtml
 */
export interface WechatPayOrderQueryResult {
	appid: string;
	mchid: string;
	out_trade_no: string;
	transaction_id?: string;
	trade_type?: WechatPayTradeType;
	trade_state: WechatPayTradeState;
	trade_state_desc: string;
	bank_type?: string;
	attach?: string;
	success_time?: string;
	payer: {
		openid: string;
	};
	amount?: {
		total?: number;
		payer_total?: number;
		currency?: string;
		payer_currency?: string;
	};
	scene_info?: {
		device_id?: string;
	};
	promotion_detail?: {
		coupon_id: string;
		name?: string;
		scope?: string;
		type?: string;
		amount: number;
		stock_id?: string;
		wechatpay_contribute?: number;
		merchant_contribute?: number;
		other_contribute?: number;
		currency?: string;
		goods_detail: {
			goods_id: string;
			quantity: number;
			unit_price: number;
			discount_amount: number;
			goods_remark: string;
		}[];
	}[];
}
