import { DynamicModule, Module } from '@nestjs/common';
import { WechatPayUnifiedorderService } from './unifiedorder.service';
import { WechatPayApiHostname, WechatPayBaseOptions } from './constants';
export interface WechatPayModuleOptions {
	serial_no: string;
	private_key: string;
	apiv3_private_key: string;
}
@Module({
	providers: [WechatPayUnifiedorderService],
	exports: [WechatPayUnifiedorderService],
})
export class WechatPayModule {
	static forRoot(options: WechatPayModuleOptions): DynamicModule {
		return {
			module: WechatPayModule,
			providers: [
				{
					provide: WechatPayApiHostname,
					useValue: 'https://api.mch.weixin.qq.com/',
				},
				{
					provide: WechatPayBaseOptions,
					useValue: options,
				},
			],
		};
	}
}
