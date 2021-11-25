export enum WechatPayServiceApplyTradeBillTypes {
	ALL = 'ALL',
	SUCCESS = 'SUCCESS',
	REFUND = 'REFUND',
}
export interface WechatPayBillServiceApplyTradeBillInput {
	bill_date: string;
	bill_type?: WechatPayServiceApplyTradeBillTypes;
	tar_type?: 'GZIP';
}
export interface WechatPayBillServiceApplyBillResult {
	hash_type: string;
	hash_value: string;
	download_url: string;
}

export enum WechatPayServiceApplyFundFlowBillTypes {
	BASIC = 'BASIC',
	OPERATION = 'OPERATION',
	FEES = 'FEES',
}
export interface WechatPayBillServiceApplyFundFlowBillInput {
	bill_date: string;
	account_type?: WechatPayServiceApplyFundFlowBillTypes;
	tar_type?: 'GZIP';
}
