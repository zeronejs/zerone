import { Inject, Injectable } from '@nestjs/common';
import { randomChars } from '@zeronejs/utils';
import axios, { Method, AxiosResponse } from 'axios';
import { WechatPayModuleOptions } from '../wechatPay.module';
import { rsaSign } from './sign';
import { WechatPayApiHostname, WechatPayBaseOptions } from './constants';
export interface WechatPayUnifiedorderUrl {
	method: Method;
	pathname: string;
}
@Injectable()
export class WechatPayFetchService {
	constructor(
		@Inject(WechatPayApiHostname) private readonly baseUrl: string,
		@Inject(WechatPayBaseOptions) private readonly baseOptions: WechatPayModuleOptions
	) {}
	fetchWechat<T>(
		mchid: string,
		url: WechatPayUnifiedorderUrl,
		bodyParams: object | null = null
	): Promise<AxiosResponse<T>> {
		const Authorization = this.createAuthorization(mchid, url, bodyParams);
		return axios({
			url: this.baseUrl + url.pathname,
			method: url.method,
			data: bodyParams,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: Authorization,
			},
		});
	}
	createAuthorization(mchid: string, url: WechatPayUnifiedorderUrl, bodyParams: object | null = null) {
		const onece_str = randomChars();
		const bodyParamsStr = bodyParams ? JSON.stringify(bodyParams) : '';
		const timestamp = Math.floor(Date.now() / 1000);

		const signature = rsaSign(
			`${url.method}\n${url.pathname}\n${timestamp}\n${onece_str}\n${bodyParamsStr}\n`,
			this.baseOptions.private_key
		);
		return `WECHATPAY2-SHA256-RSA2048 mchid="${mchid}",nonce_str="${onece_str}",timestamp="${timestamp}",signature="${signature}",serial_no="${this.baseOptions.serial_no}"`;
	}
}
