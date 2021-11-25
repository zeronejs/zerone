/**
 * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_4.shtml
 */
export interface WechatPayChoosePayServiceJsapiInput {
	appId: string;
	prepay_id: string;
}
/**
 * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_2_4.shtml
 */
export interface WechatPayChoosePayServiceAppInput {
	appid: string;
	partnerid: string;
	prepayid: string;
}
