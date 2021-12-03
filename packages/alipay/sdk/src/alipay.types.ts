import AlipaySdk, { AlipaySdkConfig } from 'alipay-sdk';

export interface AlipayModuleOptions extends AlipaySdkConfig {
	name?: string;
}
export interface AlipayModuleInstances {
	defaultKey: string;
	instances: Map<string, AlipaySdk>;
	size: number;
}
