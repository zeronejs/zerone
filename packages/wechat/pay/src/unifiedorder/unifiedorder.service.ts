import { Injectable } from '@nestjs/common';
import {
	UnifiedTransactionsRequestParams,
	AppNativeUnifiedTransactionsRequestParams,
} from '../unifiedorder/unifiedorder.types';
import { WechatPayFetchService, WechatPayUnifiedorderUrl } from '../common/fetch.service';

/**
 * 下单服务
 */
@Injectable()
export class WechatPayUnifiedorderService {
	constructor(private readonly fetchService: WechatPayFetchService) {}
	async jsapi(params: UnifiedTransactionsRequestParams) {
		const url: WechatPayUnifiedorderUrl = {
			method: 'POST',
			pathname: '/v3/pay/transactions/jsapi',
		};
		return this.fetchService.fetchWechat<{ prepay_id: string }>(params.mchid, url, params);
	}
	async app(params: AppNativeUnifiedTransactionsRequestParams) {
		const url: WechatPayUnifiedorderUrl = {
			method: 'POST',
			pathname: '/v3/pay/transactions/app',
		};
		return this.fetchService.fetchWechat<{ prepay_id: string }>(params.mchid, url, params);
	}

	async native(params: AppNativeUnifiedTransactionsRequestParams) {
		const url: WechatPayUnifiedorderUrl = {
			method: 'POST',
			pathname: '/v3/pay/transactions/native',
		};
		return this.fetchService.fetchWechat<{ code_url: string }>(params.mchid, url, params);
	}
}
