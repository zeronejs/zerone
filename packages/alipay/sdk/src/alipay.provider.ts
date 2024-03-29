import { Provider } from '@nestjs/common';
import AlipaySdk from 'alipay-sdk';
import { randomUUID } from 'crypto';
import { AlipayModuleInstances, AlipayModuleOptions } from './alipay.types';
import { ALIPAY_INSTANCES, ALIPAY_MODULE_OPTIONS } from './constants';

export const createInstanceProvider = (): Provider => ({
    provide: ALIPAY_INSTANCES,
    useFactory: (options: AlipayModuleOptions | AlipayModuleOptions[]): AlipayModuleInstances => {
        const instances = new Map<string, AlipaySdk>();
        let defaultKey: string = randomUUID();
        if (Array.isArray(options)) {
            for (const option of options) {
                const key = option.name || defaultKey;
                if (instances.has(key)) {
                    throw new Error(`${option.name || 'default'} instance is exists`);
                }
                instances.set(key, new AlipaySdk(option));
            }
        } else {
            if (options.name && options.name.length !== 0) {
                defaultKey = options.name;
            }
            instances.set(defaultKey, new AlipaySdk(options));
        }
        return {
            defaultKey,
            instances,
            size: instances.size,
        };
    },
    inject: [ALIPAY_MODULE_OPTIONS],
});
