import { Injectable } from '@nestjs/common';
import { WechatPayChoosePayService } from './choosePay';
import { WechatPayCloseService, WechatPayCloseServiceByOutTradeNoInput } from './close';
import { WechatPayDecodeService, WechatPayDecodeServiceNotifyInput } from './common/decode.service';
import {
	WechatPayOrderQueryService,
	WechatPayOrderQueryServiceByIdInput,
	WechatPayOrderQueryServiceByOutTradeNoInput,
} from './orderQuery';
import {
	WechatPayRefundService,
	WechatPayRefundServiceApplyParams,
	WechatPayRefundServiceQueryParams,
} from './refund';
import { AppNativeUnifiedTransactionsRequestParams, WechatPayUnifiedorderService } from './unifiedorder';

/**
 * native支付
 */
@Injectable()
export class WechatPayNativeService {
	constructor(
		private readonly unifiedorderService: WechatPayUnifiedorderService,
		private readonly orderQueryService: WechatPayOrderQueryService,
		private readonly closeService: WechatPayCloseService,
		private readonly choosePayService: WechatPayChoosePayService,
		private readonly refundService: WechatPayRefundService,
		private readonly decodeService: WechatPayDecodeService
	) {}
	/**
	 * 下单
	 */
	async unifiedorder(params: AppNativeUnifiedTransactionsRequestParams) {
		return this.unifiedorderService.native(params);
	}
	/**
	 * 订单查询
	 */
	async queryById(params: WechatPayOrderQueryServiceByIdInput) {
		return this.orderQueryService.byId(params);
	}
	/**
	 * 订单查询
	 */
	async queryByOutTradeNo(params: WechatPayOrderQueryServiceByOutTradeNoInput) {
		return this.orderQueryService.byOutTradeNo(params);
	}
	/**
	 * 关闭订单
	 */
	async close(params: WechatPayCloseServiceByOutTradeNoInput) {
		return this.closeService.byOutTradeNo(params);
	}
	/**
	 * 申请退款
	 */
	async refund(mchid: string, params: WechatPayRefundServiceApplyParams) {
		return this.refundService.apply(mchid, params);
	}
	/**
	 * 退款查询
	 */
	async refundQuery(params: WechatPayRefundServiceQueryParams) {
		return this.refundService.query(params);
	}
	/**
	 * 解密微信支付/退款通知数据
	 */
	async decodeResource(params: WechatPayDecodeServiceNotifyInput) {
		return this.decodeService.resource(params);
	}
}
