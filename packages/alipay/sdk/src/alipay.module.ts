import { DynamicModule, Global, Module } from '@nestjs/common';
import { createInstanceProvider } from './alipay.provider';
import { AlipayService } from './alipay.service';
import { AlipayModuleOptions } from './alipay.types';
import { ALIPAY_MODULE_OPTIONS } from './constants';

@Global()
@Module({})
export class AlipayModule {
	static forRoot(options: AlipayModuleOptions | AlipayModuleOptions[]): DynamicModule {
		return {
			module: AlipayModule,
			providers: [
				{
					provide: ALIPAY_MODULE_OPTIONS,
					useValue: options,
				},
				createInstanceProvider(),
				AlipayService,
			],
			exports: [AlipayService],
		};
	}
}
